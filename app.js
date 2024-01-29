require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

// Global Error collector
app.use((err, req, res, next) => {
  return res.status(500).send("Something went wrong");
});

module.exports = app;
