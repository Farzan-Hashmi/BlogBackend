const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { body, validationResult } = require("express-validator");

//gets comment based on post id
router.get("/:PostId", async (req, res) => {
  const postId = req.params.PostId; // gets PostId from https://black-white-blog.herokuapp.com//comments/:PostId
  const comments = await Comments.findAll({ where: { postId: postId } }); // go to comments table and get return every single element where the postId column is the same as the postId from the request params
  res.json(comments);
});

//get comment based on user id
router.get("/user/:UserId", async (req, res) => {
  const UserId = req.params.UserId;
  const comments = await Comments.findAll({ where: { UserId: UserId } });
  res.json(comments);
});

//create comment
// needs CommentBody, and PostId in body. Username gets extracted from JWT in the AuthMiddleware.js
router.post(
  "/",
  body("CommentBody").not().isEmpty().withMessage("CommentBody is required"),
  body("PostId").isInt().not().isEmpty().withMessage("PostId is required"),
  validateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const comment = req.body; //we are assuming that the body follows the same schemas as the comments table (needs CommentBody and PostId and username)
    comment.username = req.user.username; //add the username to the comment object  same thing as comment['username'] = req.user.username;
    comment.UserId = req.user.id;
    await Comments.create(comment); // sequelize has a method where if you pass an object with the same schema as the model it will add it to the database
    res.json(comment);
  }
);

router.delete("/:id", validateToken, async (req, res) => {
  const deleteId = req.params.id;
  const comment = await Comments.findByPk(deleteId);
  if (!comment) {
    return res.json({ error: "Comment not found" });
  }
  const count = await Comments.destroy({ where: { id: deleteId } }); // count is the number of rows deleted
  res.json({ Deleted: count + " rows" });
});

module.exports = router; //export the router containing all the routes in this folder so that index.js can access them can work
