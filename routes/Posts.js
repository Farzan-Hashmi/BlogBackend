const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models"); //Posts model for the database
const { validateToken } = require("../middlewares/AuthMiddleware");
const { body, validationResult } = require("express-validator");

//gets all posts
router.get("/", async (req, res) => {
  const listofPosts = await Posts.findAll({
    order: [["updatedAt", "ASC"]],
    include: [Likes, Comments],
  });
  res.json(listofPosts);
});

// get a single post by id
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id; //gets id from https://black-white-blog.herokuapp.com//posts/byId/:id
  const post = await Posts.findByPk(id); //find by primary key or the id column in this case
  res.json(post);
});

router.get("/user/:UserId", async (req, res) => {
  const UserId = req.params.UserId;
  const posts = await Posts.findAll({
    where: { UserId: UserId },
    include: [Likes, Comments],
  });

  // go to posts table and get return every single element where the postId column is the same as the postId from the request params
  res.json(posts);
});

// create a new post
router.post(
  "/",
  body("title").not().isEmpty().withMessage("Title is required"),
  body("postText").not().isEmpty().withMessage("PostText is required"),

  validateToken,
  async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post); // sequelize has a method where if you pass an object with the same schema as the model it will add it to the database
    res.json(post);
  }
);

router.delete("/:id", validateToken, async (req, res) => {
  const deleteId = req.params.id;
  const post = await Posts.findByPk(deleteId);
  if (!post) {
    return res.json({ error: "Post not found" });
  }
  const count = await Posts.destroy({ where: { id: deleteId } }); // count is the number of rows deleted
  res.json({ Deleted: count + " rows" });
});

module.exports = router; //access the router from index.js
