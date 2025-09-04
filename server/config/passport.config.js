import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        return done(null, user || false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-email",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
          return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "local-mobile",
  new LocalStrategy(
    {
      usernameField: "mobile",
      passwordField: "password",
    },
    async (mobile, password, done) => {
      try {
        const user = await User.findOne({ mobile });
        if (!user || !(await user.comparePassword(password)))
          return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "providers.name": "google",
          "providers.id": profile.id,
        });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.providers.push({ name: "google", id: profile.id });
            await user.save();
            return done(null, user);
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              providers: [{ name: "google", id: profile.id }],
            });
            return done(null, user);
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "email", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "providers.name": "facebook",
          "providers.id": profile.id,
        });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.providers.push({ name: "facebook", id: profile.id });
            await user.save();
            return done(null, user);
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              providers: [{ name: "facebook", id: profile.id }],
            });
            return done(null, user);
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      profileFields: ["id", "displayName", "email", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "providers.name": "github",
          "providers.id": profile.id,
        });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.providers.push({ name: "github", id: profile.id });
            await user.save();
            return done(null, user);
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              providers: [{ name: "github", id: profile.id }],
            });
            return done(null, user);
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
