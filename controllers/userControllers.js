const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const { Profile } = require("../models/profile");
const _ = require("lodash");

module.exports.register = async (req, res) => {
  const { error } = validate(
    _.pick(req.body, ["username", "email", "password"])
  );
  if (error) return res.status(400).send(error.details[0].message);

  user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (user) return res.status(400).send("Email/ Username already used!");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);

  user = new User({ ...req.body, password: password });
  profile = new Profile({
    user: user._id,
  });

  const token = user.generateJWT(
    user._id,
    user.username,
    user.role,
    user.photo
  );

  await user.save();
  await profile.save();
  return res.status(201).send({
    message: "Registration Successful!",
    token: token,
  });
};

module.exports.login = async (req, res) => {
  let user = await User.findOne({
    $or: [{ email: req.body.data }, { username: req.body.data }],
    provider: "manual",
  });
  if (!user) return res.status(400).send("Invalid email/username");

  const validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser) return res.status(400).send("Invalid password!");

  const token = user.generateJWT(
    user._id,
    user.username,
    user.role,
    user.photo
  );
  return res.status(200).send({
    message: "Login Successful!",
    token: token,
  });
};
