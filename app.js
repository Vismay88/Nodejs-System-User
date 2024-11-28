const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const HttpError = require("./middlewares/HttpError");
require("dotenv").config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

//Routes
require("./routes")(app);

//Middleware for error
app.use(HttpError);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

module.exports = app;
