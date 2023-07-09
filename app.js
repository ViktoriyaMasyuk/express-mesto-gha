const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const routes = require('./routes/index');
const { serverError } = require('./middlewares/serverError');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.use(helmet());

app.use(errors());
app.use(serverError);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
