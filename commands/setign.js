module.exports = {
	info: {
		name: "setign",
		usage: "setign <@user> (new name)",
		explanation: "Sets the IGN for given player, or removes it.",
		permissions: 2
	},
	run: function(client, message, args) {
		var variables = client.variables;
		var functions = client.functions;

		var permissionCheck = functions.verifyPermission(this.info.permissions, message.author.id);

		if (!permissionCheck) {
			return variables.returns.permissions;
		}

		if (args.length == 0 || args.length > 2) {
			return variables.returns.args;
		}

		var userID = args[0].slice(3).substring(0, args[0].length-4);
		var user = functions.getUserByID(userID);
		var member = client.guilds[0].members.get(userID);

		if (args.length == 1) {
			member.setNickname('');
			member.setRoles([]).then(function() {
				var userData = {};

				userData.id = userID;
				userData.ign = '';

				functions.writeData(userData);

				return user.tag + '\'s IGN has been removed';
			});
		}

		if (args.length == 2) {
			var userData = {};

			userData.id = userID;
			userData.ign = args[1];

			functions.writeData(userData);

			member.setNickname(args[1]);
			return user.tag + '\'s IGN has been changed';
			
		}
	}
};