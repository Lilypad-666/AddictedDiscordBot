const Transport = require('winston-transport');
const { createLogger, format, transports } = require('winston');
const { LEVEL, MESSAGE } = require('triple-beam');
const { combine, timestamp, label, printf } = format;

module.exports = class DiscordTransport extends Transport {
  constructor(client, opts) {
    super(opts);

    this.client = client;
    this.variables = client.variables;
    this.functions = client.functions;
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (this.client !== null && this.client !== undefined) {
      var logChannel = await this.functions.getChannelByID(this.variables.IDs.channels.log);

      if (logChannel === undefined) {
        log.error("Log channel is undefined!");
        return;
      }

      logChannel.send(info[MESSAGE]);
    }

    callback();
  }
}