var express = require('express');
var router = express.Router();

const DB_USER = 'sa'
const DB_PWD = 'MSsql123'
const DB_NAME = 'lato2021magazyn'

/* GET home page. */
router.get('/', async function(req, res, next) {
  const sql = require('mssql')
  const sqlConfig = {
    user: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    server: 'localhost',
    options: {
      trustServerCertificate: true
    }
  }

  let products = [];

  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
    console.log('Połączenie z bazą danych nawiązane');
    const result = await sql.query(`select * from Produkty`)
    products = result.recordset
   } catch (err) {
    console.error('Nieudane połączenie z bazą danych', err)
   }

  res.render('index', { title: 'Lista produktów', products: products });
});

router.get('/new-product', function(req, res, next) {

  res.render('new-product', { title: 'Nowy produkt' });
});

router.post('/product/:id/delete', function(req, res, next) {

  res.render('deleted', { title: 'Produkt usunięty', id: req.params.id });
});

module.exports = router;
