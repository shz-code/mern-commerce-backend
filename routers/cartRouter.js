const router = require("express").Router();
const {
  removeCart,
  addCart,
  getCart,
} = require("../controllers/cartController");
const authorize = require("../middlewares/authorize");

router
  .route("/")
  .get([authorize], getCart)
  .post([authorize], addCart)
  .delete([authorize], removeCart);

module.exports = router;
