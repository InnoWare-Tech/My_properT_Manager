import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../Models/User";
import { compare } from "bcryptjs";
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { UserService } from "../Services/user.services";

dotenv.config();

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Use 'email' instead of 'username'
    async (
      email: string,
      password: string,
      done: (
        err: any,
        user?: Partial<IUser> | false,
        options?: { message: string }
      ) => void
    ) => {
      try {
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, { _id: user._id });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your database
        let user = await User.findOne({ googleId: profile.id });

        const userService = new UserService();

        if (!user) {
          const photos = profile!.photos || [];

          user = await userService.createUser({
            googleId: profile.id,
            email: profile.emails?.[0].value as string,
            name: profile.displayName,
            password: profile.displayName,
            profilePicture: photos[0].value,
          });
        }

        return done(null, { _id: user._id });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "emails", "name"], // Request relevant profile fields
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, name } = profile;
        const email = emails && emails[0].value;

        let user = await User.findOne({ facebookId: id });

        // If the user is not in the database, create a new one
        if (!user) {
          const userService = new UserService();

          user = await userService.createUser({
            facebookId: id,
            email,
            name: `${name?.givenName} ${name?.familyName}`,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: Partial<IUser>, done) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: IUser | null) => void) => {
    try {
      const existingUser = await User.findById(id);

      if (!existingUser) {
        return done(null, null);
      }

      done(null, existingUser);
    } catch (err) {
      done(err);
    }
  }
);

export default passport;
