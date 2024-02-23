const _ = require("lodash");
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");

module.exports.getCart = async (req, res) => {
  if (req.user) {
    const cart = await Cart.findOne({ user: req.user._id, status: "pending" });
    return res.send(_.pick(cart, ["products", "price", "_id"]));
  } else return res.send({});
};

module.exports.addCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id, status: "pending" });
  if (cart) {
    let ck = cart.products.findIndex(
      (item) => item.product === req.body.product
    );
    if (ck !== -1) {
      const product = await Product.findById(cart.products[ck].product);
      if (
        product.quantity - product.sold - (cart.products[ck].quantity + 1) <
        0
      ) {
        return res.send({
          data: _.pick(cart, ["products", "price", "_id"]),
          message: "Not enough product(s) available",
          status: false,
        });
      }
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

  return res.send({
    data: _.pick(cart, ["products", "price", "_id"]),
    message: "Add to cart successful",
    status: true,
  });
};

module.exports.removeCart = async (req, res) => {
  const body = req.body;
  let cart = await Cart.findOne({ user: req.user._id, status: "pending" });
  if (!cart) return res.status(404).send("Not Found");

  const { type, product, price } = body;
  if (type === "single") {
    let newProducts = cart.products.filter((item) => {
      if (item.product === product) {
        item.quantity -= 1;
        if (item.quantity) return item;
      } else return item;
    });
    const priceCk = cart.price - price;
    if (priceCk === 0) {
      await Cart.deleteOne({ user: req.user._id, status: "pending" });
      return res.send({
        data: {},
        message: "Cart deleted",
      });
    } else {
      cart.price = priceCk;
      cart.products = newProducts;
      await cart.save();
      return res.send({
        data: _.pick(cart, ["products", "price", "_id"]),
        message: "Cart updated",
      });
    }
  } else if (type === "all") {
    let cumulatedPrice = 0;
    let newProducts = cart.products.filter((item) => {
      if (item.product === product) {
        cumulatedPrice = item.price * item.quantity;
      } else return item;
    });

    const priceCk = cart.price - cumulatedPrice;
    if (priceCk === 0) {
      await Cart.deleteOne({ user: req.user._id, status: "pending" });
      return res.send({
        data: {},
        message: "Cart deleted",
      });
    } else {
      cart.price = priceCk;
      cart.products = newProducts;
      await cart.save();
      return res.send({
        data: _.pick(cart, ["products", "price", "_id"]),
        message: "Cart updated",
      });
    }
    return res.send({
      data: {},
      message: "Cart deleted",
    });
  }
};
