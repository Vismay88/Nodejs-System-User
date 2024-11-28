const { DataTypes } = require("sequelize");
const { sequelize } = require("./idGenerators");
const { userid } = require("./idGenerators");

const otp = sequelize.define(
    "otp",  
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => userid.rnd(),
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        otp: {
            type: DataTypes.STRING(6),
            allowNull: false,

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
        tableName: "otp",
        timestamps: true,

    }
);

const otpConn = otp;

module.exports = {
    otpConn,
};
