const { otpConn } = require("../models/otp");
const { systemUsersConn } = require("../models/systemUsers");
const { system_roles } = require("../utils/enums/role");

//User details with id
async function getUserDetailsById(id) {
  const user = await systemUsersConn.findOne({
    where: {
      id: id,
      isActive: true
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    },
    raw: true,
  });

  if (user) {
    user.isActive = user.isActive === 1 ? true : false;
    user.verified = user.verified === 1 ? true : false
  }

  return user;
}


async function otpVerifyCheck(emailId, OTP) {
  return await otpConn.findOne({
    where: {
      email: emailId,
      otp: OTP
    }
  })
}

async function updateUser(mail, payload) {
  return await systemUsersConn.update(payload, {
    where: {
      email: mail,
      isActive: true
    }
  })

}

module.exports = {
  getUserDetailsById,
  otpVerifyCheck,
  updateUser
};
