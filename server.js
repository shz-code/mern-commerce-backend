const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

if (process.env.NODE_ENV === "development") {
  mongoose
    .connect(process.env.LOCAL_DB_URL)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log(err));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
