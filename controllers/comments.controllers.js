const {
  selectCommentsByArticleId,
  setComment,
} = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.models.js");

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

  if (!username || !body) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  setComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
