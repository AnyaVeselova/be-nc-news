const getEndpoints = require("../endpoints.json");

exports.allEndpoints = (req, res, next) => {
  res.status(200).send(getEndpoints);
};
