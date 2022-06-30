const prod = process.env.NODE_ENV === "production";
const callbackUrl = prod
  ? "https://api.supercola.co.kr/user/auth/google/callback"
  : "http://localhost:3065/user/auth/google/callback";
module.exports = callbackUrl;
