import { Request, Response, NextFunction } from "express-serve-static-core";
import AsyncHandler from "../Middlewares/asyncHandler.middleware";
import ApiResponse from "../Utils/apiResponse.model";
import User, { IUser } from "../Models/User";
import { injectable } from "tsyringe";
import CustomError from "../Utils/customError.model";
import { acceptedRoleNames } from "../Models/Role";

@injectable()
export default class VerifySession {
  constructor(private asyncHandler: AsyncHandler) {}

  Verify = this.asyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        throw new CustomError("You are not authenticated", {
          statusCode: 401,
          isAuthenticated: false,
          isAuthorised: false,
        });
      }

      const id: string = (req.session as any).passport.user;

      const user = (req.session as any).passport.user;

      if (req.session) {
        const expires = req.session.cookie.expires;

        if (!expires) {
          req.session.cookie.expires = new Date(Date.now() + 60 * 15 * 1000);
          const selectedRole: string = req.body.role;

          if (selectedRole === acceptedRoleNames.Guest) {
            //Guest session will be valid for 7days
            req.session.cookie.maxAge = 60 * 60 * 24 * 7 * 1000;
          }
          if (selectedRole === acceptedRoleNames.Tenant) {
            //Tenant session will be valid for 1day
            req.session.cookie.maxAge = 60 * 60 * 24 * 1000;
          }
          if (selectedRole === acceptedRoleNames.CareTaker) {
            //CareTaker session will be valid for 1hour
            req.session.cookie.maxAge = 60 * 60 * 1000;
          }
          if (selectedRole === acceptedRoleNames.Owner) {
            //Owner session will be valid for 15mins
            req.session.cookie.maxAge = 60 * 15 * 1000;
          }
        } else {
          const timeRemaining = expires.getTime() - Date.now();

          if (timeRemaining <= 60 * 1000) {
            req.session.cookie.expires = new Date(Date.now() + 60 * 15 * 1000);

            const selectedRole: string = req.body.role;

            if (selectedRole === acceptedRoleNames.Guest) {
              //Guest session will be valid for 7days
              req.session.cookie.maxAge = 60 * 60 * 24 * 7 * 1000;
            }
            if (selectedRole === acceptedRoleNames.Tenant) {
              //Tenant session will be valid for 1day
              req.session.cookie.maxAge = 60 * 60 * 24 * 1000;
            }
            if (selectedRole === acceptedRoleNames.CareTaker) {
              //CareTaker session will be valid for 1hour
              req.session.cookie.maxAge = 60 * 60 * 1000;
            }
            if (selectedRole === acceptedRoleNames.Owner) {
              //Owner session will be valid for 15mins
              req.session.cookie.maxAge = 60 * 15 * 1000;
            }

            req.session.save((err: Error) => {
              if (err) {
                throw new CustomError(
                  `${
                    (req.user as IUser).name
                  }, your session has expired. Please log in again.`,
                  {
                    statusCode: 401,
                    isAuthenticated: false,
                    isAuthorised: false,
                  }
                );
              }

              next();
            });
          } else {
            next();
          }
        }
      } else {
        next();
      }
    }
  );

  VerifyRole(role: string) {
    return this.asyncHandler.handler(
      async (req: Request, res: Response, next: NextFunction) => {
        const userSelectedRole = (req.user as IUser).selectedRole;

        if (role !== userSelectedRole) {
          throw new CustomError(
            "You are not permitted to access this section.",
            {
              statusCode: 403,
              isAuthenticated: true,
              isAuthorised: false,
            }
          );
        }

        next();
      }
    );
  }
}
