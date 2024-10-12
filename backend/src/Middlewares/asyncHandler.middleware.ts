import { injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import CustomError from "../Utils/customError.model";
import ApiResponse from "../Utils/apiResponse.model";

@injectable()
class AsyncHandler {
  constructor(private response: ApiResponse<null>) {}

  private handleDuplicate(error: MongoServerError) {
    const errorMessage = error.errmsg;

    const collectionRegex = /collection: (\S+)/;

    const match = errorMessage.match(collectionRegex);

    if (match && match[1]) {
      if (match[1].split(".")[1] === "users") {
        //setting a failed response if the user is duplicate in the collection
        this.response.setFailedResponse(
          "Invalid user credentials.",
          false,
          false
        );
      } else {
        //setting a failed response if the collection is having thesame properties provided
        const key = Object.keys(error.keyValue)[0]; // dynamically gets the key, e.g. 'name'
        const value = error.keyValue[key];

        this.response.setFailedResponse(
          `${value} already exists in ${match[1].split(".")[1]}`
        );
      }
    } else {
      this.response.setFailedResponse(
        "Collection name not found in error message."
      );
    }

    return this.response.toJSON();
  }

  private handleOtherError(error: CustomError) {
    const { isAuthenticated, isAuthorised } = error.details;

    this.response.setFailedResponse(
      error.message,
      isAuthenticated,
      isAuthorised
    );

    return this.response.toJSON();
  }

  handler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        //handle mongoDb cast type errors
        if ((error as Error).name === "CastError") {
          this.response.setFailedResponse("Invalid request type.");

          return res.status(500).json(this.response.toJSON());
        }

        // Handle MongoDB duplicate key error
        if (error instanceof MongoServerError && error.code === 11000) {
          return res.status(409).json(this.handleDuplicate(error));
        }

        if (error instanceof CustomError) {
          const { statusCode } = error.details;

          return res.status(statusCode).json(this.handleOtherError(error));
        }

        // return res.status(500).json(response);
      }
    };
  }
}

export default AsyncHandler;
