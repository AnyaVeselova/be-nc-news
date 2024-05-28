const { getTopics } = require("../models/topics.models");

exports.allTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "<----");
      next(err);
    });
};
