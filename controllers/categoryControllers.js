const _ = require("lodash");
const { Category, validate } = require("../models/category");

module.exports.createCategory = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(_.pick(req.body, ["name"]));
  await category.save();
  return res.status(201).send({
    message: "Category created successfully",
    data: { name: req.body.name, _id: category._id },
  });
};

module.exports.getCategories = async (req, res) => {
  const categories = await Category.find()
    .sort({ name: 1 })
    .select({ name: 1 });
  return res.send(categories);
};
