const passport = require("passport");
const local = require("./local");
const google = require("./google");
const { User } = require("../models");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const express = require("express");
const app = express();

const options = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
  google();
};
