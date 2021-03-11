const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var discord = require("discord.js");
require("../overrides/discord.js");

var formatTime = timestamp({ format: 'HH:mm:ss' });
var formatDate = timestamp({ format: 'MM-DD-YYYY HH:mm:ss' });

module.exports = {
	customFormat: combine(formatTime, printf(function(info) {
		var message = "";

		message += info.timestamp + " | ";

	  	//If error, show trace
	  	if (typeof(info.trace) != "undefined") {
	  		message += info.level.toUpperCase() + " | ";
	  		message += info.trace[0].file + ":";
	  		message += info.trace[0].line + " | ";
	  		message += info.message.split("\n")[0];
	  	} else {
	  		message += info.level.toUpperCase() + " | ";
	  		for (var i = 0; i < info.message.length; i++) {
	  			var arg = info.message[i];
	  			switch (arg.baseType) {
	  				case discord.baseTypes.user:
	  				case discord.baseTypes.channel:
	  				message += arg.toString(true);
	  				break;
	  				default:
	  				try {
	  					message += arg.toString();
	  				} catch {(function(err) {
	  					log.error(err);
	  					return;
	  				})};
	  				break;
	  			}
	  			
	  		}
	  	}

	  	return message;
	  })),
	discordFormat: combine(formatDate, printf(function(info) {
		message = [];

		if (info.level == "info") {
			message.push("```md");
			message.push("< " + info.timestamp + " >");
			message.push("<" + info.level.toUpperCase() + ">");
			var line = "";
			for (var i = 0; i < info.message.length; i++) {
				var arg = info.message[i];
				if (arg.baseType == discord.baseTypes.user) {
					if (line != "") {
						message.push(line);
						line = "";
					}

					line += "[@" + arg.id + "]";
					line += "[@" + arg.username + "#" + arg.discriminator + "]";
				} else if (arg.baseType == discord.baseTypes.channel) {
					if (line != "") {
						message.push(line);
						line = "";
					}

					line += "[#" + arg.id + "]";
					line += "[#" + arg.name + "]";
				} else {
					try {
						line += arg.toString();
					} catch {(function(err) {
						log.error(err);
						return;
					})};
				}
			}
			if (line != "") {
				message.push(line);
			}
		}

		message.push("```");
		return message.join("\n");
	}))
}