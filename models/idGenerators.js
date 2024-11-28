const { DataTypes } = require("sequelize");
const { sequelize } = require("../mysqlDB/config");
const ShortUniqueId = require("short-unique-id");

const userid = new ShortUniqueId({ length: 10 });
module.exports = { sequelize, DataTypes, userid };
