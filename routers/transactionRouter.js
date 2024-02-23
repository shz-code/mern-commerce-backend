const router = require("express").Router();
const {
  getTrx,
  getTransactions,
} = require("../controllers/transactionController");
const authorize = require("../middlewares/authorize");

router.route("/").get([authorize], getTransactions);
router.route("/:id").get([authorize], getTrx);

module.exports = router;
