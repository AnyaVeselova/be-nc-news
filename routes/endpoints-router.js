const endpointsRouter = require("express").Router();

const { allEndpoints } = require("../controllers/endpoints.controllers");

endpointsRouter.get("/", allEndpoints);

module.exports = endpointsRouter;
