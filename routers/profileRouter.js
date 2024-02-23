const router = require("express").Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileControllers");
const authorize = require("../middlewares/authorize");

router
  .route("/:id")
  .get([authorize], getProfile)
  .patch([authorize], updateProfile);

module.exports = router;
