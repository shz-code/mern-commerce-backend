const router = require("express").Router();
const { login, register } = require("../controllers/userControllers");

router.route("/register").post(register);

router.route("/login").post(login);

module.exports = router;
