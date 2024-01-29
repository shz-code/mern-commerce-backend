const router = require("express").Router();
const {
  createProduct,
  getProducts,
} = require("../controllers/productControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get(getProducts).post([authorize, admin], createProduct);

// router.route("/:id").post(login);

module.exports = router;
