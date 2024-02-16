const { Profile } = require("../models/profile");
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
