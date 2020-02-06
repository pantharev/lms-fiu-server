const mysql = require("mysql");
const dbConfig = require("../config/db.config");

//Create a connection pool to the database
const connectionPool = mysql.createPool({
    connectionLimit: 10,
    password: dbConfig.PASSWORD,
    user: dbConfig.USER,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    port: dbConfig.PORT
});

connectionPool.on('connection', (connection) => {
    console.log('DB Connection established');

    connection.on('error', (err) => {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', (err) =>{
        console.error(new Date(), 'MySQL close', err);
    });
});

module.exports = connectionPool;