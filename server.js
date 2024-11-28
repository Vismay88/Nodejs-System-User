const { sequelize } = require("./mysqlDB/config");
const app = require("./app");
const { UNEXPECTION_ERROR, SERVER_PORT, DATABASE_SYNC_ERROR } = require("./utils/commonMessages");

//Exceptions
process.on("uncaughtException", (err) => {
    console.error(`${UNEXPECTION_ERROR}:`, err.name, err.message);
    process.exit(1);
});

//start server
const startServer = async () => {
    try {
        await sequelize.sync();
        const PORT = process.env.NODE_PORT || 9008;

        const server = app.listen(PORT, () => {
            console.log(`${SERVER_PORT} ${PORT}`);
        });

        process.on("unhandledRejection", (err) => {
            console.error(`${UNEXPECTION_ERROR}:`, err.name, err.message);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error(`${DATABASE_SYNC_ERROR}:`, err);
        process.exit(1);
    }
};

startServer();
