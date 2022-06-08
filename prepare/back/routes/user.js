const express = require("express");
const { user: User, post } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
//로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    //passport 에러 잡기
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: post,
          },
          {
            model: User,
            as: "followers",
          },
          {
            model: User,
            as: "followings",
          },
        ],
      });
      return res.json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

//로그아웃
router.post("/logout", isLoggedIn, (req, res, next) => {
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.send("ok");
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디 입니다");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send("ok");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
