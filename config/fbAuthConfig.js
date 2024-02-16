const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
const { User } = require("../models/user");
const { Profile } = require("../models/profile");
dotenv.config();

const redirectURL = "http://localhost:4003/api/auth/fb/redirect";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: redirectURL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      const { id, name, picture, email } = profile._json;

      const user = await User.findOne({ email: email });
      if (user) {
        if (user.provider != "fb") {
          cb(null, { status: 400, msg: "Email already used!" });
        }
        // Login User
        else {
          const token = user.generateJWT(
            user._id,
            user.username,
            user.role,
            user.photo
          );
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
          photo: picture.data.url,
          username: `${name.split(" ").join("_").toLowerCase()}_${Math.floor(
            Math.random() * 10
          )}`,
          provider: "fb",
          facebookId: id,
        });
        const profile = new Profile({
          user: user._id,
        });
        const token = user.generateJWT(
          user._id,
          user.username,
          user.role,
          user.photo
        );

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
