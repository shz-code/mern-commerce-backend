const { Schema, model } = require("mongoose");

const cartSchema = Schema(
  {
    products: [
      {
        product: String,
        quantity: Number,
        price: Number,
        name: String,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: Number,
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports.Cart = model("Cart", cartSchema);
