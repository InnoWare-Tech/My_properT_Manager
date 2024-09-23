import ErrorDetails from "./customError.interface";

export default class CustomError extends Error {
  details: ErrorDetails;

  constructor(message: string, details: ErrorDetails) {
    super(message);
    this.details = details;
    this.name = "CustomError";
  }
}
