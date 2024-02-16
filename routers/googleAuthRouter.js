const router = require("express").Router();
const passport = require("passport");
require("../config/googleAuthConfig");

const { redirect } = require("../controllers/googleAuthController");

router
  .route("/")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/redirect").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: `http://localhost:5173/register?status=failed`,
  }),
  redirect
);

module.exports = router;
