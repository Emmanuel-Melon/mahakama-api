import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import useragent from 'express-useragent';

export interface RequestFingerprint {
  hash: string;
  ip: string;
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  accept: string;
  acceptLanguage: string;
  acceptEncoding: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  dnt?: string | string[];
  upgradeInsecureRequests?: string | string[];
  timestamp: Date;
}

export const fingerprintMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get client IP (respecting proxies)
  const ip = req.ip || 
             req.connection.remoteAddress || 
             (req.socket && req.socket.remoteAddress) || 
             'unknown';

  // Get user agent string
  const userAgent = req.headers['user-agent'] || '';
  const accept = req.headers['accept'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  // Parse user agent for additional details
  const ua = useragent.parse(userAgent);
  
  // Create a fingerprint object with stable client characteristics
  const fingerprintData = {
    // Network
    ip: ip,
    
    // Browser and OS
    browser: ua.browser,
    browserVersion: ua.version,
    os: ua.os,
    platform: ua.platform,
    
    // Headers
    accept: accept,
    acceptLanguage: acceptLanguage.split(',')[0], // primary language only
    acceptEncoding: acceptEncoding,
    
    // Device capabilities
    isMobile: ua.isMobile,
    isTablet: ua.isTablet,
    isDesktop: ua.isDesktop,
    
    // Additional browser features (from headers)
    dnt: Array.isArray(req.headers['dnt']) ? req.headers['dnt'][0] : req.headers['dnt'],
    upgradeInsecureRequests: Array.isArray(req.headers['upgrade-insecure-requests']) 
      ? req.headers['upgrade-insecure-requests'][0] 
      : req.headers['upgrade-insecure-requests'],
    
    // Screen resolution (if available from client-side, would need to be sent in request)
    // screenResolution: req.headers['x-screen-resolution']
  };

  // Create a hash of the fingerprint data
  const fingerprintString = JSON.stringify(fingerprintData);
  const fingerprintHash = createHash('sha256')
    .update(fingerprintString)
    .digest('hex');

  // Create the full fingerprint object
  const fingerprint: RequestFingerprint = {
    ...fingerprintData,
    hash: fingerprintHash,
    timestamp: new Date(),
    // Ensure all required fields are present
    browser: ua.browser || 'unknown',
    browserVersion: ua.version || 'unknown',
    os: ua.os || 'unknown',
    platform: ua.platform || 'unknown',
    accept: accept,
    acceptLanguage: acceptLanguage.split(',')[0] || '',
    acceptEncoding: acceptEncoding as string,
    isMobile: ua.isMobile,
    isTablet: ua.isTablet,
    isDesktop: ua.isDesktop,
    ip: ip as string
  };

  // Attach fingerprint to request object
  (req as any).fingerprint = fingerprint;

  // Log the fingerprint (without sensitive data)
  const { ip: _, ...loggableFingerprint } = fingerprint;
  console.log('Browser Fingerprint:', loggableFingerprint);

  next();
};

// The type extension is now in src/types/express.d.ts
