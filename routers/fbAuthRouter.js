const router = require("express").Router();
const passport = require("passport");
require("../config/fbAuthConfig");

const { redirect } = require("../controllers/fbAuthController");

router
  .route("/")
  .get(
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

router.route("/redirect").get(
  passport.authenticate("facebook", {
    session: false,
  }),
  redirect
);

module.exports = router;
