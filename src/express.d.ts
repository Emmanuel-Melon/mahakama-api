import { CreateUserInput } from "./users/user.middleware";
import { RequestFingerprint } from "./middleware/fingerprint";
import { User } from "./users/user.schema";

declare global {
  namespace Express {
    interface Request {
      validatedData?: CreateUserInput;
      fingerprint?: RequestFingerprint;
      user?: User;
      userIP?: string;
      token?: string;
    }
  }
}
