const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  getPhoto,
} = require("../controllers/productControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get(getProducts).post([authorize, admin], createProduct);

router.route("/:id").get(getProduct).put([authorize, admin], updateProduct);

router.route("/photo/:id").get(getPhoto);

module.exports = router;
