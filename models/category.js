const { Schema, model } = require("mongoose");
const joi = require("joi");

const categorySchema = Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const validate = (category) => {
  const schema = joi.object({
    name: joi.string().max(10).required(),
  });
  return schema.validate(category);
};

module.exports.Category = model("Category", categorySchema);
module.exports.validate = validate;
