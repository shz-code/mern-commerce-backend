const _ = require("lodash");
const { Cart } = require("../models/cart");

module.exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  return res.send(_.pick(cart, ["products", "price"]));
};

module.exports.addCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id, status: "pending" });
  if (cart) {
    let ck = cart.products.findIndex(
      (item) => item.product === req.body.product
    );
    if (ck !== -1) {
      cart.products[ck].quantity += 1;
      cart.price += Number(req.body.price);
      await cart.save();
    } else {
      cart.products.push({
        product: req.body.product,
        price: Number(req.body.price),
        name: req.body.name,
        quantity: 1,
      });
      cart.price += Number(req.body.price);
      await cart.save();
    }
  } else {
    cart = new Cart({
      products: [
        {
          product: req.body.product,
          price: Number(req.body.price),
          name: req.body.name,
          quantity: 1,
        },
      ],
      user: req.user._id,
      price: Number(req.body.price),
    });
    await cart.save();
  }

  return res.send(_.pick(cart, ["products", "price"]));
};

module.exports.removeCart = async (req, res) => {
  return res.send("Done");
};
