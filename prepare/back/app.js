const express = require("express");
const app = express();
const cors = require("cors");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const passportConfig = require("./passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결");
  })
  .catch(console.error);
passportConfig();

app.use(
  cors({
    origin: ["http://localhost:3000", "nodebird.com", "http://54.180.86.190"],
    credentials: true,
  })
);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}
app.use(morgan("dev"));

app.use("/", express.static(path.join(__dirname, "uploads")));

// req body를 가져오기 위한
app.use(express.json()); // front 에서 json 형태로
app.use(express.urlencoded({ extended: true })); // form submit 방식으로 할 때
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/posts", postsRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

//error 미들웨어는 마지막에
app.use((err, req, res, next) => {});

app.listen(3060, () => {
  console.log("서버 실행 중");
});
