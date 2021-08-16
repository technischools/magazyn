var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const products = [
    {
      id: 1,
      nazwa: 'Kalosze',
      cena: 20.00,
      ilosc: 100
    },
    {
      id: 2,
      nazwa: 'Spodnie',
      cena: 15.00,
      ilosc: 2
    }
  ]

  res.render('index', { title: 'Lista produktów', products: products });
});

router.get('/new-product', function(req, res, next) {

  res.render('new-product', { title: 'Nowy produkt' });
});

module.exports = router;
