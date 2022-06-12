const express = require("express");

const router = express.Router();
const { post, comment, image, user } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    const newPost = post.create({
      content: req.body.content,
      userId: req.user.id,
    });
    const fullPost = await post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: image,
        },
        {
          model: comment,
          include: [
            {
              model: user, //댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: user,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const targetPost = await post.findOne({
      where: { id: req.params.postId },
    });
    if (!targetPost) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const newComment = await comment.create({
      content: req.body.content,
      postId: parseInt(req.params.postId, 10),
      userId: req.user.id,
    });
    const fullComment = await comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: user,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
