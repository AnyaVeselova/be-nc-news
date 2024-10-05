const usersRouter = require("express").Router();

const {
  getAllUsers,
  getUserByUsername,
  loginUser,
  createUser,
} = require("../controllers/users.controllers");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/login", loginUser);
usersRouter.post("/signup", createUser);

module.exports = usersRouter;
