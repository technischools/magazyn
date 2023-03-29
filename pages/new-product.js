const sql = require('mssql')
const { SqlRequest } = require('../lib/database')

module.exports = async function (req, res) {
  if (req.method === "GET") {
    return showNewProductForm(req, res);
  }

  if (req.method === 'POST') {
    return addNewProduct(req, res);
  }
};

async function showNewProductForm(req, res) {
  return { title: "Nowy produkt" };
}

async function addNewProduct(req, res, next) {
    try {
      const sqlRequest = SqlRequest()
      await sqlRequest
        .input('Nazwa', sql.VarChar(50), req.body.nazwa)
        .input('Kategoria', sql.VarChar(50), req.body.kategoria)
        .input('Cena', sql.Money, parseFloat(req.body.cena))
        .input('Ilosc', sql.SmallInt, parseInt(req.body.ilosc, 10))
        .query('INSERT INTO Produkty VALUES (@Nazwa, @Kategoria, @Ilosc, @Cena)')
  
      res.message = 'Dodano nowy produkt'
    } catch (err) {
      console.error('Nie udało się dodać produktu', err)
    }
  
    res.redirectWithMessage('/', 'Dodano nowy produkt');
  }
  
