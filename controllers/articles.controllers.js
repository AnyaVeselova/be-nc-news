const { selectArticleById } = require("../models/selectArticleById.models");
const { setArticles } = require("../models/setArticles.models");

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
