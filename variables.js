const functions = require("./functions.js");
const Enmap = require("enmap");
const fs = require("fs");

//Variables with defaults
this.client = null;

this.loadConfig = function() {
  var config = JSON.parse(fs.readFileSync('./config.json'));
  var serverConfig = config.server;

  this.prefix = config.prefix;

  this.IDs = serverConfig.IDs;

  if (serverConfig.IDs.staff.admin[0] != null) {
    this.staff.admin = [ serverConfig.IDs.staff.admin[0] ];
  }

  this.server = {
    name: serverConfig.name,
    shortName: serverConfig.shortName,
    token: serverConfig.token
  };

  this.mysql = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    pool: null
  }
}

this.setupVariables = function(client) {
  this.commands = new Enmap();

  setupListeners(client, this.commands);

  this.staff = {
    admin: [],
    mod: [],
    purgingChannel: null
  };

  this.applications = {
    openApps: [
      /*{
        userDiscordID: '',
        channelID: ''
      }*/
    ],
    closedApps: [
      /*{
        userDiscordID: '',
        channelID: ''
      }*/
    ]
  }

  this.loadConfig();

  this.client = client;
}

this.returns = Object.freeze({
  "success" : 0,
  "permissions" : 1,
  "args" : 2,
  "silent" : 3
});

function setupListeners(client, commands) {
  fs.readdir("./events/", function(err, files) {
    if (err) { 
      return log.error(err);
    }

    files.forEach(function(file) {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
  });
  
  fs.readdir(`./commands/`, function(err, files) {
    if (err) {
      return log.error(err);
    }

    files.forEach(function(file) {
      if (!file.endsWith(".js")) {
        return;
      }

      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      commands.set(commandName, props);
    });
  });
}