const passport = require("passport");
const local = require("./local");
const { user: User } = require("../models");

module.exports = () => {
  //아이디만 들고있음
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //라우터에 접근할시 deserializeUser에 접근하여 사용자의 정보를 복구하여 req.user를 만듦
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });
  local();
};
