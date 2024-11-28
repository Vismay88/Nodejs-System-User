const { DataTypes } = require("sequelize");
const { sequelize } = require("./idGenerators");
const { userid } = require("./idGenerators");
const { system_roles } = require("../utils/enums/role");

const systemUsers = sequelize.define(
  "systemUsers",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => userid.rnd(),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM(system_roles.CUSTOMER, system_roles.ADMIN),
      allowNull: false,
      defaultValue: system_roles.CUSTOMER,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "system_users",
  }
);

const systemUsersConn = systemUsers;

module.exports = {
  systemUsersConn,
};
