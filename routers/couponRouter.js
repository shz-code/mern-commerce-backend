const router = require("express").Router();
const { check, create, getAll } = require("../controllers/couponController");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").get([authorize, admin], getAll).post([authorize], create);

router.route("/check").post([authorize], check);

module.exports = router;
