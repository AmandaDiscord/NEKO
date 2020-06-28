const Discord = require("discord.js");
const PresenceManager = require("./PresenceManager.js");

class OptimizedGuild extends Discord.Guild {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {any} data
	 */
	constructor(client, data) {
		super(client, data);
		this.presences = new PresenceManager(client);
	}
}

module.exports = OptimizedGuild;
