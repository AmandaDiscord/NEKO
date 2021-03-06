const Discord = require("discord.js");

const Presence = require("./Presence");

// @ts-ignore
class OptimizedUser extends Discord.User {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {any} data
	 */
	constructor(client, data) {
		// @ts-ignore
		super(client, data);
		/**
		 * @type {import("../typings").Neko}
		 */
		this.client
	}
	/**
	 * @returns {import("../typings").OptimizedPresence}
	 */
	// @ts-ignore
	get presence() {
		if (this.client.optimizations && this.client.optimizations.globalPresences && this.client.presences) return this.client.presences.get(this.id);
		else {
			for (const guild of this.client.guilds.cache.values()) {
				// @ts-ignore
				if (guild.presences.cache.has(this.id)) return guild.presences.cache.get(this.id);
			}
			// @ts-ignore
			return new Presence(this.client, { user: { id: this.id } });
		}
	}
}

module.exports = OptimizedUser;
