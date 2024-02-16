const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const profileRouter = require("./profileRouter");
const googleAuthRouter = require("./googleAuthRouter");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/auth/google", googleAuthRouter);
};
