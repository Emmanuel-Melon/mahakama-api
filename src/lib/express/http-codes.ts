export type HttpResponse = {
  statusCode: number;
  code: string;
  message: string;
};

export const internalServerError: HttpResponse = {
  code: "INTERNAL_SERVER_ERROR",
  message: "Failed to execute HTTP Request. Please try again later.",
  statusCode: 500,
};

export const requestValidationError: HttpResponse = {
  code: "VALIDATION_ERROR",
  message:
    "Failed to process HTTP Request. Please check your input and try again.",
  statusCode: 400,
};

export const requestSuccessResponse: HttpResponse = {
  code: "REQUEST_SUCCESSFUL",
  message: "Request has been processed",
  statusCode: 200,
};
