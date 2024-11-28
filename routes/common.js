const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");
const verifytoken = require("../middlewares/checkAuth");

router.get(
  "/mydetails",
  verifytoken.verifytoken,
  commonController.getUserDetails
);

router.post(
  "/otpverify",
  commonController.verifyOtp
);

module.exports = router;
