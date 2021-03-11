const editConfig = require("../etc/configEditor.js");

module.exports = {
	info: {
		name: "purge",
		usage: "purge <# messages | 0 = all>",
		explanation: "Removes the last x messages from this channel.",
		permissions: 2
	},
	run: function(client, message, args) {
		var variables = client.variables;
		var functions = client.functions;

		var permissionCheck = functions.verifyPermission(this.info.permissions, message.author.id);

		if (!permissionCheck) {
			return variables.returns.permissions;
		}

		var channel = message.channel;

		var count;

		if (args.length != 1 || isNaN(args[0]) || (count = parseInt(args[0])) < 0) {
			return variables.returns.args;
		}

		var count = parseInt(args[0]);
		
		var warningMessage = message.author.toString() + " is purging";

		if (count == 0) {
			warningMessage += " **the entirety of** ";
		} else {
			warningMessage += " **" + count + " messages from** ";
		}

		warningMessage += channel.toString() + " in 5 seconds! Type **__" + variables.prefix + "cancel__** if you would like to cancel!";

		channel.send(warningMessage);

		variables.staff.purgingChannel = setTimeout(function() {
			purgeChannel(client, message.author.toString(), channel, count);
		}, 5000);

		return variables.returns.success;
	}
};

function purgeChannel(client, userTag, channel, count) {
	var variables = client.variables;

	if (variables.server.purgingChannel == null) {
		return variables.returns.silent;
	}

	variables.server.purgingChannel = null;

	if (count == 0) {
		var oldChannel = channel;
		var oldPosition = oldChannel.position;
		var name = oldChannel.name;
		var parent = oldChannel.parent;
		var guild = oldChannel.guild;

		oldChannel.delete();

		guild.channels.create(name, {
			type: "text",
			parent: parent
		}).then(function(channel) {
			channel.setPosition(oldPosition);
			var JSONKey = functions.channelToConfigName(name);

			if (JSONKey != "") {
				editConfig("server.IDs.channels." + JSONKey, channel.id);
			
				variables.loadConfig();
			}
		});

		
		
	} else {
		channel.bulkDelete(count);
	}
}