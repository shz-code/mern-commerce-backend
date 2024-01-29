const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
} = require("../controllers/productControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get(getProducts).post([authorize, admin], createProduct);

router.route("/:id").get(getProduct).put([authorize, admin], updateProduct);

module.exports = router;
