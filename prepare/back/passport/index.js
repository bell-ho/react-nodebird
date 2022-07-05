const passport = require("passport");
const local = require("./local");
const google = require("./google");
const { User } = require("../models");
const session = require("express-session");
const express = require("express");
const app = express();

const mysql2 = require("mysql2/promise");

const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const connection = mysql2.createPool(options);

// mysql session store 생성
const sessionStore = new MySQLStore({}, connection); // mysql2 connection 넣기

module.exports = () => {
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );

  passport.serializeUser((user, done) => {
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
