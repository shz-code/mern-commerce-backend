const { Coupon } = require("../models/coupon");
const _ = require("lodash");

module.exports.getAll = async (req, res) => {
  const coupons = await Coupon.find();
  return res.send(coupons);
};

module.exports.check = async (req, res) => {
  const { coupon_name, products } = req.body;
  const coupon = await Coupon.findOne({ slug: coupon_name.toLowerCase() });
  if (!coupon) return res.status(404).send("Not Found");

  const { validity, discountType, discount, useable, expire } = coupon;
  let response = {};
  if (validity === "all") {
    if (useable - 1 < 0) {
      response = {
        status: false,
        msg: "Maximum usage limit reached",
      };
    } else if (expire < new Date().getTime()) {
      response = {
        status: false,
        msg: "Coupon expired",
      };
    } else {
      response = {
        status: true,
        msg: "Coupon Verified",
        data: _.pick(coupon, ["_id", "name", "discount", "discountType"]),
      };
    }
    return res.send(response);
  } else {
    // Maybe in future
  }
  return res.status(400).send("Dead");
};

module.exports.create = async (req, res) => {
  const coupon = new Coupon({
    ...req.body,
    slug: req.body.name.toLowerCase(),
    limit: req.body.useable,
  });
  await coupon.save();
  return res.send(coupon);
};
