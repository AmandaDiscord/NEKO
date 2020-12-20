const Discord = require("discord.js");
const PresenceManager = require("./PresenceManager.js");

// @ts-ignore
class OptimizedGuild extends Discord.Guild {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {any} data
	 */
	constructor(client, data) {
		// @ts-ignore
		super(client, data);
		this.presences = new PresenceManager(client);
	}
}

module.exports = OptimizedGuild;
