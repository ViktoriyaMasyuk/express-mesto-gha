const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "649b298d5c9b16ef4eaa5b6",
  };
  next();
});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
