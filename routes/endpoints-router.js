const endpointsRouter = require("express").Router();

const e = require("express");
const { allEndpoints } = require("../controllers/endpoints.controllers");

endpointsRouter.get("/", allEndpoints);

module.exports = endpointsRouter;
