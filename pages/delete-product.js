const sql = require('mssql')
const { request } = require('../database')

module.exports = async function deleteProduct(req, res) {

    try {
      const dbRequest = await request()
  
      await dbRequest
        .input('Id', sql.INT, req.query.id)
        .query('DELETE FROM Produkty WHERE Id = @Id')
    } catch (err) {
      console.error('Nie udało się usunąć produktu', err)
    }
  
    res.redirectWithMessage('/', `Usunięto produkt o id ${req.query.id}`);
  }