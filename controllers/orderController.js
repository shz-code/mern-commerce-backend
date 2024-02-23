const { Order } = require("../models/order");
const { Profile } = require("../models/profile");
const { User } = require("../models/user");
const { Transaction } = require("../models/transaction");
const { Coupon } = require("../models/coupon");
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");
const SSLCommerzPayment = require("sslcommerz-lts");
const _ = require("lodash");
const dotenv = require("dotenv");

dotenv.config();

const redirectURL = "http://localhost:5173";

module.exports.init = async (req, res) => {
  const { cart, coupon, user_info } = req.body;

  //   Just to check if everything is alright
  let totalPrice = cart.products.reduce((a, b) => a + b.price * b.quantity, 0);
  let product_ids = cart.products.reduce((a, b) => a.concat(b.product), []);

  let product_quantity = {};
  cart.products.map((product) => {
    product_quantity[product.product] = product.quantity;
  });

  let products = await Product.find({
    _id: { $in: ["65cf8dc0ae3c6928ced6828e", "65cf8e32ae3c6928ced68299"] },
  }).select({ photo: 0 });

  let ck = true;
  products.map((product) => {
    if (
      product.quantity -
        product.sold -
        product_quantity[product._id.toString()] <
      0
    ) {
      ck = false;
    }
  });

  if (!ck)
    return res.send({
      status: false,
      message: "The selected product(s) are out of stock",
    });

  if (totalPrice != cart.price)
    return res
      .status(400)
      .send({ msg: "Client Error. Clear your cart and try again" });
  let discountAmount = 0;

  let coupon_id = "none";
  if (coupon.status) {
    coupon_id = coupon.data._id;
    discountAmount =
      coupon.data.discountType === "fixed"
        ? coupon.data.discount
        : (coupon.data.discount / 100) * cart.price;
  }

  totalPrice -= discountAmount;
  totalPrice += 120; // Fixed Shipping

  const profile = await Profile.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);

  const { address, state, city, postcode, country, phone } = user_info;
  profile.address = address;
  profile.state = state;
  profile.city = city;
  profile.postcode = postcode;
  profile.country = country;
  user.phone = phone;

  await user.save();
  await profile.save();

  const data = {
    total_amount: totalPrice,
    currency: "BDT",
    tran_id: `MERN-TRX-${new Date().getTime()}`,
    success_url: "http://localhost:4003/api/order/success",
    fail_url: "http://localhost:4003/api/order/fail",
    cancel_url: "http://localhost:4003/api/order/cancel",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: profile.address,
    cus_city: profile.city,
    cus_state: profile.state,
    cus_postcode: profile.postcode,
    cus_country: profile.country,
    cus_phone: user.phone,
    ship_name: user.name,
    ship_add1: profile.address,
    ship_city: profile.city,
    ship_state: profile.state,
    ship_postcode: profile.postcode,
    ship_country: profile.country,
    value_a: req.user._id,
    value_b: cart._id,
    value_c: coupon_id,
  };

  // return res.send({ status: false });
  const ssl = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  );
  ssl
    .init(data)
    .then((apiResponse) => {
      return res.send({ status: true, url: apiResponse.GatewayPageURL });
    })
    .catch((err) => console.log(err));
};

