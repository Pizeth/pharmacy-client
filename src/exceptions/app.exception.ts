class AppError extends Error {
  // You can add any custom properties you need
  public readonly context?: string;
  public readonly errorData?: unknown;
  public readonly statusCode: number;
  constructor(
    message: string,
    statusCode: number,
    context?: string,
    errorData?: unknown
  ) {
    // The `super()` call passes the main message and status code to the base HttpException.
    // The response object can contain both the message and additional details.
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.errorData = errorData;
    this.name = "AppException";
  }
}

export default AppError;
