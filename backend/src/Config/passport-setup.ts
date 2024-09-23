import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../Models/User";
import { compare } from "bcryptjs";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user: IUser | null = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
//       clientSecret:
//         process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Create new user if not already exists
//           user = await new User({
//             googleId: profile.id,
//             email: (profile as any).emails[0].value,
//             name: profile.displayName,
//           }).save();
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, false);
//       }
//     }
//   )
// );

// Serialize and deserialize user

passport.serializeUser((user, done) => {
  done(null, {
    id: (user as IUser)._id,
    selectedRole: (user as IUser).selectedRole,
  });
});

passport.deserializeUser(
  async (sessionData: { id: string; selectedRole?: string }, done) => {
    try {
      const user: IUser | null = await User.findById(sessionData.id);
      if (user) {
        user.selectedRole = sessionData.selectedRole || "Guest";
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  }
);

export default passport;
