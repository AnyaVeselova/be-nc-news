const { allTopics } = require("./controllers/topics.controllers");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/topics", allTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
