var express = require('express');
var router = express.Router();

const sql = require('mssql')

const DB_USER = 'sa'
const DB_PWD = 'MSsql123'
const DB_NAME = 'lato2021magazyn'

const sqlConfig = {
  user: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  server: 'localhost',
  options: {
    trustServerCertificate: true
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {


  let products = [];

  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
    const result = await sql.query(`select * from Produkty`)
    products = result.recordset
   } catch (err) {
    console.error('Nieudane połączenie z bazą danych', err)
   } finally {
     sql.close()
   }

  res.render('index', { title: 'Lista produktów', products: products });
});

router.get('/new-product', async function(req, res, next) {
  res.render('new-product', { title: 'Nowy produkt' });
});

router.post('/new-product', async function(req, res, next) {
console.log(req.body)
  try {
    const pool = await sql.connect(sqlConfig)
    const dbReq = await pool.request()
      .input('Id', sql.INT, 99)
      .input('Nazwa', sql.VarChar(50), req.body.nazwa)
      .input('Kategoria', sql.VarChar(50), req.body.kategoria)
      .input('Cena', sql.Money, parseFloat(req.body.cena))
      .input('Ilosc', sql.SmallInt, parseInt(req.body.ilosc, 10))
      .query('INSERT INTO Produkty VALUES (@Id, @Nazwa, @Kategoria, @Ilosc, @Cena)')
   } catch (err) {
    console.error('Nieudane połączenie z bazą danych', err)
   } finally {
     sql.close()
   }

  res.render('new-product', { title: 'Nowy produkt' });
});

router.post('/product/:id/delete', async function(req, res, next) {

  try {
    const pool = await sql.connect(sqlConfig)
    const dbReq = await pool.request()
      .input('Id', sql.INT, req.params.id)
      .query('DELETE FROM Produkty WHERE Id = @Id')
   } catch (err) {
    console.error('Nieudane połączenie z bazą danych', err)
   } finally {
     sql.close()
   }

  res.render('deleted', { title: 'Produkt usunięty', id: req.params.id });
});

module.exports = router;
