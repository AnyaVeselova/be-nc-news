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
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleVotesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)

  .post(postComment);

module.exports = articlesRouter;
