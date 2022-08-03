const express = require("express"); //instance of the framework express
const db = require("./models");
const cors = require("cors"); //to whitelist our react frontend and allow it to access the api/backend

require("dotenv").config(); //to get the environment variables

const app = express();

//middleware:
app.use(cors());
//middleware to access body of the request
app.use(express.json()); // the next() is already called in the express.json()

// Routers
const postsRouter = require("./routes/Posts");
const commentsRouter = require("./routes/Comments");
const usersRouter = require("./routes/Users");
const likesRouter = require("./routes/Likes");
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", usersRouter);
app.use("/like", likesRouter);

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running");
  });
}); //sync and start the api. the app.listen is the starting point and we check to see if every table in models (file) exists in the database and create them if they dont
