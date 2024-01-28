const { Schema, model } = require("mongoose");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const joi = require("joi");

dotenv.config();

const userSchema = Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    role: String,
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = () => {
  const token = JWT.sign(
    {
      username: this.username,
      _id: this._id,
      role: this.role,
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
