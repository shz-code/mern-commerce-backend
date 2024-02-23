const { Transaction } = require("../models/transaction");
const _ = require("lodash");

module.exports.getTrx = async (req, res) => {
  const trx = await Transaction.findById(req.params.id);
  if (!trx) return res.status(400).send("Not Found");
  return res.send(
    _.pick(trx, [
      "_id",
      "amount",
      "card_issuer",
      "createdAt",
      "trx",
      "currency",
    ])
  );
};

module.exports.getTransactions = async (req, res) => {
  const trx = await Transaction.find({ user: req.user._id }).select({
    bank_tran_id: 0,
    order: 0,
    store_amount: 0,
    updatedAt: 0,
    user: 0,
  });
  return res.send(trx);
};
