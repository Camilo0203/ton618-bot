const { hasStaffPrivileges } = require("../../../utils/accessControl");

function isStaff(member, s) {
  return hasStaffPrivileges(member, s);
}

module.exports = { isStaff };
