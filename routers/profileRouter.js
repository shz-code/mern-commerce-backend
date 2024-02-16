const router = require("express").Router();
const { getProfile } = require("../controllers/profileControllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/:id").get([authorize], getProfile);

module.exports = router;
