class ApiError {
  constructor(code, message) {
    (this.code = code), (this.message = message);
  }

  static notfound(msg) {
    return new ApiError(404, msg);
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static unauthorize(msg) {
    return new ApiError(401, msg);
  }

  static internalError(msg) {
    return new ApiError(500, msg);
  }

  static duplicateError(msg) {
    return new ApiError(409, msg);
  }
}

module.exports = ApiError;
