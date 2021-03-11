var discord = require("discord.js");
require("../overrides/discord.js");

module.exports = async function(client, message) {
    // Ignore all bots
    if (message.author.bot) {
        return;
    }

    var variables = client.variables;
    var functions = client.functions;

    var realmeye = require('../api/realmeye.js');

    var channel = message.channel;

    var author = message.author;

    var member = message.member;

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(variables.prefix) !== 0) {
        // Our standard argument/command name definition.
        const args = message.content.toLowerCase().trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (message.channel.id == variables.IDs.channels.link) {

            var displayUsername = message.content;

            log.info(author, " is registering as " + displayUsername);

            message.delete();

            var loadingMessage = await channel.send(author.toString() + ", loading " + displayUsername + "'s data from RealmEye!");

            if (args.length > 0 || command.includes("realmeye")) {
                await loadingMessage.delete();
                channel.send(author.toString() + ", please ensure that **only** your IGN is posted, nothing else! Ex: Muk").then(function(message) {
                    message.delete({ timeout: 5000 });
                });
            } else {
                let player = await realmeye.player(command);

                if (player != null && player.exists) {
                    await loadingMessage.delete();
                    channel.send({embed: {
                        color: 7419530,
                        title: "**__Please Confirm Account__**",
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
                    }}).then(function(message) {
                        message.react('✅').then(function() {
                            message.react('❎');
                        });

                        const filter = function(reaction, user) {
                            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && user.id === author.id;
                        };

                        const collector = message.createReactionCollector(filter, {time: 30000});

                        collector.on('collect', async function(r) {
                            if (r.emoji.name == '✅') {
                                loadingMessage.delete();
                                message.delete();

                                var role = message.guild.roles.cache.find((role) => role.id == variables.IDs.roles.friend);

                                await member.roles.add(role);
                                await member.setNickname(player.username);

                                var general = functions.getChannelByID(variables.IDs.channels.general);

                                general.send(author.toString() + " has been verified! Welcome! <:panHappy1:605026508683214848>");

                                var userData = {};

                                userData.id = author.id;
                                userData.ign = player.username;

                                functions.writeData(userData);

                                log.info(author, " has registered as " + displayUsername);
                            }

                            if (r.emoji.name == '❎') {
                                loadingMessage.delete();
                                message.delete();

                                log.info(author, " has cancelled his registration as " + displayUsername);
                            }
                        });
                    });

                } else {
                    await loadingMessage.delete();
                    channel.send(author.toString() + ", we could not find a player by the name of " + displayUsername + "!").then(function(message) {
                        message.delete({timeout: 5000});
                    });
                }
            }
        }
    } else {
        message.delete({ timeout: 500 });

        // Our standard argument/command name definition.
        const args = message.content.slice(1).toLowerCase().trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // Grab the command data from the client.commands Enmap
        const cmd = variables.commands.get(command);

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        var fullCmd = command;

        if (args != 0) {
            fullCmd += " ";

            args.forEach(function(argument) {
                fullCmd += argument + " ";
            });

            fullCmd = fullCmd.slice(0, -1);
        }

        log.info(author, " is running <", variables.prefix, fullCmd, "> in ", message.channel);

        // Run the command
        var commandExit = await cmd.run(client, message, args);

        if (isNaN(commandExit)) {
            if (Array.isArray(commandExit)) {
                log.info.apply( this, commandExit );
                channel.send(author.toString() + " " + commandExit.join(" ")).then(function(message) {
                        message.delete({timeout: 5000});
                    });
            } else {
                //Custom
                if (commandExit != null) {
                    channel.send(author.toString() + " " + commandExit).then(function(message) {
                        message.delete({timeout: 5000});
                    });

                    log.info("[", channel, "] (" + author.tag + ") {" + fullCmd + "} " + commandExit + ".");
                }
            }
        } else {

            if (commandExit == variables.returns.success) {
                //Success
            } else

            if (commandExit == variables.returns.permissions) {
                //Permissions
                channel.send(author.toString() + ", invalid permissions for this command!").then(function(message) {
                    message.delete({timeout: 5000});
                });

                log.info("[", channel, "] (" + author.tag + ") {" + fullCmd + "} Invalid permissions.");
            } else

            if (commandExit == variables.returns.args) {
                //Args
                channel.send(author.toString() + ", invalid argument(s)! Proper usage:\n\n**__<Required> (Optional)__**\n\n```" + cmd.info.usage + "```").then(function(message) {
                    message.delete({timeout: 5000});
                })

                log.info("[", channel, "] (" + author.tag + ") {" + fullCmd + "} Invalid arguments.");
            }

            if (commandExit == variables.returns.silent) {
                //Silent exit
                log.info("[", channel, "] (" + author.tag + ") {" + fullCmd + "} Silent exit.");   
            }
        }
    }
};