module.exports = {
	info: {
		name: "cancel",
		usage: "cancel",
		explanation: "Cancelles an ongoing purge in any channel.",
		permissions: 1
	},
	run: function(client, message, args) {
		var variables = client.variables;
		var functions = client.functions;

		if (!functions.isStaff(message.author.id)) {
			return variables.returns.permissions;
		}

		if (variables.staff.purgingChannel != null) {
			variables.staff.purgingChannel = null;
			return "you have cancelled the purge!";
		} else {
			return "there is no purge to cancel!";
		}
	}
}