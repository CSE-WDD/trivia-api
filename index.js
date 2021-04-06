const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const envs = require('./config/env');
const config = require('./config/config').get(envs.NODE_ENV);
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(cookieParser());

app.get('/', function (req, res) {
  res.status(200).send({ message: 'Welcome to login , sign-up api' });
});

// cors

app.use((req, res, next) => {
  // '*' allows all clients to access the server through the API
  // Otherwise, you can allow only certain domains by placing them in, using commas to separate
  const origins = ['http://localhost:3001', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// const corsOptions = {
//   credentials: true
// };
// app.use(cors(corsOptions));

app.use(authRoutes);
app.use(gameRoutes);

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

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
