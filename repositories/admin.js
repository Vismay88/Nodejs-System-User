const { systemUsersConn } = require("../models/systemUsers");
const { system_roles } = require("../utils/enums/role");

async function adminExists(email) {
  return await systemUsersConn.findOne({
    where: {
      email: email,
      isActive: true,
    },
    raw: true,
  });
}

async function adminCreate(payload) {
  return await systemUsersConn.create(payload);
}

module.exports = {
  adminExists,
  adminCreate,
};
