const { systemUsersConn } = require("../models/systemUsers");
const { system_roles } = require("../utils/enums/role");

async function findCustomerByEmail(email) {
  return await systemUsersConn.findOne({
    where: {
      email: email,
      userType: system_roles.CUSTOMER
    },
    raw: true,
  });
}

async function createCustomer(payload) {
  return await systemUsersConn.create(payload);
}

module.exports = {
  findCustomerByEmail,
  createCustomer,
};
