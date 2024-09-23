import { injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import IApiResponse from "../Utils/apiResponse.interface";
import CustomError from "../Utils/customError.model";

@injectable()
class AsyncHandler {
  handle(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (
      req: Request,
      res: Response<IApiResponse<null>>,
      next: NextFunction
    ) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        let response: IApiResponse<null> = {
          state: false,
          message: "",
          isAuthorised: true,
          isAuthenticated: true,
        };

        // Handle MongoDB duplicate key error
        if (error instanceof MongoServerError && error.code === 11000) {
          const errorMessage = error.errmsg;
          const collectionRegex = /collection: (\S+)/;
          const match = errorMessage.match(collectionRegex);

          if (match && match[1]) {
            if (match[1].split(".")[1] === "users") {
              response.message = "Invalid user credentials.";
              response.isAuthorised = false;
              response.isAuthenticated = false;
            } else {
              response.message = `${error.keyValue.email} already exists in ${
                match[1].split(".")[1]
              }`;
            }
          } else {
            response.message = "Collection name not found in error message.";
          }
          return res.status(409).json(response);
        }

        if (error instanceof Error) {
          response.message = error.message;

          if ("details" in error) {
            const errDetails = (error as CustomError).details;
            response.isAuthenticated = errDetails?.isAuthenticated ?? true;
            response.isAuthorised = errDetails?.isAuthorised ?? true;
          }
        }

        if (error instanceof CustomError) {
          return res.status(error.details.statusCode).json(response);
        }

        return res.status(500).json(response);
      }
    };
  }
}

export default AsyncHandler;