/*
  tran_id: 'MERN-TRX-1708631520489',
  val_id: '240223152060okfmES6GIhY0my',
  amount: '16620.00',
  card_type: 'IBBL-Islami Bank',
  store_amount: '16204.50',
  card_no: '',
  bank_tran_id: '240223152060QM12K3fKetQjLv',
  status: 'VALID',
  tran_date: '2024-02-23 01:51:59',
  error: '',
  currency: 'BDT',
  card_issuer: 'Islami Bank Bangladesh Limited',
  card_brand: 'IB',
  card_sub_brand: 'Classic',
  card_issuer_country: 'Bangladesh',
  card_issuer_country_code: 'BD',
  store_id: 'rooki64087f61151b1',
  verify_sign: '4bbc09409e194c28b7243845d568dea2',
  verify_key: 'amount,bank_tran_id,base_fair,card_brand,card_issuer,card_issuer_country,card_issuer_country_code,card_no,card_sub_brand,card_type,currency,currency_amount,currency_rate,currency_type,error,risk_level,risk_title,status,store_amount,store_id,tran_date,tran_id,val_id,value_a,value_b,value_c,value_d',
  verify_sign_sha2: 'bd1b854380769b32b7dfb047dacbdbcebf65b65b5bcbc32f5d3cc0ad6b015c8f',
  currency_type: 'BDT',
  currency_amount: '16620.00',
  currency_rate: '1.0000',
  base_fair: '0.00',
  value_a: '65cf6b57b61d0d9521f180a4',
  value_b: '65d7015a31613750bb229820',
  value_c: '',
  value_d: '',
  subscription_id: '',
  risk_level: '0',
  risk_title: 'Safe'
*/
module.exports.success = async (req, res) => {
  const {
    value_a: user_id,
    value_b: cart_id,
    value_c: coupon_id,
    tran_id,
    amount,
    bank_tran_id,
    store_amount,
    card_issuer,
    currency,
  } = req.body;
  const user = await User.findById(user_id);
  const profile = await Profile.findOne({ user: user_id });

  const trans = await Transaction.findOne({ bank_tran_id: bank_tran_id });
  if (trans) return res.status(400).send("Transaction already fulfilled");

  const order = new Order({
    user: user_id,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    postcode: profile.postcode,
    country: profile.country,
    phone: user.phone,
    amount: amount,
    trx: tran_id,
    cart: cart_id,
    coupon: coupon_id,
  });

  const transaction = new Transaction({
    user: user_id,
    order: order._id,
    amount: amount,
    store_amount: store_amount,
    trx: tran_id,
    bank_tran_id: bank_tran_id,
    card_issuer: card_issuer,
    currency: currency,
  });

  const cart = await Cart.findById(cart_id);

  cart.products.map(async (item) => {
    const product = await Product.findById(item.product);
    product.sold += item.quantity;
    await product.save();
  });
  cart.status = "completed";
  await cart.save();
  await order.save();
  await transaction.save();
  profile.orders += 1;

  await profile.save();

  if (coupon_id != "none") {
    const coupon = await Coupon.findById(coupon_id);
    if (coupon.useable > 0) coupon.useable -= 1;
    coupon.used += 1;
    await coupon.save();
  }

  return res.redirect(
    `${redirectURL}/success/?order=${order._id}&trx=${transaction._id}`
  );
};

/*
  tran_id: 'MERN-TRX-1708631168325',
  error: 'Invalid CVV',
  status: 'FAILED',
  bank_tran_id: '240223146137KiVSnxApNrXBW8',
  currency: 'BDT',
  tran_date: '2024-02-23 01:46:07',
  amount: '16620.00',
  store_id: 'rooki64087f61151b1',
  card_type: '',
  card_no: '',
  card_issuer: 'Nagad',
  card_brand: 'MOBILEBANKING',
  card_sub_brand: 'Classic',
  card_issuer_country: 'Bangladesh',
  card_issuer_country_code: 'BD',
  subscription_id: '',
  currency_type: 'BDT',
  currency_amount: '16620.00',
  currency_rate: '1.0000',
  base_fair: '0.00',
  value_a: '',
  value_b: '',
  value_c: '',
  value_d: '',
  verify_sign: 'e089fd0aa95c2c503bd13018bc0cbbe5',
  verify_sign_sha2: 'd421d772970df945d1a457c74d2608c374ead362e4616ddf1ecaa9923951d389',
  verify_key: 'amount,bank_tran_id,base_fair,card_brand,card_issuer,card_issuer_country,card_issuer_country_code,card_no,card_sub_brand,card_type,currency,currency_amount,currency_rate,currency_type,error,status,store_id,tran_date,tran_id,value_a,value_b,value_c,value_d'
*/
module.exports.fail = async (req, res) => {
  return res.send("done");
};

module.exports.cancel = async (req, res) => {
  return res.redirect(`${redirectURL}/checkout`);
};

module.exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("cart", ["price", "products"])
    .populate("coupon", ["name", "description"]);
  if (!order) return res.status(400).send("Not Found");
  return res.send(
    _.pick(order, [
      "_id",
      "address",
      "city",
      "state",
      "country",
      "postcode",
      "trx",
      "cart",
      "coupon",
    ])
  );
};

module.exports.getOrders = async (req, res) => {
  const order = await Order.find({ user: req.user._id })
    .select({
      amount: 1,
      cart: 1,
      trx: 1,
      createdAt: 1,
      address: 1,
      phone: 1,
      city: 1,
      state: 1,
      country: 1,
      status: 1,
    })
    .populate("cart", ["price", "products"]);
  return res.send(order);
};
