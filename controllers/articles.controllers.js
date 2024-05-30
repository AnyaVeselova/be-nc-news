const {
  selectArticleById,
  setArticles,
  patchArticleById,
} = require("../models/articles.models");
const { checkExists } = require("../db/seeds/utils");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const promises = [setArticles(topic)];

  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];

      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const promises = [
    selectArticleById(article_id),
    patchArticleById(article_id, inc_votes),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const updatedArticle = resolvedPromises[1];
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
