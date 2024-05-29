const { setTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  setTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
