const {
  selectCommentsByArticleId,
  setComment,
  selectCommentById,
  patchCommentById,
  removeCommentById,
} = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models.js");
const { checkExists } = require("../db/seeds/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then(({ rows }) => {
      res.status(200).send(rows);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  const promises = [
    selectArticleById(article_id),
    checkExists("users", "username", username),
  ];

  Promise.all(promises)
    .then(() => {
      return setComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })

    .catch(next);
};

exports.updateCommentVotesByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  const promises = [
    selectCommentById(comment_id),
    patchCommentById(comment_id, inc_votes),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const updatedComment = resolvedPromises[1];
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).end();
    })

    .catch(next);
};
