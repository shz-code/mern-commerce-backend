const { Schema, model } = require("mongoose");

const transactionSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    currency: String,
    bank_tran_id: String,
    card_issuer: String,
    amount: Number,
    store_amount: Number,
    trx: String,
  },
  { timestamps: true }
);

module.exports.Transaction = model("Transaction", transactionSchema);
