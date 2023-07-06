const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

app.use((req, res, next) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "Страница не найдена" });
    return;
  }
  next();
});

app.use((err, req, res, next) => {
  res.send({ message: err.message });
});

app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
