const { Schema, model } = require("mongoose");

const couponSchema = Schema(
  {
    name: { type: String, required: true },
    slug: String,
    description: String,
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },
    discount: Number,
    expire: Date,
    useable: Number,
    limit: Number,
    used: { type: Number, default: 0 },
    validity: {
      type: String,
      enum: ["single", "all"],
      default: "all",
    },
    products: [String],
  },
  { timestamps: true }
);

module.exports.Coupon = model("Coupon", couponSchema);
