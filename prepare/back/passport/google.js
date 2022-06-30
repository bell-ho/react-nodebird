const passport = require("passport");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const callbackUrl = require("../config/callbackUrl");
//구글 로그인 전략
dotenv.config();
const { User } = require("../models");
const GoogleStrategy = require("passport-google-oauth").OAuthStrategy;

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackUrl,
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
              email: profile.emails[0].value,
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
