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

module.exports = {sequelize, client};