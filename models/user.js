const { Schema, model } = require("mongoose");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const joi = require("joi");

dotenv.config();

const userSchema = Schema(
  {
    name: String,
    username: { type: String, unique: true },
    phone: { type: String, default: "none" },
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: "customer" },
    provider: { type: String, default: "manual" },
    googleId: Number,
    facebookId: Number,
    photo: { type: String, default: "none" },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = (_id, username, role, photo) => {
  const token = JWT.sign(
    {
      _id: _id,
      username: username,
      role: role,
      photo: photo,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

const validate = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().required().min(3),
    password: joi.string().min(4).max(15).required(),
  });
  return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validate;
