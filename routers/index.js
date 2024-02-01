const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
};
