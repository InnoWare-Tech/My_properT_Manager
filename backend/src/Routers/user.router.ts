import { injectable } from "tsyringe";
import UserController from "../Controllers/user.controller";
import { Router } from "express";

@injectable()
export default class UserRouter {
  public userRouter: Router;
  constructor(private userController: UserController) {
    this.userRouter = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.userRouter
      .route("/")
      // .get(this.userController.getUser)
      .post(this.userController.createUser);

    this.userRouter.post("/auth", this.userController.loginUser);

    this.userRouter.put(
      "/select-role",
      this.userController.setUsersSelectedRole
    );
  }
}
