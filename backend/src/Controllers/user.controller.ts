import { Request, Response, NextFunction } from "express";
import { injectable, container } from "tsyringe";
import { UserService } from "../Services/user.services";
import AsyncHandler from "../Middlewares/asyncHandler.middleware";
import ApiResponse from "../Utils/apiResponse.model";
import { IUser, Role } from "../Models/User";
import passport from "passport";
import CustomError from "../Utils/customError.model";

@injectable()
class UserController {
  private roles: Role[] = [];
  constructor(
    private userService: UserService,
    private asyncHandler: AsyncHandler
  ) {}

  // getUser = this.asyncHandler.handle(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const response = container.resolve(ApiResponse<IUser>);

  //     const userId = req.params.id;

  //     const user = await this.userService.getUsers();

  //     response.setResponseSuccessful("Successful.");
  //     response.setData(user as any);

  //     res.json(response.toJSON());
  //   }
  // );

  setUsersSelectedRole = this.asyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      const { role }: { role: string } = req.body;

      if (!req.isAuthenticated()) {
        throw new CustomError("User not authenticated.", { statusCode: 401 });
      }

      const roleExists = (req.user as IUser).roles.some(
        (userRole: Role) => userRole.roleName === role
      );

      if (!roleExists) {
        throw new CustomError("Invalid role selection.", { statusCode: 400 });
      }

      (req.user as IUser).selectedRole = role;

      await (req.user as IUser).save();

      return res.json({ message: `Role set to ${role}` });
    }
  );

  createUser = this.asyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      // const response =
      //   container.resolve<ApiResponse<Partial<IUser>>>(ApiResponse);
      const response = container.resolve(ApiResponse<Role[]>);

      const user = await this.userService.createUser(req.body);

      response.setResponseSuccessful("Successful.");

      this.roles = user.roles;

      response.setData(this.roles);

      req.login(user, (err) => {
        if (err) {
          throw new CustomError("Authentication failed.", { statusCode: 500 });
        }

        return res.json(response.toJSON());
      });
    }
  );

  loginUser = this.asyncHandler.handle(
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "local",
        async (err: Error, user: IUser, info: any) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            const response = container.resolve(ApiResponse<null>);

            response.setIsAuthenticated(false);
            response.setIsAuthorised(false);
            response.setState(false);
            response.setMessage(info.message);

            return res.status(404).json(response.toJSON());
          }

          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }

            req.user = {
              ...user,
              password: "",
            } as IUser;

            const response = container.resolve(ApiResponse<Role[]>);

            this.roles = user.toObject().roles;

            response.setResponseSuccessful("User logged in successfully.");

            response.setData(this.roles);

            return res.status(200).json(response.toJSON());
          });
        }
      )(req, res, next);
    }
  );
}

export default UserController;
