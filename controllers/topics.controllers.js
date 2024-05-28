const { getTopics } = require("../models/topics.models");

exports.allTopics = (req, res) => {
  getTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
