const { otpConn } = require("../models/otp");

async function findOtpByEmail(email) {
    return await otpConn.findOne({
        where: {
            email: email,
        },
        raw: true,
    });
}

async function createOtp(payload) {
    return await otpConn.create(payload);
}

module.exports = {
    findOtpByEmail,
    createOtp,
};
