const { allTopics } = require("./controllers/topics.controllers");
const { allEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById } = require("./controllers/getArticle.controllers");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/topics", allTopics);
app.get("/api", allEndpoints);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
