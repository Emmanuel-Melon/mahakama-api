import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import useragent from "express-useragent";
import { AuthJobType, authQueue } from "../auth/queue";
import { findByFingerprint } from "../users/operations/users.find";
import { upstash } from "../lib/upstash";

// Cache fingerprints by a composite key (IP + basic UA info)
const fingerprintCache = new Map<string, string>(); // cacheKey -> fingerprintHash

const FINGERPRINT_CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds
const CACHE_PREFIX = "fingerprint:";

// Helper to create a quick lookup key
function createCacheKey(ip: string, ua: useragent.Details): string {
  return `${CACHE_PREFIX}${ip}:${ua.browser}:${ua.version.split(".")[0]}:${ua.os}:${ua.isMobile}`;
}

export const fingerprintMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userAgent = req.headers["user-agent"] || "";
  const acceptLanguage = req.headers["accept-language"] || "";
  const ua = useragent.parse(userAgent);

  // Create cache key
  const cacheKey = createCacheKey(req.userIP!, ua);

  // Check Redis cache first
  let fingerprintHash = await upstash.getClient().get(cacheKey);

  console.log("fingerprintHash", fingerprintHash);
  console.log("type of fingerprintHash", typeof fingerprintHash);

  if (fingerprintHash) {
    // Already cached - just lookup user
    const user = await findByFingerprint(fingerprintHash as string);
    if (user) {
      req.user = user;
      console.log("User found (from cache):", user.id);
    }
    return next();
  }

  // Not cached - generate fingerprint
  const stableFingerprintData = {
    ip: req.userIP!,
    browser: ua.browser || "unknown",
    browserVersion: ua.version.split(".")[0] || "unknown",
    os: ua.os || "unknown",
    platform: ua.platform || "unknown",
    acceptLanguage: acceptLanguage.split(",")[0].trim() || "",
    isMobile: ua.isMobile,
    isTablet: ua.isTablet,
    isDesktop: ua.isDesktop,
  };

  const fingerprintString = JSON.stringify(stableFingerprintData);
  fingerprintHash = createHash("sha256")
    .update(fingerprintString)
    .digest("hex");

  console.log("Fingerprint string:", fingerprintString);
  console.log("Hash:", fingerprintHash);

  // Cache it for future requests
  await upstash.getClient().set(cacheKey, fingerprintHash, {
    ex: FINGERPRINT_CACHE_TTL,
  });
  console.log("Stable fingerprint data:", {
    ip: req.userIP,
    browser: ua.browser,
    browserVersion: ua.version.split(".")[0],
    os: ua.os,
    platform: ua.platform,
    acceptLanguage: acceptLanguage.split(",")[0].trim(),
    isMobile: ua.isMobile,
    isTablet: ua.isTablet,
    isDesktop: ua.isDesktop,
  });

  // Check if user exists
  const user = await findByFingerprint(fingerprintHash as string);
  console.log("user", user);
  if (user) {
    req.user = user;
    console.log("User found (new fingerprint):", user.id);
    return next();
  }

  // Create full fingerprint object for new users
  const fingerprint = {
    ...stableFingerprintData,
    hash: fingerprintHash,
    timestamp: new Date(),
    browser: ua.browser || "unknown",
    browserVersion: ua.version || "unknown",
    accept: req.headers["accept"] || "",
    acceptEncoding: req.headers["accept-encoding"] || "",
  };

  req.fingerprint = fingerprint;

  console.log("New fingerprint generated:", {
    hash: fingerprintHash,
    cacheKey,
  });

  // Queue user creation job
  authQueue.enqueue(
    AuthJobType.BrowserFingerprint,
    {
      ...stableFingerprintData,
      hash: fingerprintHash,
      userAgent: userAgent,
    },
    {
      jobId: fingerprintHash as string,
      removeOnComplete: true,
      removeOnFail: false,
    },
  );

  next();
};
