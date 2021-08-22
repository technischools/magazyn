const express = require('express')
const sql = require('mssql')
const router = express.Router()
const { query, request } = require('../database')

router.get('/', async function (req, res, next) {
  let products = []

  try {
    const dbRequest = await request()
    const result = await dbRequest.query('SELECT * FROM Produkty')

    products = result.recordset
  } catch (err) {
    console.error('Nie udało się pobrać produktów', err)
  }

  res.render('index', { title: 'Lista produktów', products: products })
});

router.get('/new-product', async function (req, res, next) {
  res.render('new-product', { title: 'Nowy produkt' })
});

router.post('/new-product', async function (req, res, next) {
  try {
    const dbRequest = await request()
    await dbRequest
      .input('Id', sql.INT, 99)
      .input('Nazwa', sql.VarChar(50), req.body.nazwa)
      .input('Kategoria', sql.VarChar(50), req.body.kategoria)
      .input('Cena', sql.Money, parseFloat(req.body.cena))
      .input('Ilosc', sql.SmallInt, parseInt(req.body.ilosc, 10))
      .query('INSERT INTO Produkty VALUES (@Id, @Nazwa, @Kategoria, @Ilosc, @Cena)')
  } catch (err) {
    console.error('Nie udało się dodać produktu', err)
  }

  res.render('new-product', { title: 'Nowy produkt' });
});

router.post('/product/:id/delete', async function (req, res, next) {

  try {
    const dbRequest = await request()

    await dbRequest
      .input('Id', sql.INT, req.params.id)
      .query('DELETE FROM Produkty WHERE Id = @Id')
  } catch (err) {
    console.error('Nie udało się usunąć produktu', err)
  }

  res.render('deleted', { title: 'Produkt usunięty', id: req.params.id });
});

module.exports = router;
