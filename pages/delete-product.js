const { SqlRequest, sql } = require('../lib/database')

module.exports = async function deleteProduct(req, res) {

    try {
      const sqlRequest = new SqlRequest()
  
      await sqlRequest
        .input('Id', sql.INT, req.query.id)
        .query('DELETE FROM Produkty WHERE Id = @Id')
    } catch (err) {
      console.error('Nie udało się usunąć produktu', err)
    }
  
    res.redirectWithMessage('/', `Usunięto produkt o id ${req.query.id}`);
  }