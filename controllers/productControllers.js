const _ = require("lodash");
const { formidable } = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../models/product");

module.exports.createProduct = async (req, res) => {
  let form = formidable({ keepExtensions: true, uploadDir: `./uploads` });

  form.parse(req, (err, fields, files) => {
    const data = {
      name: fields.name[0],
      description: fields.description[0],
      price: fields.price[0],
      quantity: fields.quantity[0],
      category: fields.category[0],
    };
    if (err) return res.status(400).send("Something went wrong!!!");

    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(data);

    // Input field name photo
    if (files.photo) {
      fs.readFile(files.photo[0].filepath, async (err, data) => {
        if (err) return res.status(400).send("Error in image");
        product.photo.data = data;
        product.photo.contentType = files.photo[0].mimetype;
        try {
          const result = await product.save();
          return res.status(201).send({
            message: "Product created successfully",
            data: _.pick(result, [
              "name",
              "description",
              "price",
              "category",
              "quantity",
              "_id",
            ]),
          });
        } catch (err) {
          return res.status(500).send("Internal Server Error!");
        }
      });
    } else {
      return res.status(400).send("No image provided");
    }
  });
};

module.exports.getProducts = async (req, res) => {
  // Query String
  const orderBy = req.query.order === "desc" ? -1 : 1;
  const sortBy = req.query.sort ? req.query.sort : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 5;

  const products = await Product.find()
    .select({ photo: 0 })
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .populate("category", "name");
  return res.send(products);
};

module.exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .select({ photo: 0 })
    .populate("category", "name");
  if (!product) return res.status(400).send("Product not found");
  return res.send(product);
};

module.exports.getPhoto = async (req, res) => {
  const product = await Product.findById(req.params.id).select({
    photo: 1,
    _id: 0,
  });
  if (!product) return res.status(400).send("Product not found");
  return res
    .set("Content-Type", product.photo.contentType)
    .send(product.photo.data);
};

module.exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Product not found");

  return res.send(product);
};
