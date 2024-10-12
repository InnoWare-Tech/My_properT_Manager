import express, { Application } from "express";
import "reflect-metadata"; // Required for tsyringe
import { container, injectable } from "tsyringe";
import AppRouter from "./Routers/index.router";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "./Config/passport-setup";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

@injectable()
class App {
  private app: Application;

  constructor(private appRouter: AppRouter) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.connectDB();
    // Express session setup
  }

  private initializeMiddleware() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 5,
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
        },
        store: MongoStore.create({
          mongoUrl:
            process.env.MONGO_URI || "mongodb://localhost:27017/my_database",
        }),
        rolling: true, // Reset cookie Max-Age on every response
      })
    );

    // Initialize passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Middleware for parsing JSON requests
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    // Use the appRouter's routes
    this.app.use("/api/v1", this.appRouter.appRouter);
  }

  private async connectDB() {
    try {
      const conn = await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname"
      );
      console.log(`mongoDB Connected`);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1); // Exit the process on connection failure
    }
  }

  public start(port: number | string = 3000) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default App;
