var realmeye = require('../api/realmeye.js');
var overrides = require("../overrides/discord.js");

module.exports = {
    info: {
        name: "close",
        usage: "close",
        explanation: "Closes the given ticket.",
        permissions: 1
    },
    run: async function(client, message, args) {
        var variables = client.variables;
        var functions = client.functions;

        var permissionCheck = functions.verifyPermission(this.info.permissions, message.author.id);

        if (!permissionCheck) {
            return variables.returns.permissions;
        }

        //Ensure correct channel
        if (message.channel.parent.id != variables.IDs.groups.openApplications) {
            log.error("Incorrect channel on !close");
            return variables.returns.silent;
        }

        //Ensure that there are no arguments
        if (args.length > 0) {
            return variables.returns.args;
        }

        //Set the ticket as not active
        command = `UPDATE applications
        SET active = 1
        WHERE channelID = ` + message.channel.id + `;`;

        await variables.mysql.pool.query(command);

        var open = variables.applications.openApps;
        var closed = variables.applications.closedApps;

        var admin = functions.getUserByID(variables.IDs.staff.admin[0]);

        var application = open.find((application) => application.channelID == message.channel.id);

        if (application !== undefined) {
            var applicationIndex = open.findIndex((applicationIndex) => applicationIndex.channelID == message.channel.id);

            closed.push(application);
            open.splice(applicationIndex, 1);
        } else {
            log.error("Ticket wasn't found");
            return [ "we couldn't locate the ticket, please contact", admin ];
        }

        //Get the category where inactive tickets are
        var archivedApplications = variables.client.channels.cache.get(variables.IDs.groups.closedApplications);

        //Set the channel's parent to the inactive ticket category
        await message.channel.setParent(archivedApplications)
        .catch(function(err) {
            log.error(err);
            return [ "server error, please contact", admin ];
        });

        //Remove permissions from teh user to view the channel
        await message.channel.lockPermissions()
        .catch(function(err) {
            log.error(err);
            return [ "server error, please contact", admin ];
        });

        //Tell the user that the server was archived
        log.info(message.author, "has archived", message.channel);

        //Return that the server was archived successfully
        return [ "you have successfully archived", message.channel ];
    }
}