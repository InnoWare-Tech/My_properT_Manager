import { Request, Response, NextFunction } from "express";
import { injectable, container } from "tsyringe";
import { UserService } from "../Services/user.services";
import AsyncHandler from "../Middlewares/asyncHandler.middleware";
import ApiResponse from "../Utils/apiResponse.model";
import { IUser } from "../Models/User";
import passport from "passport";
import CustomError from "../Utils/customError.model";
import { Role } from "../Models/Role";

@injectable()
class UserController {
  private message: string = "No message provided.";
  private data: Partial<IUser> = {};

  constructor(
    private userService: UserService,
    private asyncHandler: AsyncHandler,
    private response: ApiResponse<Partial<IUser>>
  ) {}

  setUsersSelectedRole = this.asyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { role }: { role: string } = req.body;

      await this.userService.verifyAndSelectRole(role, req.user as IUser);

      this.message = `Role set to ${role}.`;

      this.data = { ...(req.user as IUser).toObject(), password: "" };

      this.response.setSuccessfulResponse(this.message, this.data);

      return res.status(200).json(this.response.toJSON());
    }
  );

  createUser = this.asyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userService.createUser(req.body);

      this.message = "Successful.";

      this.data = { ...(user as IUser).toObject(), password: "" };

      this.response.setSuccessfulResponse(this.message, this.data);

      req.login(user, (err) => {
        if (err) {
          throw new CustomError("Authentication failed.", { statusCode: 500 });
        }

        return res.status(201).json(this.response.toJSON());
      });
    }
  );

  loginUserWithLocalCredentials = this.asyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "local",
        async (err: Error, { _id }: IUser, info: any) => {
          if (err) {
            return next(err);
          }

          if (!_id) {
            this.message = info.message || `Failed to authenticate user.`;

            this.response.setUnauthenticatedResponse(this.message);

            return res.status(404).json(this.response.toJSON());
          }

          const user = await this.userService.getUserById(_id);

          req.logIn({ _id }, (err) => {
            if (err) {
              return next(err);
            }

            this.message = "User logged in successfully.";

            this.data = user as IUser;

            this.response.setSuccessfulResponse(this.message, this.data);

            return res.status(200).json(this.response.toJSON());
          });
        }
      )(req, res, next);
    }
  );

  loginUserWithGoogleCredentials = this.asyncHandler.handler(
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  loginRedirect = this.asyncHandler.handler(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "google",
        async (err: Error, { _id }: IUser, info: any) => {
          if (err) {
            return next(err);
          }

          if (!_id) {
            throw new CustomError("Authentication failed.", {
              statusCode: 401,
            });
          }

          const user = await this.userService.getUserById(_id);

          req.logIn({ _id }, (err) => {
            if (err) {
              return next(err);
            }

            this.message = "User logged in successfully.";

            this.data = user as IUser;

            this.response.setSuccessfulResponse(this.message, this.data);

            return res.status(200).json(this.response.toJSON());
          });
        }
      )(req, res, next);
    }
  );
}

export default UserController;
