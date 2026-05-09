const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');
const messagesRouter = require('./routes/messages');
const authMiddleware = require("./middlewares/authMiddleware");
const {pool} = require("./db/db-manager");

const app = express();


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware); // localhost:3000/


app.use('/', indexRouter); // localhost:3000/
app.use('/users', usersRouter); // localhost:3000/users
app.use('/chat', chatRouter); // localhost:3000/chat
app.use('/messages', messagesRouter); // localhost:3000/messages

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// get chat by id BY Viktor
app.get('/chats/:id', (req, res) => {
    const {id} = req.params;
    res.send(`Отримали чат з id = ${id}`);
});
// update chat by id BY Viktor
app.put('/chats/:id', (req, res) => {
    const {id} = req.params;
    const data = req.body;
    res.send(`Оновили чат ${id} з даними: ${JSON.stringify(data)}`);
});

module.exports = app;
