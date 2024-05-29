const { getTopics } = require("./controllers/topics.controllers");
const { allEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getAllArticles,
  updateArticleVotesById,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
} = require("./controllers/comments.controllers");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api", allEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticleVotesById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
