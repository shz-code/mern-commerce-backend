const { Schema, model } = require("mongoose");
const joi = require("joi");

const productCategory = Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: Number,
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const validate = (product) => {
  const schema = joi.object({
    name: joi.string().max(255).required(),
    description: joi.string().max(2000),
    price: joi.number().required(),
    quantity: joi.number().required(),
    category: joi.string().required(),
  });
  return schema.validate(product);
};

module.exports.Product = model("Product", productCategory);
module.exports.validate = validate;
