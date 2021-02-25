const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const envs = require('./config/env');
const config = require('./config/config').get(envs.NODE_ENV);
const authRoutes = require('./routes/auth');

const app = express();
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  config.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err) {
    if (err) console.log(err);
    console.log('DB Connected.');
  }
);

app.get('/', function (req, res) {
  res.status(200).send(`Welcome to login , sign-up api`);
});

app.use(authRoutes);

// listening port
const PORT = envs.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
