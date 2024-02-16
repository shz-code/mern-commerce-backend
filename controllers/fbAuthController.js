const passport = require("passport");

const redirectURL = "http://localhost:5173/auth";

module.exports.redirect = async (req, res) => {
  if (req.user.status === 400) {
    return res.redirect(
      `${redirectURL}?status=${req.user.status}&msg=${req.user.msg}`
    );
  } else {
    return res.redirect(`${redirectURL}?token=${req.user.token}`);
  }
};
