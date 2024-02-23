const { Schema, model } = require("mongoose");

const orderSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    amount: Number,
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    status: {
      type: String,
      enum: ["pending", "shipping", "complete"],
      default: "pending",
    },
    amount: Number,
    trx: String,
  },
  { timestamps: true }
);

module.exports.Order = model("Order", orderSchema);
