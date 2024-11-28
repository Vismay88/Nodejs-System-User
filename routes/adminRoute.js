const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyGoogleToken = require('../middlewares/checkAuth')

router.post("/google/login", verifyGoogleToken.verifyGoogleToken, adminController.adminGoogleSignIn);

router.post("/google/register", verifyGoogleToken.verifyGoogleToken, adminController.adminGoogleSignUp);

router.post("/register", adminController.createAdminAccount);

router.post("/login", adminController.adminSignIn);



module.exports = router;
