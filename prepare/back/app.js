const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, content: 2 },
    { id: 1, content: 2 },
    { id: 1, content: 2 },
    { id: 1, content: 2 },
  ]);
});

app.post("/api/posts", (req, res) => {
  res.json({ id: 1, content: 2 });
});

app.listen(3065, () => {
  console.log("서버 실행중");
});
