const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: 'iLoveSql',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(async function(req, res, next) {
  const fs = require('fs');
  let path = req.path.split('/')[1]

  if (req.path == '/') {
    path = 'index'; 
  }

  if (!fs.existsSync(`./pages/${path}.js`)) {
    return next();
  }

  const fn = require(`./pages/${path}`);
  
  const local = await fn(req, res, next);

  if (!res.headersSent) {
    res.render(`${__dirname}/pages/${path}`, local);
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
