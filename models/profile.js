const { Schema, model } = require("mongoose");

const profileSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orders: Number,
    address: String,
    city: String,
    state: String,
    postcode: Number,
    country: String,
  },
  { timestamps: true }
);

module.exports.Profile = model("Profile", profileSchema);
