const router = require("express").Router();
const {
  init,
  success,
  fail,
  cancel,
  getOrder,
  getOrders,
} = require("../controllers/orderController");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get([authorize], getOrders).post([authorize], init);
router.route("/:id").get([authorize], getOrder);

router.route("/success").post(success);
router.route("/fail").post(fail);
router.route("/cancel").post(cancel);

module.exports = router;
