const { Schema, model } = require("mongoose");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const joi = require("joi");

dotenv.config();

const userSchema = Schema(
  {
    name: String,
    username: { type: String, unique: true },
    phone: Number,
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = (_id, username, role) => {
  const token = JWT.sign(
    {
      _id: _id,
      username: username,
      role: role,
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
    password: joi.string().max(15).required(),
  });
  return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validate;
