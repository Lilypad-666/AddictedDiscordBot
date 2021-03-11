const fs = require("fs");
this.variables = null;

module.exports = {
	setupFunctions: function(variables) {
		this.variables = variables;
  },

  isAdmin: function(userID) {
    return this.variables.staff.admin.join(" ").includes(userID);
  },

  isStaff: function(userID) {
    return this.variables.staff.admin.join(" ").includes(userID) || this.variables.staff.mod.join(" ").includes(userID);
  },

  getStaff: function() {
    var staff = this.variables.staff;
    return staff.admin.concat(staff.mod);
  },

  getUserByID: function(userID) {
    return this.variables.client.users.cache.find((user) => userID == user.id);
  },

  getChannelByID: function(channelID) {
    return this.variables.client.channels.cache.find((channel) => channelID == channel.id);
  },

  verifyPermission: function(permissionID, userID) {
    if (permissionID == 0) {
      return true;
    } else if (permissionID == 1) {
      return this.isStaff(userID);
    } else if (permissionID == 2) {
      return this.isAdmin(userID);
    }
  },

  writeData: function(userData) {
    if (typeof(userData.age) != undefined) {
      var command = `INSERT INTO users (discordID, ign)
      VALUES ('` + userData.id + `', '` + userData.ign + `')
      ON DUPLICATE KEY UPDATE ign='` + userData.ign + `';`;

      this.variables.mysql.pool.query(command);
    } else {
      var command = `INSERT INTO users (discordID, ign, age, joinReason)
      VALUES ('` + userData.id + `', '` + userData.ign + `', '` + userData.age + `', '` + userData.joinReason + `')
      ON DUPLICATE KEY UPDATE ign='` + userData.ign + `', age='` + userData.age + `', joinReason='` + userData.joinReason + `';`

      this.variables.mysql.pool.query(command);
    }
  },

  connectMySQL: function(client) {
    this.variables.mysql.pool = require('./logging/mysql.js');
    this.variables.mysql.pool.createPool(client);
  },

  channelToConfigName: function(channelName) {
    switch (channelName) {
      case "bot-log":
        return "log";
      case "link-account":
        return "link";
      case "apply-here":
        return "apply";
      case "rotmg":
        return "general";
      default:
        return "";
    }
  }
}