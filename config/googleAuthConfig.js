const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const { User } = require("../models/user");
const { Profile } = require("../models/profile");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4003/api/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, cb) => {
      const { sub, name, given_name, family_name, picture, email } =
        profile._json;

      const user = await User.findOne({ email: email });
      if (user) {
        if (user.provider != "google") {
          cb(null, { status: 400, msg: "Email already used!" });
        }
        // Login User
        else {
          const token = user.generateJWT(user._id, user.username, user.role);
          cb(null, {
            status: 200,
            token: token,
          });
        }
      }
      // Create User
      else {
        const user = new User({
          name: name,
          email: email,
          photo: picture,
          username: `${given_name}_${family_name}_${Math.floor(
            Math.random() * 10
          )}`,
          provider: "google",
          googleId: sub,
        });
        const profile = new Profile({
          user: user._id,
        });
        const token = user.generateJWT(user._id, user.username, user.role);

        await user.save();
        await profile.save();
        cb(null, {
          status: 201,
          token: token,
        });
      }
    }
  )
);
