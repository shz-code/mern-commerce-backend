const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  getPhoto,
  filterProducts,
} = require("../controllers/productControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get(getProducts).post([authorize, admin], createProduct);

router.route("/:id").get(getProduct).put([authorize, admin], updateProduct);

router.route("/photo/:id").get(getPhoto);

router.route("/filter").post(filterProducts);

module.exports = router;
