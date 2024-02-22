const router = require("express").Router();
const {
  init,
  success,
  fail,
  cancel,
} = require("../controllers/orderController");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").post([authorize], init);

router.route("/success").post(success);
router.route("/fail").post(fail);
router.route("/cancel").post(cancel);

module.exports = router;
