var mysql = require('mysql');
var variables;

var pool;

function queryPromise(cmd) {
	return new Promise(function(resolve, reject) {
		pool.query(cmd, function(err, rows) {
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}


module.exports = {
	query: function(cmd) {
		queryPromise(cmd).then(function(rows) {
			return rows;
		}).catch(function(err) {
			throw err;
		});
	},

	createPool: function(client, config) {
		variables = client.variables;
		functions = client.functions;

		pool = mysql.createPool({
			host: variables.mysql.host,
			user: variables.mysql.user,
			password: variables.mysql.password,
			multipleStatements: true
		});

		var command = `CREATE DATABASE IF NOT EXISTS \`addicted\`;`
		+
		`USE \`addicted\`;`
		+
		`CREATE TABLE IF NOT EXISTS \`users\` (
		\`discordID\` bigint(20) NOT NULL,
		\`ign\` varchar(255) DEFAULT NULL,
		\`age\` int(11) DEFAULT NULL,
		\`joinReason\` varchar(45) DEFAULT NULL,
		PRIMARY KEY (\`discordID\`),
		UNIQUE KEY \`discordID_UNIQUE\` (\`discordID\`));`
		+
		`CREATE TABLE IF NOT EXISTS \`applications\` (
		\`applicationID\` int(11) NOT NULL AUTO_INCREMENT,
		\`userDiscordID\` bigint(20) NOT NULL,
		\`channelID\` bigint(20) NOT NULL,
		\`age\` int(11) DEFAULT NULL,
		\`joinReason\` varchar(255) DEFAULT NULL,
		\`notes\` varchar(255) DEFAULT NULL,
		\`active\` bit(1) NOT NULL DEFAULT b'1',
		\`accepted\` bit(1) NOT NULL DEFAULT b'0',
		PRIMARY KEY (\`applicationID\`),
		UNIQUE KEY \`applicationID_UNIQUE\` (\`applicationID\`));`


		queryPromise(command).then(function() {
			queryPromise(`USE \`addicted\`; SELECT * FROM applications WHERE active = 1`).then(function(rows) {
				for (var i = 0; i < rows[1].length; i++) {
					var row = rows[1][i];
					variables.applications.openApps.push({
						userDiscordID: row.userDiscordID,
						channelID: row.channelID
					});

				}
			}).catch(function(err) {
				log.error(err);
			})
		}).catch(function(err) {
			log.error(err);
		});

		
	}
}