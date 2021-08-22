const express = require('express')
const sql = require('mssql')
const router = express.Router()
const { request } = require('../database')

async function showAllProducts(req, res) {
  let products = []

  try {
    const dbRequest = await request()
    const result = await dbRequest.query('SELECT * FROM Produkty')

    products = result.recordset
  } catch (err) {
    console.error('Nie udało się pobrać produktów', err)
  }

  res.render('index', { title: 'Lista produktów', products: products, message: res.message })
}

async function showNewProductForm (req, res) {
  res.render('new-product', { title: 'Nowy produkt' })
}

async function addNewProduct(req, res, next) {
  try {
    const dbRequest = await request()
    await dbRequest
      .input('Nazwa', sql.VarChar(50), req.body.nazwa)
      .input('Kategoria', sql.VarChar(50), req.body.kategoria)
      .input('Cena', sql.Money, parseFloat(req.body.cena))
      .input('Ilosc', sql.SmallInt, parseInt(req.body.ilosc, 10))
      .query('INSERT INTO Produkty VALUES (@Nazwa, @Kategoria, @Ilosc, @Cena)')

      res.message = 'Dodano nowy produkt'
  } catch (err) {
    console.error('Nie udało się dodać produktu', err)
  }

  showAllProducts(req, res)
}

async function deleteProduct(req, res) {

  try {
    const dbRequest = await request()

    await dbRequest
      .input('Id', sql.INT, req.params.id)
      .query('DELETE FROM Produkty WHERE Id = @Id')
  } catch (err) {
    console.error('Nie udało się usunąć produktu', err)
  }

  res.message = `Usunięto produkt o id ${req.params.id}`;

  showAllProducts(req, res)
}

router.get('/', showAllProducts);
router.get('/new-product', showNewProductForm);
router.post('/new-product', addNewProduct);
router.post('/product/:id/delete', deleteProduct);

module.exports = router;
