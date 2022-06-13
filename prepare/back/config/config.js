const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "localhost",
    port: 3300,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "localhost",
    port: 3300,
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-nodebird",
    host: "localhost",
    port: 3300,
    dialect: "mysql",
  },
};
