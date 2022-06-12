const express = require("express");
const { post, user, image, comment } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await post.findAll({
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [comment, "createdAt", "DESC"],
      ],
      include: [
        { model: user, attributes: ["id", "nickname"] },
        { model: image },
        {
          model: comment,
          include: [
            {
              model: user, //
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
