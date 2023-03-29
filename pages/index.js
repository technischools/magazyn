const sql = require('mssql')
const { SqlRequest } = require('../lib/database')

module.exports = async function showProducts(req, res) {
  let products = []

  try {
    const sqlRequest = SqlRequest()
    let result;

    if (req.query.kategoria) {
      result = await sqlRequest
        .input('Kategoria', sql.VarChar(50), req.query.kategoria)
        .query('SELECT * FROM Produkty WHERE Kategoria = @Kategoria')
    } else {
      result = await sqlRequest.query('SELECT * FROM Produkty')
    }

    products = result.recordset
  } catch (err) {
    console.error('Nie udało się pobrać produktów', err)
    throw err;
  }

  return { 
    title: 'Lista produktów', 
    products: products, 
    message: res.message, 
    kategoria: req.query.kategoria,
    userLogin: req.session?.userLogin,
    message: req.query.message
   }
}