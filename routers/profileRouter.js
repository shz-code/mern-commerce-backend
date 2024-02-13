const router = require("express").Router();
const { getProfile } = require("../controllers/profileControllers");

router.route("/:id").get(getProfile);

module.exports = router;
