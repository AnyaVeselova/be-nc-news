const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateCommentVotesByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", updateCommentVotesByCommentId);

module.exports = commentsRouter;
