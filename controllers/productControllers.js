const _ = require("lodash");
const { Product, validate } = require("../models/product");

module.exports.createProduct = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = new Product(req.body);
  await product.save();
  return res.status(201).send({
    message: "Product created successfully",
    data: _.pick(product, ["name", "description", "price", "_id", "quantity"]),
  });
};

module.exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  return res.send(products);
};
