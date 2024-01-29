const router = require("express").Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get(getCategories).post([authorize, admin], createCategory);

module.exports = router;
