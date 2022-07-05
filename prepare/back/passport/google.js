const express = require("express");
const app = express();
const dotenv = require("dotenv");
const callbackUrl = require("../config/callbackUrl");

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

dotenv.config();
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackUrl,
        // callbackURL: "http://localhost:3065/user/auth/google/callback/",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "google" },
          });
          if (exUser) {
            return done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile?.email[0].value,
              nickname: profile.displayName,
              snsId: profile.id,
              provider: "google",
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
