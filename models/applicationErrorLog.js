const { DataTypes } = require("sequelize");
const { sequelize } = require("./idGenerators");
const { userid } = require("./idGenerators");

const applicationErrorLog = sequelize.define(
  "applicationErrorLog", 
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => userid.rnd(),
    },
    methodName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestPath: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    requestBody: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    trackId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    errorStackTrace: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "application_error_logs",
  }
);

const applicationErrorLogConn = applicationErrorLog;

module.exports = {
  applicationErrorLogConn,
};
