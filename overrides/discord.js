var discord = require("discord.js");

// Override message delete
discord.Message.prototype.delete = function(options = {}) {
	if (this.deleted) {
		return;
	}

	if (typeof options !== 'object') {
		throw new TypeError('INVALID_TYPE', 'options', 'object', true);
	}

    const { timeout = 0, reason } = options;

    if (timeout <= 0) {
      return this.channel.messages.delete(this.id, reason).then(function() {this});
    } else {
      return new Promise((resolve) => {
        this.client.setTimeout(() => {
          resolve(this.delete({ reason }));
        }, timeout);
      });
    }
}

discord.baseTypes = Object.freeze({
  "user" : 0,
  "channel" : 1
});

discord.User.prototype.baseType = discord.baseTypes.user;

discord.User.prototype.toString = function(full = false) {
  return full ? `<@${this.id}><@${this.username}#${this.discriminator}>` : `<@${this.id}>`;
}

discord.Channel.prototype.baseType = discord.baseTypes.channel;

discord.Channel.prototype.toString = function(full = false) {
  return full ? `<#${this.id}><#${this.name}>` : `<#${this.id}>`;
}