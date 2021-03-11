const functions = require("../functions.js");
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
transports.DiscordTransport = require("./discordTransport.js");

const formats = require("./formats.js");

var discord = require("discord.js");
require("../overrides/discord.js");

var today = new Date();

var variables;

function getFolderName() {
  if (typeof(variables) != "undefined" && typeof(variables.server) != "undefined") {
    return variables.server.shortName + "/";
  }

  return "";
}

var transportsList = [
new transports.Console({ 
  format: formats.customFormat
}),
new transports.File({ 
  format: formats.customFormat,
  filename: "./logging/logs/" + getFolderName() + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ".log"
})
];

//logger.exceptions.handle(new transports.File({ filename: 'uncaughtExceptions.log' }));
//
const winstonLogger = createLogger({
  transports: transportsList
});

const writeLogType = function(logLevel, ...args) {
  return function() {
    var output = [];

    Array.from(arguments).forEach(function(value) {
      switch (value.baseType) {
        case discord.baseTypes.user:
        case discord.baseTypes.channel:
        output.push(value);
        break;
        default:
        try {
          output.push(value.toString());
        } catch {(function(err) {
          log.error(err);
          return;
        })};
        break;
      }
    });
    winstonLogger[logLevel](output);
  }
}

global.log = {
  info: writeLogType("info"),
  error: writeLogType("error")
};

module.exports = {
  addDiscordTransport: function(variables) {
    var discordTransport = new transports.DiscordTransport(variables, {
      format: formats.discordFormat
    });

    winstonLogger.add(discordTransport);
  }
}