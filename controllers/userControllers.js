const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

module.exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered!");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);

  user = new User({ ...req.body, password: password });

  const token = user.generateJWT(user._id, user.username, user.role);

  await user.save();

  return res.status(201).send({
    message: "Registration Successful!",
    token: token,
  });
};

module.exports.login = async (req, res) => {};
