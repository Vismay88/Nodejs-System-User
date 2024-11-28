const jwt = require("jsonwebtoken");
const constants = require("../utils/securityUtils");
const { UNAUTHORIZE, INVALID_DATANOTFOUND } = require("../utils/commonMessages");
const ApiError = require("./Error");
const axios = require('axios');

const verifytoken = async function (req, res, next) {
  if (
    req.headers.authorization !== undefined &&
    req.headers.authorization !== null &&
    req.headers.authorization !== ""
  ) {
    const headerToken = req.headers.authorization.split(" ");
    try {
      let tokenRes = jwt.verify(headerToken[1], constants.jwtTokenSecret);

      if (tokenRes) {
        const decodedToken = jwt.decode(headerToken[1]);

        req.authUserId = decodedToken.tokenData.id;
        req.authUserRole = decodedToken.tokenData.role;

        next();
      } else {
        return next(ApiError.unauthorize(UNAUTHORIZE));
      }
    } catch (err) {
      return next(ApiError.unauthorize(UNAUTHORIZE));
    }
  } else {
    return next(ApiError.badRequest(INVALID_DATANOTFOUND));
  }
};

//For google
const verifyGoogleToken = async (req, res, next) => {
  try {

    if (!req.body.credential || req.body.credential == null || req.body.credential == '') {
      return next(ApiError.badRequest("No ID token is provided"));
    }

    const response = await axios.get(process.env.GOOGLE_INFO_URL, {
      headers: {
        Authorization: `Bearer ${req.body.credential}`,
      },
    });

    const userInfo = response.data;

    if (!userInfo) {
      return next(ApiError.badRequest("Failed to fetch user info from Google"));
    }

    req.user = userInfo;
    next();
  } catch (err) {
    console.error("Error verifying Google token:", err.message);
    return next(ApiError.internalError("Failed to verify token"));
  }
};


module.exports = {
  verifytoken,
  verifyGoogleToken
};
