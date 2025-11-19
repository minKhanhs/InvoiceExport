const userService = require('../services/userService.js');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const created = await userService.createUser(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};
