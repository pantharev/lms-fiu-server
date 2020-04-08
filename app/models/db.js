const mysql = require("mysql");
const dbConfig = require("../config/db.config");

//Create a connection pool to the database
const connectionPool = mysql.createPool({
    connectionLimit: 100,
    password: dbConfig.PASSWORD,
    user: dbConfig.USER,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    port: dbConfig.PORT
});

connectionPool.on('connection', (connection) => {
    console.log('DB Connection established', connection.threadId);

    connection.on('error', (err) => {
        connection.release();
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('end', (err) =>{
        console.log("DB connection closed");
        console.error(new Date(), 'MySQL close', err);
    });
});

connectionPool.on('acquire', (connection) => {
    console.log("DB connection aquired", connection.threadId);
})

connectionPool.on('release', (connection) => {
    console.log("DB connection released", connection.threadId);
})

module.exports = connectionPool;