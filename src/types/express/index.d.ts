import { CreateUserInput } from "../../users/user.middleware";

declare global {
  namespace Express {
    interface Request {
      validatedData?: CreateUserInput;
    }
  }
}
