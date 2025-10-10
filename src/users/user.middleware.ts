import { createUserSchema } from "./user.schema";
export const validateCreateUser = (req: any, res: any, next: any) => {
  const result = createUserSchema.safeParse(req.body);
  
  if (!result.success) {
    const formattedErrors = result.error.format();
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: formattedErrors
    });
  }
  
  // If validation passes, add the validated data to the request object
  req.validatedData = result.data;
  next();
};
