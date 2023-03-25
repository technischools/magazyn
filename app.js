const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const {create} = require("express-handlebars");
const errorController = require('./pages/error');

const app = express();

// view engine setup
const hbs = create({
  extname: '.hbs'
});
app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "pages"));

app.use(logger("dev"));
app.use(express.json());
app.use(
  session({
    secret: "iLoveSql",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.response.redirectWithMessage = function(path, message) {

  const separator = path.indexOf('?') > -1 ? '&' : '?';

  this.redirect(`${path}${separator}message=${encodeURIComponent(message)}`)
}

app.use(express.static(path.join(__dirname, "public")));

app.use(async function (req, res, next) {
  const fs = require("fs");
  let path = req.path.split("/")[1];

  if (req.path == "/") {
    path = "index";
  }

  if (!fs.existsSync(`./pages/${path}.js`)) {
    return next();
  }

  const fn = require(`./pages/${path}`);

  try {
    const local = await fn(req, res, next);

    if (res.headersSent) {
      return;
    }

    if (!fs.existsSync(`${__dirname}/pages/${path}.hbs`)) {
      const err = new Error(`File {${__dirname}/pages/${path}.hbs} not found`);
      err.name = 'ViewNotFound';

      throw err;
    }

    res.render(`${__dirname}/pages/${path}`, local);

  } catch (e) {
    next(e);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorController);

module.exports = app;
