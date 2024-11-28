const ApiError = require("./Error");

function ApiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err);
  }
  return res.status(500).json("Something went wrong.");
}

module.exports = ApiErrorHandler;
