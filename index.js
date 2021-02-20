const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const User = require('./models/user');
const {
    auth
} = require('./middlewares/auth');
const authRoutes = require('./routes/auth');

const app = express();
// app use
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) console.log(err);
    console.log("DB Connected.");
});

app.get('/', function (req, res) {
    res.status(200).send(`Welcome to login , sign-up api`);
});

app.use(authRoutes);

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
});