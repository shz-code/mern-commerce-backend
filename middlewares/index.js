const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (app) => {
  app.use(express.json());
  app.use(cors());

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
};
