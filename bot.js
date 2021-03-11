const discord = require("discord.js");

var fs = require('fs');

var variables = require("./variables.js");
var functions = require("./functions.js");

console.log("Starting Bot!");

var client = new discord.Client();

client.variables = variables;
client.functions = functions;

variables.setupVariables(client);

functions.setupFunctions(client.variables);

client.login(variables.server.token);