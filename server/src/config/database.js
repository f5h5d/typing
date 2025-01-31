const { Sequelize } = require('sequelize');
const { Client } = require('pg')
const sequelize = new Sequelize('swifttype', 'swifttypeuser', '34890227193ew22es', {
    host: '192.168.10.132',           // or your database server
    dialect: 'postgres',         // choose your database type (e.g., 'postgres', 'mysql')
    logging: false,              // set to 'console.log' for SQL output during development
});

const client = new Client({
    user: 'swifttypeuser',
    host: '192.168.10.132',
    database: 'swifttype',
    password: '34890227193ew22es',
    port: 5432,
  })

//   const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//     host: process.env.DB_HOST,           // or your database server
//     dialect: 'postgres',         // choose your database type (e.g., 'postgres', 'mysql')
//     logging: false,              // set to 'console.log' for SQL output during development
// });

// const client = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
//   })

module.exports = {sequelize, client};