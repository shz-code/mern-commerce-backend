const userRouter = require("../routers/userRouter");
const categoryRouter = require("../routers/categoryRouter");
const productRouter = require("../routers/productRouter");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
};
