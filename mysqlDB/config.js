const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: `./${process.env.NODE_ENV}.env` });

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 20000,
  acquireTimeout: 20000,
  logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

module.exports = {
  sequelize,
  connectDatabase,
};

(async () => {
  await connectDatabase();
})();
