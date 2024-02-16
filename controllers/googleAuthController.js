const passport = require("passport");
const _ = require("lodash");

module.exports.redirect = async (req, res) => {
  if (req.user.status === 400) {
    return res.redirect(`http://localhost:5173/register?status=400`);
  } else {
    return res.redirect(
      `http://localhost:5173/register?token=${req.user.token}`
    );
  }
};
