import { injectable } from "tsyringe";
import { Router } from "express";
import UserRouter from "./user.router"; // Import your UserRouter
import VerifySession from "../Middlewares/verify-session.middleware";

@injectable()
export default class AppRouter {
  public appRouter: Router;

  constructor(
    private userRouter: UserRouter,
    private verifySession: VerifySession
  ) {
    this.appRouter = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.appRouter.use(
      "/users",
      // this.verifySession.Verify,
      this.userRouter.userRouter
    );
  }
}
