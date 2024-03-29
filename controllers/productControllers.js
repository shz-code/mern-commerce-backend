const _ = require("lodash");
const { formidable } = require("formidable");
const fs = require("fs");
const { Product, validate } = require("../models/product");
const { Profile } = require("../models/profile");

module.exports.createProduct = async (req, res) => {
  let form = formidable({ keepExtensions: true, uploadDir: `./uploads` });

  form.parse(req, (err, fields, files) => {
    // Turn array values to string
    const data = {};
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        data[key] = fields[key].join("");
      }
    }
    if (err) return res.status(400).send("Something went wrong!!!");

    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product({ ...data, slug: data.name.toLowerCase() });

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
  const sortBy = req.query.sort ? req.query.sort : "_id";
  const orderBy = req.query.order === "desc" ? -1 : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 2;
  const search = req.query.search ? req.query.search : "";
  const skip = Number(req.query.skip) || 0;
  const min = Number(req.query.min) || 1;
  const max = Number(req.query.max) || 50000;
  const category = req.query.category ? JSON.parse(req.query.category) : null;
  const featured = req.query.featured ? true : false;
  let args = {};

  args["price"] = {
    $gte: min,
    $lte: max,
  };
  if (category) {
    args["category"] = {
      $in: category,
    };
  }
  let query = {};
  if (search) {
    query = {
      $or: [
        { slug: { $regex: `${search.toLowerCase()}` } },
        { description: { $regex: `${search.toLowerCase()}` } },
      ],
    };
    args = Object.assign({}, args, query);
  }

  if (featured) {
    args["$expr"] = {
      $gte: [{ $subtract: ["$quantity", "$sold"] }, 1],
    };
  }

  const productsCount = await Product.find();

  const products = await Product.find(args)
    .select({ photo: 0 })
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .skip(skip)
    .populate("category", "name");

  return res.send({
    products: products,
    loadMore: limit < productsCount.length,
  });
};

module.exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .select({ photo: 0 })
    .populate("category", "name")
    .populate("comments.user", ["name", "photo"]);
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

  let form = formidable({ keepExtensions: true, uploadDir: `./uploads` });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send("Something went wrong!!!");
    // Turn array values to string
    const data = {};
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        data[key] = fields[key].join("");
      }
    }
    const updatedValues = _.pick(data, [
      "name",
      "description",
      "price",
      "category",
      "quantity",
    ]);

    _.assignIn(product, updatedValues);

    // Input field name photo
    if (files.photo) {
      fs.readFile(files.photo[0].filepath, async (err, data) => {
        if (err) return res.status(400).send("Error in image");
        product.photo.data = data;
        product.photo.contentType = files.photo[0].mimetype;
        try {
          const result = await product.save();
          return res.send("Product Updated successfully");
        } catch (err) {
          return res.status(500).send("Internal Server Error!");
        }
      });
    } else {
      await product.save();
      return res.send("Product Updated successfully");
    }
  });
};

module.exports.filterProducts = async (req, res) => {
  let orderBy = req.body.order === "desc" ? -1 : 1;
  let sortBy = req.body.sort ? req.body.sort : "_id";
  let limit = req.body.limit ? Number(req.body.limit) : 5;
  let skip = Number(req.body.skip) || 0;
  let filters = req.body.filters;
  let args = {};

  for (let key in filters) {
    if (filters[key].length > 0) {
      if (key === "price") {
        // { price: {$gte: 0, $lte: 1000 }}
        args["price"] = {
          $gte: filters["price"][0],
          $lte: filters["price"][1],
        };
      }
      if (key === "category") {
        // category: { $in: [''] }
        args["category"] = {
          $in: filters["category"],
        };
      }
    }
  }

  const products = await Product.find(args)
    .select({ photo: 0 })
    .sort({ [sortBy]: orderBy })
    .limit(limit)
    .skip(skip)
    .populate("category", "name");
  return res.send(products);
};

module.exports.createComment = async (req, res) => {
  const { user, text, rating } = req.body;

  let product = await Product.findById(req.params.id).select({ photo: 0 });
  if (!product) return res.status(400).send("Product not found");

  const profile = await Profile.findOne({ user: user });
  if (!profile) return res.status(400).send("Profile not found");

  if (!profile.orderItems.includes(req.params.id)) {
    return res
      .status(403)
      .send({ message: "You are not allowed to add review" });
  }

  if (product.rating === 0) product.rating = rating;
  else product.rating = (product.rating + rating) / 2;
  product.commentsCount += 1;
  product.comments = [
    ...product.comments,
    { ...req.body, createdAt: new Date().getTime() },
  ];
  await product.save();

  product = await Product.findById(req.params.id)
    .select({ photo: 0 })
    .populate("category", "name")
    .populate("comments.user", ["name", "photo"]);

  return res.send({ data: product, message: "Review Added" });
};
