const sql = require('mssql')

let pool = null

async function connect(config) {
    const sqlConfig = {
        user: config.user,
        password: config.password,
        database: config.database,
        server: config.server,
        options: {
          trustServerCertificate: true
        }
      }

    if (!pool) {
        try {
            pool = await sql.connect(sqlConfig)
        } catch (err) {
            console.error('Nieudane połączenie z bazą danych', err)
    
            throw err
        }
    } 
}

function SqlRequest() {
    return new sql.Request(pool);
}

module.exports = {
    SqlRequest,
    connectToDatabase: connect,
    sql
}