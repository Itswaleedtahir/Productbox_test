"use strict";
const { DataTypes, QueryTypes } = require("sequelize");
const moment = require("moment");
const table = "users";
const createdAt = moment().unix();
const updatedAt = moment().unix();
module.exports = {
  up: async function (queryInterface) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name:{
        type: DataTypes.STRING,
        allowNull: false
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otp_expiration_date:{
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      phone_number:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async function (queryInterface) {
    return queryInterface.dropTable(table);
  },
};
