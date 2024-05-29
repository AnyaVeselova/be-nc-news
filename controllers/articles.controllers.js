const {
  selectArticleById,
  setArticles,
  setComments,
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
      if (!article) {
        return Promise.reject({ status: 404, msg: "article was not found" });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  setComments(article_id)
    .then(({ rows }) => {
      res.status(200).send(rows);
    })
    .catch(next);
};
