var logFile = require('../logging/log.js');

module.exports = function(client) {
	var variables = client.variables;
	var functions = client.functions;

	functions.connectMySQL(client);

	//Lists all channel's IDs
	/*var guild = client.guilds.cache.find(x => x.id == '604898846568611841');

	guild.channels.cache.forEach(channel => {
	  log.info(channel.name + ": " + channel.id);
	});*/

	log.info("Bot loaded on " + variables.server.name + "!");

	logFile.addDiscordTransport(client);
}