import { RequestFingerprint } from "../middleware/fingerprint";

declare global {
  namespace Express {
    interface Request {
      fingerprint?: RequestFingerprint;
      user?: {
        id: string;
      };
    }
  }
}
