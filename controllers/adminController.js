const { createAppError, createActiveityLog } = require("../repositories/log");
const constants = require("../utils/securityUtils");
const ApiError = require("../middlewares/Error");
const {
  ERROR_MESSAGE,
  ADMIN_SIGNIN_SUCCESS,
  ADMIN_SIGNUP_SUCCESS,
  ADMIN_SIGNUP_ERROR,
  INVALID_AUTH,
  ADMIN_ACCOUNT_CREATED,
  EMAIL_EXISTS,
  CUSTOMER_INVALID_AUTH,
  LOGIN_SUCCESS,
  ADMIN_EXISTS,
  ADMIN_DATA_NOT_FOUND,
} = require("../utils/commonMessages");
const { adminCreate, adminExists } = require("../repositories/admin");
const { system_roles } = require("../utils/enums/role");
const sendOTPEmail = require("../utils/sendOTPEmail");
const { createOtp } = require("../repositories/otp");

//Normal Register
const createAdminAccount = async (req, res, next) => {
  const trackId = constants.userid.rnd();
  try {
    try {
      let payload = {
        methodname: req.method,
        requestPath: req.path,
        requestBody: JSON.stringify(req.body),
        trackId,
        created_date: new Date(),
      };
      await createActiveityLog(payload);
    } catch (err) {
      console.log(err);
      return next(ApiError.internalError(ERROR_MESSAGE));
    }

    const existingAdmin = await adminExists(req.body.email.toLowerCase());
    if (existingAdmin) {
      return next(ApiError.duplicateError(EMAIL_EXISTS));
    }

    const adminPayload = {
      ...req.body,
      email: req.body.email.toLowerCase(),
      userType: system_roles.ADMIN,
    };

    // Encrypt the password
    const encryptedPassword = constants.passwordEncrypt(adminPayload.password);
    const decodedPassword = decodeURIComponent(encryptedPassword);
    const decryptedPassword = constants.decryptValue(decodedPassword);
    adminPayload.password = constants.generatePassword(decryptedPassword);

    // Create the admin
    const newAdmin = await adminCreate(adminPayload);
    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendOTPEmail(newAdmin.email, otp);
    let otp_payload = {
      email: req.body.email.toLowerCase(),
      otp: otp,
    }
    const optCreateResult = await createOtp(otp_payload);
    if (newAdmin && optCreateResult) {
      const tokenData = {
        id: newAdmin.id,
        username: `${newAdmin.firstName} ${newAdmin.lastName}`,
        role: adminPayload.userType,
        email: newAdmin.email,
      };

      const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
      });

      return res.status(200).json({
        success: true,
        token,
        message: ADMIN_ACCOUNT_CREATED,
      });
    } else {
      return next(ApiError.internalError(ERROR_MESSAGE));
    }
  } catch (err) {
    let payload = {
      methodname: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackid: trackId,
      error: err.message,
      errorstacktrace: JSON.stringify(new Error().stack),
      created_date: new Date(),
    };
    await createAppError(payload);
    console.error("Error:", err.message);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};

//Normal Sign in
const adminSignIn = async function (req, res, next) {
  const trackId = constants.userid.rnd();
  try {
    try {
      let payload = {
        methodname: req.method,
        requestPath: req.path,
        requestBody: JSON.stringify(req.body),
        trackId,
        created_date: new Date(),
      };
      await createActiveityLog(payload);
    } catch (err) {
      console.log(err);
      return next(ApiError.internalError(ERROR_MESSAGE));
    }
    const adminData = await adminExists(req.body.email.toLowerCase());
    if (!adminData) {
      return next(ApiError.notfound(ADMIN_DATA_NOT_FOUND));
    }

    // Check if the user is an admin
    if (adminData.userType !== system_roles.ADMIN) {
      return next(ApiError.unauthorize(CUSTOMER_INVALID_AUTH));
    }


    const encryptedInputPassword = constants.passwordEncrypt(req.body.password);
    const decodedPassword = decodeURIComponent(encryptedInputPassword);
    const decryptedPassword = constants.decryptValue(decodedPassword);
    const storedPassword = constants.getPassword(adminData.password);

    const isPasswordValid = decryptedPassword === storedPassword;
    if (!isPasswordValid) {
      return next(ApiError.unauthorize(INVALID_AUTH));
    }

    const tokenData = {
      id: adminData.id,
      email: adminData.email,
      username: `${adminData.firstName} ${adminData.lastName}`,
      role: adminData.userType,
    };

    const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
    });

    return res.status(200).json({
      success: true,
      token,
      message: LOGIN_SUCCESS,
    });

  } catch (err) {
    let payload = {
      methodname: req.method,
      request: req.path,
      body: JSON.stringify(req.body),
      trackid: trackId,
      error: err,
      errorstackerace: JSON.stringify(new Error().stack),
      date: new Date(),
    };
    await createAppError(payload);
    console.log(err);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};


//--------------------------------------------------------Google Auth-----------------------------------------------------------

//Login
const adminGoogleSignIn = async (req, res, next) => {
  const trackId = constants.userid.rnd();
  try {
    let payloaddata = {
      methodname: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackId,
      created_date: new Date(),
    };
    await createActiveityLog(payloaddata);


    const userInfo = req.user;

    if (!userInfo) {
      return next(ApiError.badRequest("Provide ID token"));
    }


    const adminFind = await adminExists(userInfo.email);
    if (!adminFind) {
      return next(ApiError.notfound(ADMIN_DATA_NOT_FOUND))
    }

    if (adminFind.userType == system_roles.ADMIN) {
      let tokenData = {
        id: adminFind.id,
        username: `${adminFind.firstName} ${adminFind.lastName}`,
        role: adminFind.userType,
        email: adminFind.email,
      }

      const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
      });


      return res.status(200).json({
        success: true,
        token: token,
        message: ADMIN_SIGNIN_SUCCESS,
      });
    }
    else {
      return next(ApiError.badRequest(CUSTOMER_INVALID_AUTH))
    }
  } catch (err) {
    let errorPayload = {
      methodname: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackid: trackId,
      error: err.message,
      errorstacktrace: JSON.stringify(new Error().stack),
      created_date: new Date(),
    };
    await createAppError(errorPayload);

    console.error("Error:", err.message);

    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};

//Register
const adminGoogleSignUp = async (req, res, next) => {
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

    let payload = req.user;
    payload.firstName = payload.given_name;
    payload.lastName = payload.family_name;
    payload.password = process.env.USER_PASSWORD_GOOGLE;
    payload.userType = system_roles.ADMIN;

    const passwordadmin = constants.passwordEncrypt(payload.password)
    let decodePassword = decodeURIComponent(passwordadmin);
    let decryptpassword = constants.decryptValue(decodePassword);
    let password = constants.generatePassword(decryptpassword);
    payload.password = password;

    const adminEmailChecker = await adminExists(payload.email.toLowerCase());
    if (adminEmailChecker) {
      return next(ApiError.duplicateError(ADMIN_EXISTS))
    }

    const adminCreateResult = await adminCreate(payload);
    if (adminCreateResult) {
      let tokenData = {
        id: adminCreateResult.id,
        username: `${payload.firstname} ${payload.lastname}`,
        role: payload.usertype,
        email: payload.email,
      };
      const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
      });
      return res.status(200).json({
        success: true,
        token: token,
        message: ADMIN_SIGNUP_SUCCESS,
      });
    } else {
      return next(ApiError.internalError(ADMIN_SIGNUP_ERROR));
    }

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
  createAdminAccount,
  adminSignIn,
  adminGoogleSignIn,
  adminGoogleSignUp,
};
