const express = require("express");
const createError = require("http-errors");
const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const {create} = require("express-handlebars");
const errorController = require('../pages/error');

const app = express();

// view engine setup
const hbs = create({
  extname: '.hbs',
  helpers: {
    select: function(value, options) {
      const cheerio = require('cheerio')
      const $ = cheerio.load(options.fn(this))
      const selectedOptions = $(`[value=${value}]`);

      if (selectedOptions.length > 0) {
        selectedOptions[0].attribs['selected'] = 'selected'
      }
      

      return $.html()
    }
  }
});

app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");

const viewsDir = path.join(__dirname, "../pages")
app.set("views", viewsDir);

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

app.use(express.static(path.join(__dirname, "../public")));

// main router
app.use(require('./router')({pagesDir: viewsDir}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorController);

module.exports = app;
