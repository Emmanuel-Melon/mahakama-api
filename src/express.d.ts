import { UserAttrs } from "./users/user.middleware";
import { RequestFingerprint } from "./middleware/fingerprint";
import { User } from "./users/users.schema";
import useragent from "express-useragent";

interface UserAgentInfo extends useragent.Details {
  ip: string;
  method: string;
  path: string;
  timestamp: Date;
  deviceType: "mobile" | "tablet" | "desktop";
}

declare global {
  namespace Express {
    interface Request {
      validatedData?: UserAttrs;
      fingerprint?: RequestFingerprint;
      user?: User;
      userIP?: string;
      token?: string;
      requestId: string;
      userAgent?: UserAgentInfo;
    }
  }
}
