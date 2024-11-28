const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const verifyGoogleToken = require('../middlewares/checkAuth')

router.post("/register", customerController.registerCustomer);

router.post("/google/login", verifyGoogleToken.verifyGoogleToken, customerController.googleSignUpCustomer);

module.exports = router;
