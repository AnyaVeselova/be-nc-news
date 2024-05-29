const {
  selectArticleById,
  setArticles,
  selectCommentsByArticleId,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  setArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

//put it in another controller FOR comments
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
