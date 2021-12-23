const mssql = require('mssql');
const config = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: '192.168.1.5',
    database: 'TSMolymer_F',
    options: {
        encrypt: false,
    }
}

// connection = new mssql.ConnectionPool(config).connect().then(pool => {
//     console.log('Connecting to SQL!!!');
//     return pool.request()
// })

// connection = new mssql.connect(config, (err) => {
//     console.log('Connected to database');
// })

// connection = new mssql.connect(config).then((result) => {
//     console.log('Connected to database.');
// }).catch((err) => {
//     console.log(err);
// });

// connection = new mssql.connect(config);

connection = new mssql.connect(config, (err) => {
    console.log('Connected to database');
})

// const pool = mssql.connect();
// pool.then(() => {
//     console.log('Pool');
// }).then(result => {
//     console.log('Promise');
// })

// pool.then(() => {
//     return console.log('Close');
// })

module.exports = connection;