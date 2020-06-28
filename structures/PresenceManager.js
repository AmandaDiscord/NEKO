const Discord = require("discord.js");

class OptimizedPresenceManager extends Discord.PresenceManager {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {Iterable<any>} [iterable]
	 */
	constructor(client, iterable) {
		super(client, iterable);
		/**
		 * @type {import("../typings").Neko}
		 */
		this.client;
	}
	/**
	 * @param {{ user: { id: string }, guild: import("./Guild"), status: import("../typings").StatusType }} data
	 * @param {boolean} [cache]
	 */
	add(data, cache) {
		const existing = this.cache.get(data.user.id);
		const overrides = this.client.optimizations.presenceOverrides;
		const bot = this.client.users.cache.get(data.user.id) ? this.client.users.cache.get(data.user.id).bot : false;

		if (this.client.optimizations.presencesDisabled) return data;
		if (overrides.length > 0) {
			/** @type {Array<import("../typings").UserPresenceException>} */
			// @ts-ignore
			const userOverrides = overrides.filter(ex => ex[0] === "user");
			/** @type {Array<import("../typings").GuildPresenceException>} */
			// @ts-ignore
			const guildOverrides = overrides.filter(ex => ex[0] === "guild");
			/** @type {Array<import("../typings").StatusPresenceException>} */
			// @ts-ignore
			const statusOverrides = overrides.filter(ex => ex[0] === "status");

			if (userOverrides.find(ex => ex[1] === data.user.id && ex[2] === false)) return data;
			if (userOverrides.length > 0 && !userOverrides.find(ex => ex[1] === data.user.id && ex[2] === true)) return data;

			if (bot && overrides.find(ex => ex[0] === "bot" && ex[1] === false && !userOverrides.find(it => it[1] === data.user.id && it[2] === true))) return data;

			if (overrides.find(ex => ex[0] === "memberCount" && data.guild.memberCount >= ex[1] && !guildOverrides.find(it =>  it[1] === data.guild.id && it[2] === true))) return data;

			if (guildOverrides.find(ex => ex[1] === data.guild.id && ex[2] === false)) return data;
			if (guildOverrides.length > 0 && !guildOverrides.find(ex => ex[0] === "guild" && ex[1] === data.guild.id && ex[2] === true)) return data;

			if (statusOverrides.find(ex => ex[1] === data.status && ex[2] === false)) return data;
			if (statusOverrides.length > 0 && !statusOverrides.find(ex => ex[1] === data.status && ex[2] === true)) return data;
		}
		// @ts-ignore
		return existing ? existing.patch(data) : super.add(data, cache, { id: data.user.id });
	}
}

module.exports = OptimizedPresenceManager;
