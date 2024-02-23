const { Profile } = require("../models/profile");
const { User } = require("../models/user");
const _ = require("lodash");

module.exports.getProfile = async (req, res) => {
  profile = await Profile.findOne({ user: req.params.id }).populate("user", [
    "name",
    "phone",
    "email",
  ]);
  if (!profile) return res.status(400).send("profile not found");

  return res.send(profile);
};

module.exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("profile not found");

  const { name, phone, address, city, state, country, postcode } = req.body;

  user.name = name;
  user.phone = phone;

  await user.save();

  const profile = await Profile.findOne({ user: req.params.id }).populate(
    "user",
    ["name", "phone", "email"]
  );
  if (profile.user._id.toString() != req.params.id)
    return res.status(403).send("Forbidden");

  profile.address = address;
  profile.city = city;
  profile.state = state;
  profile.country = country;
  profile.postcode = postcode;

  await profile.save();

  return res.send(profile);
};
