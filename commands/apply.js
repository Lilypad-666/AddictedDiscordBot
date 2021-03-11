var realmeye = require('../api/realmeye.js');
var overrides = require("../overrides/discord.js");

module.exports = {
	info: {
		name: "apply",
		usage: "apply",
		explanation: "Starts an application for Addicted.",
		permissions: 0
	},
	run: async function(client, message, args) {
		var variables = client.variables;
		var functions = client.functions;

		if (args.length > 0) {
			return variables.returns.args;
		}

		if (message.channel.id != variables.IDs.channels.apply) {
			return "please use that command in " + message.guild.channels.cache.get(variables.IDs.channels.apply).toString() + "!";
		}

		for (var i = 0; i < variables.applications.openApps.length; i++) {
			var app = variables.applications.openApps[i];

			if (app.userDiscordID == message.author.id) {
				try {
					return "you already have " + message.guild.channels.cache.get(app.channelID).toString() + " open, please use that application!";
				} catch (e) {
					variables.applications.openApps.splice(i, 1);
				}
			}
		}

		var server = client.guilds.cache.get(variables.IDs.server);

		var activeApps = server.channels.cache.get(variables.IDs.groups.openApplications);

		let player = await realmeye.player(message.guild.member(message.author).displayName).catch(function(err) {
			log.error(err)
		});

		if (player == null || !player.exists) {
			return "there is an issue with your Realmeye! Please ensure your characters are public!";
		}

		let channel = await message.guild.channels.create(player.username, {
			type: "text",
			parent: activeApps
		}).catch(function(err) {
			log.error(err) 
		});

		channel.updateOverwrite(
			message.author,
			{ VIEW_CHANNEL: true }
		);

		variables.applications.openApps.push({
			userDiscordID: message.author.id,
			channelID: channel.id
		});

		var command = `INSERT INTO applications (userDiscordID, channelID) VALUES ('` + message.author.id + `', '` + channel.id + `')`;

		variables.mysql.pool.query(command);

		channel.send(message.author.toString()).then(async function(message) {
			message.delete()
		});

		if (player.exists) {
			channel.send({embed: {
				color: 7419530,
				title: "Player Info",
				fields: [{
					name: "**IGN**",
					value: "" + player.username
				},
				{
					name: "**Stars**",
					value: "" + player.stars
				},
				{
					name: "**Alive Fame**",
					value: "" + player.fame
				},
				{
					name: "**Character Count**",
					value: "" + player.charCount
				},
				{
					name: "**Realmeye Link**",
					value: '[Link To Realmeye](https://realmeye.com/player/' + player.username + ')'
				}],
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "© Muk 2019"
				}
			}});

			channel.send({embed: {
				color: 7419530,
				title: "Questions To Answer",
				fields: [{
					name: "**Age**",
					value: "What's your current age?"
				},{
					name: "**Mic**",
					value: "Do you have a decent quality microphone, with minimal background noise?"
				},{
					name: "**Playtime**",
					value: "How often and when do you usually play?"
				},{
					name: "**Timezone**",
					value: "What's your timezone?"
				},{
					name: "**Why Join?**",
					value: "Why do you wish to join Addicted?"
				}],
				timestamp: new Date(),
				footer: {
					icon_url: client.user.avatarURL,
					text: "© Muk 2019"
				}
			}});
		} else {
			return "there is an issue with your Realmeye! Please ensure your characters are public!";
		}

		return variables.returns.success;
	}
}