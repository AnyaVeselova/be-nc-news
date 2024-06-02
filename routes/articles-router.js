const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  updateArticleVotesById,
} = require("../controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments.controllers");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", updateArticleVotesById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
