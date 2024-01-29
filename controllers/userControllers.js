const bcrypt = require("bcrypt");
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

module.exports.login = async (req, res) => {
  let user = await User.findOne({
    $or: [{ email: req.body.data }, { username: req.body.data }],
  });
  if (!user) return res.status(400).send("Invalid email/username");

  const validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser) return res.status(400).send("Invalid password!");

  const token = user.generateJWT(user._id, user.username, user.role);
  return res.status(200).send({
    message: "Login Successful!",
    token: token,
  });
};
