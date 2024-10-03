const usersRouter = require("express").Router();

const {
  getAllUsers,
  getUserByUsername,
  loginUser,
} = require("../controllers/users.controllers");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/:login", loginUser);
module.exports = usersRouter;
