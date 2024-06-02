const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateCommentVotesByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(updateCommentVotesByCommentId);

module.exports = commentsRouter;
