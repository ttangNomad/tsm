const sql = require('mssql');
const config = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: '192.168.1.5',
    database: 'TSMolymer_F',
    options: {
        encrypt: false,
    }
}
const pool = sql.connect(config);
// pool.then(() => {
//     console.log('Pool');
// }).then(result => {
//     console.log('Promise');
// })

// pool.then(() => {
//     return console.log('Close');
// })

module.exports = pool;