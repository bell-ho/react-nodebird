const prod = process.env.NODE_ENV === "production";
const frontUrl = prod ? "https://supercola.co.kr" : "http://localhost:3000";
module.exports = frontUrl;
