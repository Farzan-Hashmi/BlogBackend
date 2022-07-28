const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  body("PostId").not().isEmpty().withMessage("Post Id required"),
  validateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const found = await Likes.findOne({
      where: { PostId: req.body.PostId, UserId: req.user.id },
    });

    if (!found) {
      await Likes.create({ PostId: req.body.PostId, UserId: req.user.id });
    } else {
      await Likes.destroy({
        where: { PostId: req.body.PostId, UserId: req.user.id },
      });
    }
    res.json("SUCCESS");
  }
);

module.exports = router;
