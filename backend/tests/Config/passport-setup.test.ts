import request from "supertest";
import express, { NextFunction } from "express";
import passport from "passport";
import session from "express-session";
import { IUser } from "../../src/Models/User";

// Mocking passport
jest.mock("passport", () => ({
  authenticate: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

// Your Express app setup
const app = express();

app.use(session({ secret: "test", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Sample route to test
app.get(
  "/protected",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    res.json({ message: "Protected route", user: req.user });
  }
);

// Example of mocking the behavior of Passport.js
const mockedAuthenticate = passport.authenticate as jest.Mock;

// Test cases
describe("Auth Tests", () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it("should return protected route for authenticated user", async () => {
    // Mocking the Passport authenticate function
    mockedAuthenticate.mockImplementation((strategy: string, options: any) => {
      return (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "123", email: "test@example.com" }; // Mock user
        next(); // Call next middleware
      };
    });

    const response = await request(app).get("/protected");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Protected route",
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should fail for unauthenticated user", async () => {
    // Mocking the Passport authenticate function to not call next
    mockedAuthenticate.mockImplementation((strategy: string, options: any) => {
      return (req, res, next) => {
        return res.status(401).json({ message: "Unauthorized" });
      };
    });

    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });
});
