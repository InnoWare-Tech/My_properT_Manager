import { injectable } from "tsyringe";
import UserController from "../Controllers/user.controller";
import { Router } from "express";
import VerifySession from "../Middlewares/verify-session.middleware";

@injectable()
export default class UserRouter {
  public userRouter: Router;
  constructor(
    private userController: UserController,
    private verifySession: VerifySession
  ) {
    this.userRouter = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    //Creating of registing a new user to the application
    this.userRouter.route("/").post(this.userController.createUser);

    //Authenticating an already registered user to the application
    this.userRouter.post(
      "/auth",
      this.userController.loginUserWithLocalCredentials
    );

    //Selecting the user role inorder to access the application base on the specified role
    this.userRouter.put(
      "/select-role",
      this.verifySession.Verify,
      this.userController.setUsersSelectedRole
    );

    //Authenticating a user using google
    this.userRouter.get(
      "/auth/google",
      this.userController.loginUserWithGoogleCredentials
    );

    //This is the route where by google get redirected to after the signup/signin process
    this.userRouter.get(
      "/auth/google/callback",
      this.userController.loginRedirect
    );
  }
}
