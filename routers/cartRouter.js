const router = require("express").Router();
const {
  removeCart,
  addCart,
  getCart,
} = require("../controllers/cartController");
const authorize = require("../middlewares/authorize");
const identify = require("../middlewares/identify");

router
  .route("/")
  .get([identify], getCart)
  .post([authorize], addCart)
  .put([authorize], removeCart);

module.exports = router;
