const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const profileRouter = require("./profileRouter");
const googleAuthRouter = require("./googleAuthRouter");
const fbAuthRouter = require("./fbAuthRouter");
const cartRouter = require("./cartRouter");
const couponRouter = require("./couponRouter");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/auth/google", googleAuthRouter);
  app.use("/api/auth/fb", fbAuthRouter);
  app.use("/api/coupon", couponRouter);
};
