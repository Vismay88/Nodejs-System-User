const { createAppError, createActiveityLog } = require("../repositories/log");
const ApiError = require("../middlewares/Error");
const constants = require("../utils/securityUtils");
const { ERROR_MESSAGE, ERROR_DATA_NOT_FOUND, CUSTOMER_DATA_NOT_FOUND, OTP_EXPIRED, OTP_NOT_VERIFIED, OTP_SUCCESS } = require("../utils/commonMessages");
const { getUserDetailsById, otpVerifyCheck, updateUser } = require("../repositories/common");

const getUserDetails = async (req, res, next) => {
  const trackid = constants.userid.rnd();
  try {
    try {
      let payload = {
        methodname: req.method,
        request: req.path,
        body: JSON.stringify(req.body),
        trackid: trackid,
        date: new Date(),
      };
      await createActiveityLog(payload);
    } catch (err) {
      console.log(err);
      return next(ApiError.internalError(ERROR_MESSAGE));
    }

    let userResult = await getUserDetailsById(req.authUserId);
    if (!userResult) {
      return next(ApiError.badRequest(ERROR_DATA_NOT_FOUND));
    }

    return res.status(200).json({
      success: true,
      data: userResult,
    });
  } catch (err) {
    let payload = {
      methodname: req.method,
      request: req.path,
      body: JSON.stringify(req.body),
      trackid: trackid,
      error: err.message,
      errorstacktrace: JSON.stringify(new Error().stack),
      date: new Date(),
    };
    await createAppError(payload);
    console.error("Error:", err.message);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};

const verifyOtp = async (req, res, next) => {
  const trackid = constants.userid.rnd();
  try {
    try {
      let payload = {
        methodname: req.method,
        request: req.path,
        body: JSON.stringify(req.body),
        trackid: trackid,
        date: new Date(),
      };
      await createActiveityLog(payload);
    } catch (err) {
      console.log(err);
      return next(ApiError.internalError(ERROR_MESSAGE));
    }

    let payload = req.body;

    const check = await otpVerifyCheck(payload.email, payload.otp);
    if (!check) {
      return next(ApiError.badRequest(OTP_NOT_VERIFIED));
    }

    //15 min checking
    const OTP_EXPIRATION_TIME = 15 * 60 * 1000;

    if (Date.now() - new Date(check.updatedAt).getTime() > OTP_EXPIRATION_TIME) {
      return next(ApiError.badRequest(OTP_EXPIRED));
    }
    let otpPayload = {
      verified: true,
    }
    await updateUser(payload.email, otpPayload)
    return res.status(200).json({
      success: true,
      message: OTP_SUCCESS,
    });

  } catch (err) {
    let payload = {
      methodname: req.method,
      request: req.path,
      body: JSON.stringify(req.body),
      trackid: trackid,
      error: err.message,
      errorstacktrace: JSON.stringify(new Error().stack),
      date: new Date(),
    };
    await createAppError(payload);
    console.error("Error:", err.message);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};


module.exports = {
  getUserDetails,
  verifyOtp
};
