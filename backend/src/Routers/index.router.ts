import { injectable } from "tsyringe";
import { Router } from "express";
import UserRouter from "./user.router"; // Import your UserRouter

@injectable()
export default class AppRouter {
  public appRouter: Router;

  constructor(private userRouter: UserRouter) {
    this.appRouter = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.appRouter.use("/users", this.userRouter.userRouter);
  }
}
