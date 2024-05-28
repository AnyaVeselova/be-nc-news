const { selectArticleById } = require("../models/selectArticleById.models");

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
