const express = require("express");
const router = express.Router();
const { Users } = require("../models"); //Posts model for the database
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { validateToken } = require("../middlewares/AuthMiddleware");

//create a new user (registration)
router.post(
  "/",

  body("username")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 18 })
    .withMessage("Username is required"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 18 })
    .withMessage("Password is required"),

  async (req, res) => {
    const { username, password } = req.body; //destructuring the req.body object since there is going to be a username and password field
    // hash the password
    const users = await Users.findOne({ where: { username: username } });
    if (users) {
      return res.status(400).json({ error: "Username already exists" });
    }

    bcrypt.hash(password, 10).then((hash) => {
      Users.create({ username: username, password: hash });
    });
    res.json("SUCCESS");
  }
);

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }
  bcrypt.compare(password, user.password).then((isMatch) => {
    if (isMatch) {
      // return a jwt token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.SECRETKEY
      );
      res.json({ token: token, username: user.username, id: user.id });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  });
});

router.get("/verify", validateToken, (req, res) => {
  res.json({
    username: req.user.username,
    id: req.user.id,
    success: "token verified",
  });
});

module.exports = router; //access the router from index.js
