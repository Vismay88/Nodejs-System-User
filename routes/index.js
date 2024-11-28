const customer = require("./customerRoute");
const admin = require("./adminRoute");
const common = require("./common");

module.exports = (app) => {
  app.use("/customer", customer);
  app.use("/admin", admin);
  app.use("/common", common);
  ;

};
