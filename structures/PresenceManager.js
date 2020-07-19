const Discord = require("discord.js");
const Presence = require("./Presence")

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
		/**
		 * @type {Discord.Collection<string, import("../typings").OptimizedPresence>}
		 */
		this.cache;
	}
	/**
	 * @param {{ user: { id: string }, guild: import("../typings").OptimizedGuild, status: import("../typings").StatusType }} data
	 * @param {boolean} [cache]
	 * @returns {any}
	 */
	add(data, cache) {
		if (!this.client.optimizations) return data;
		if (this.client.optimizations.presencesDisabled) return data;
		const existing = this.cache.get(data.user.id);
		const overrides = this.client.optimizations.presenceOverrides;
		const bot = this.client.users.cache.get(data.user.id) ? this.client.users.cache.get(data.user.id).bot : false;

		if (overrides.length > 0) {
			/** @type {Array<import("../typings").UserPresenceException>} */
			// @ts-ignore
			const userOverrides = overrides.filter(ex => ex[0] === "user");
			const allowedUsersLength = userOverrides.filter(ex => ex[2] === true).length;
			/** @type {Array<import("../typings").GuildPresenceException>} */
			// @ts-ignore
			const guildOverrides = overrides.filter(ex => ex[0] === "guild");
			const allowedGuildsLength = guildOverrides.filter(ex => ex[2] === true).length;
			/** @type {Array<import("../typings").StatusPresenceException>} */
			// @ts-ignore
			const statusOverrides = overrides.filter(ex => ex[0] === "status");
			const allowedStatusesLength = statusOverrides.filter(ex => ex[2] === true).length;

			if (userOverrides.find(ex => ex[1] === data.user.id && ex[2] === false)) return data;
			if (allowedUsersLength > 0 && !userOverrides.find(ex => ex[1] === data.user.id && ex[2] === true)) return data;

			if (bot && overrides.find(ex => ex[0] === "bot" && ex[1] === false && !userOverrides.find(it => it[1] === data.user.id && it[2] === true))) return data;

			if (overrides.find(ex => ex[0] === "memberCount" && data.guild.memberCount >= ex[1] && !guildOverrides.find(it =>  it[1] === data.guild.id && it[2] === true))) return data;

			if (guildOverrides.find(ex => ex[1] === data.guild.id && ex[2] === false)) return data;
			if (allowedGuildsLength > 0 && !guildOverrides.find(ex => ex[1] === data.guild.id && ex[2] === true)) return data;

			if (statusOverrides.find(ex => ex[1] === data.status && ex[2] === false)) return data;
			if (allowedStatusesLength > 0 && !statusOverrides.find(ex => ex[1] === data.status && ex[2] === true)) return data;
		}
		return existing
					 ? existing.patch(data)
					 : (this.client.optimizations && this.client.optimizations.globalPresences && this.client.presences)
					 ? this.client.presences.set(data.user.id, new Presence(this.client, data)).get(data.user.id)
					 // @ts-ignore
					 : super.add(data, cache, { id: data.user.id });
	}
}

module.exports = OptimizedPresenceManager;
