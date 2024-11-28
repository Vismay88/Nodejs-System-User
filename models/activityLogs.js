const { DataTypes } = require("sequelize");
const { sequelize } = require("./idGenerators");
const { userid } = require("./idGenerators");

// Define a new model and table name
const activityLog = sequelize.define(
  "activityLog",
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
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "activity_logs",
  }
);

const activityLogConn = activityLog;

module.exports = {
  activityLogConn,
};
