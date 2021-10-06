require("./config/database").connect();
const cookieSession = require('cookie-session');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config/jwt-config');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: config.keySession,
    maxAge: config.maxAge, //24h
}))
/*const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});*/
app.use(cors({
    origin: '*'
}));

console.log(process.env);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

module.exports = app;