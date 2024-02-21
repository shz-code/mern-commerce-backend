const _ = require("lodash");
const { Cart } = require("../models/cart");

module.exports.getCart = async (req, res) => {
  console.log(req.user);
  if (req.user) {
    const cart = await Cart.findOne({ user: req.user._id });
    return res.send(_.pick(cart, ["products", "price"]));
  } else return res.send({});
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

  return res.send({
    data: _.pick(cart, ["products", "price"]),
    message: "Add to cart successful",
  });
};

module.exports.removeCart = async (req, res) => {
  return res.send("Done");
};
