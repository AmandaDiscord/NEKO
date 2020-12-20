const Discord = require("discord.js");

const Activity = require("./Activity");

// @ts-ignore
class OptimizedPresence extends Discord.Presence {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {any} data
	 */
	constructor(client, data) {
		// @ts-ignore
		super(client, data)
		/**
		 * @type {import("../typings").Neko}
		 */
		this.client;

		/** @type {import("../typings").OptimizedGuild} */
		this.guild = (this.client.optimizations && !this.client.optimizations.globalPresences) ? data.guild || null : null;
	}
	patch(data) {
		this.status = data.status || this.status || "offline";

		// @ts-ignore
		if (data.activites) this.activities = data.activities.map(activity => new Activity(this, activity));
		// @ts-ignore
		else if (data.activity || data.game) this.activities = [new Activity(this, data.game || data.activity)];
		else this.activities = [];

		this.clientStatus = data.client_status || null;

		return this;
	}
}

module.exports = OptimizedPresence
