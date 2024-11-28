const { applicationErrorLogConn } = require("../models/applicationErrorLog");
const { activityLogConn } = require("../models/activityLogs");

async function createAppError(payload) {
  return await applicationErrorLogConn.create(payload);
}

async function createActiveityLog(payload) {
  return await activityLogConn.create(payload);
}

module.exports = {
  createAppError,
  createActiveityLog,
};
