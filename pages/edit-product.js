const sql = require('mssql')
const { request } = require("../database");

module.exports = async function editProduct(req, res) {
    if (req.method === 'GET') {
        return showEditProductForm(req, res);
      }
    
      if (req.method === 'POST') {
        return saveProduct(req, res);
      }
};

async function showEditProductForm(req, res) {
    try {
        const dbRequest = await request()
    
        const result = await dbRequest
          .input('Id', sql.INT, req.query.id)
          .query('SELECT * FROM Produkty WHERE Id = @Id')

        if (result.recordset.length === 0) {
            res.redirectWithMessage('/', 'Nie znaleziono produktu o Id ' + req.query.id)
        }  

        return {
            title: 'Edycja',
            product: result.recordset[0]
        }
      } catch (err) {
        console.error('Nie udało się usunąć produktu', err)
      }
}

async function saveProduct(req, res) {
    try {
        const dbRequest = await request()
    
        const result = await dbRequest
          .input('Id', sql.INT, req.query.id)
          .input('Nazwa', sql.VarChar(50), req.body.nazwa)
          .input('Kategoria', sql.VarChar(50), req.body.kategoria)
          .input('Cena', sql.Money, parseFloat(req.body.cena))
          .input('Ilosc', sql.SmallInt, parseInt(req.body.ilosc, 10))
          .query('UPDATE Produkty SET Nazwa=@Nazwa, Kategoria=@Kategoria, Ilosc=@Ilosc, Cena=@Cena WHERE Id = @Id')

        if (result.rowsAffected === 0) {
            res.redirectWithMessage('/', 'Nie udało się zapisać produktu o Id ' + req.query.id)
        } else {
            res.redirectWithMessage('/', 'Zmiany zapisane')
        } 

        
      } catch (err) {
        console.error('Nie udało się zapisać produktu', err)
      }
}
