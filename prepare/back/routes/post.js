const express = require("express");
const path = require("path");
const router = express.Router();
const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");
const multer = require("multer");
const fs = require("fs");

try {
  fs.accessSync("uploads");
} catch (e) {
  console.log("업로드 폴더가 없어서 생성됨");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // ex) testFile.png
      const ext = path.extname(file.originalname); //확장자 추출 => .png
      const basename = path.basename(file.originalname, ext); // testFile
      done(null, basename + "_" + new Date().getTime() + ext); // 시간초를 파일이름에 더해줌
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20MB
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
        )
      );
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      //db엔 파일의 주소만 갖고있는다 => 파일자체를 가지고있으면 db가 너무 무거워짐, 캐싱도 안됨 => 파일자체는 S3 클라우드에 올려서 CDN 캐싱을 적용하고 => 디비엔 파일을 접근할 수 있는 주소만 저장함
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른사람
          as: "Likers",
          attributes: ["id"],
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
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch(`/:postId/like`, isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete(`/:postId/unlike`, isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.json({ PostId: parseInt(req.params.postId, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post(`/images`, isLoggedIn, upload.array("image"), (req, res, next) => {
  try {
    res.json(req.files.map((v) => v.filename));
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
