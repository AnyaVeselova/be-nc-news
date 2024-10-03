const {
  setAllUsers,
  selectUserByUsername,

  verifyUser,
} = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
  setAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.loginUser = (req, res, next) => {
  const { username, password } = req.body;
  verifyUser(username, password)
    .then((user, token) => {
      res.status(200).send({ user, token });
    })
    .catch(next);
};
