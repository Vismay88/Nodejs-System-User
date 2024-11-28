const { OAuth2Client } = require("google-auth-library");
const { createAppError, createActiveityLog } = require("../repositories/log");
const ApiError = require("../middlewares/Error");
const constants = require("../utils/securityUtils");
const {
  ERROR_MESSAGE,
  CUSTOMER_ACCOUNT_CREATED,
  CUSTOMER_SIGNUP_SUCCESS,
  EMAIL_EXISTS,
  CUSTOMER_EXISTS,
} = require("../utils/commonMessages");
const { createCustomer, findCustomerByEmail } = require("../repositories/customer");
const { system_roles } = require("../utils/enums/role");


// Customer Registration
const registerCustomer = async (req, res, next) => {
  const trackId = constants.userid.rnd();

  try {
    let payload = {
      methodname: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackId,
      created_date: new Date(),

    };
    await createActiveityLog(payload);

    const customer_exists = await findCustomerByEmail(req.body.email.toLowerCase());
    if (customer_exists) {
      return next(ApiError.duplicateError(EMAIL_EXISTS));
    }

    const customerPayload = req.body;
    payload.email = req.body.email.toLowerCase();
    const passwordcustomer = constants.passwordEncrypt(customerPayload.password)
    const decodedPassword = decodeURIComponent(passwordcustomer);
    const decryptedPassword = constants.decryptValue(decodedPassword);
    customerPayload.password = constants.generatePassword(decryptedPassword);

    customerPayload.userType = system_roles.CUSTOMER;

    // Create the customer
    const customer = await createCustomer(customerPayload);
    if (customer) {
      const tokenData = {
        id: customer.id,
        username: `${customerPayload.firstName} ${customerPayload.lastName}`,
        role: system_roles.CUSTOMER,
        email: customerPayload.email,
      };

      const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
      });

      return res.status(201).json({
        success: true,
        token,
        message: CUSTOMER_ACCOUNT_CREATED,
      });
    } else {
      return next(ApiError.internalError(ERROR_MESSAGE));
    }
  } catch (error) {
    const errorPayload = {
      methodName: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackId,
      error: error.message,
      errorStackTrace: JSON.stringify(new Error().stack),
      createdDate: new Date(),
    };

    await createAppError(errorPayload);
    console.error("Error:", error.message);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};

//Customer Register with google
const googleSignUpCustomer = async (req, res, next) => {
  const trackId = constants.userid.rnd();

  try {
    const logPayload = {
      methodName: req.method,
      requestPath: req.path,
      body: JSON.stringify(req.body),
      trackId,
      date: new Date(),
    };
    await createActiveityLog(logPayload);


    let payload = req.user;
    payload.firstName = payload.given_name;
    payload.lastName = payload.family_name;
    payload.password = process.env.USER_PASSWORD_GOOGLE;
    payload.userType = system_roles.CUSTOMER;

    const customerpassword = constants.passwordEncrypt(payload.password)
    let decodePassword = decodeURIComponent(customerpassword);
    let decryptpassword = constants.decryptValue(decodePassword);
    let password = constants.generatePassword(decryptpassword);
    payload.password = password;

    const customer_exists = await findCustomerByEmail(payload.email.toLowerCase());
    if (customer_exists) {
      return next(ApiError.duplicateError(CUSTOMER_EXISTS))
    }


    const customer = await createCustomer(payload);
    if (customer) {
      const tokenData = {
        id: customer.id,
        username: `${payload.firstName} ${payload.lastName}`,
        role: payload.userType,
        email: payload.email,
      };

      const token = constants.jwt.sign({ tokenData }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRES_TIME, 10),
      });

      return res.status(200).json({
        success: true,
        token,
        message: CUSTOMER_SIGNUP_SUCCESS,
      });
    }

  } catch (error) {
    const errorLogPayload = {
      methodname: req.method,
      requestPath: req.path,
      requestBody: JSON.stringify(req.body),
      trackid: trackId,
      error: err.message,
      errorstacktrace: JSON.stringify(new Error().stack),
      created_date: new Date(),
    };

    await createAppError(errorLogPayload);
    console.error("Error:", error.message);
    return next(ApiError.internalError(ERROR_MESSAGE));
  }
};

module.exports = {
  registerCustomer,
  googleSignUpCustomer,
};
