const Discord = require("discord.js");

const Activity = require("./Activity");

class OptimizedPresence extends Discord.Presence {
	/**
	 * @param {import("../typings").Neko} client
	 * @param {any} data
	 */
	constructor(client, data) {
		super(client, data)
		/**
		 * @type {import("../typings").Neko}
		 */
		this.client;

		/** @type {import("../typings").OptimizedGuild} */
		this.guild = (this.client.optimizations && !this.client.optimizations.globalPresences) ? data.guild || null : null;
	}
	get member() {
		if (this.client.optimizations && this.client.optimizations.globalPresences) return null;
		else return super.member
	}
	patch(data) {
		this.status = data.status || this.status || "offline";

		if (data.activites) this.activities = data.activities.map(activity => new Activity(this, activity));
		else if (data.activity || data.game) this.activities = [new Activity(this, data.game || data.activity)];
		else this.activities = [];

		this.clientStatus = data.client_status || null;

		return this;
	}
}

module.exports = OptimizedPresence
