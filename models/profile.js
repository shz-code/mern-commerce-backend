const { Schema, model } = require("mongoose");

const profileSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    orders: { type: Number, default: 0 },
    address: { type: String, default: "none" },
    city: { type: String, default: "none" },
    state: { type: String, default: "none" },
    postcode: { type: Number, default: 1200 },
    country: { type: String, default: "Bangladesh" },
  },
  { timestamps: true }
);

module.exports.Profile = model("Profile", profileSchema);
