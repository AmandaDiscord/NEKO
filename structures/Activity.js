const Discord = require("discord.js");

class OptimizedActivity extends Discord.Activity {
	/**
	 * @param {import("../typings").OptimizedPresence} presence
	 * @param {any} data
	 */
	constructor(presence, data) {
		super(presence, data);
		/**
		 * @type {import("../typings").OptimizedPresence}
		 */
		this.presence;

		if (this.presence.client.optimizations && this.presence.client.optimizations.richPresencesDisabled) {
			delete this.assets;
			delete this.party;
			delete this.state;
		}
	}
}

module.exports = OptimizedActivity
