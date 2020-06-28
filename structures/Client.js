const Discord = require("discord.js");

class Neko extends Discord.Client {
	/**
	 * @param {import("../typings").NekoOptions} [options]
	 */
	constructor(options) {
		super(options);

		this.optimizations = {
			presencesDisabled: false,
			/** @type {Array<import("../typings").PresenceException>} */
			presenceOverrides: []
		};

		if (options && typeof options === "object") {
			if (options.optimizations && typeof options.optimizations === "object") {
				if (options.optimizations.disablePresences && typeof options.optimizations.disablePresences === "boolean") this.optimizations.presencesDisabled = true;
				if (options.optimizations.presenceOverrides && typeof options.optimizations.presenceOverrides === "object") this.optimizations.presenceOverrides = options.optimizations.presenceOverrides;
			}
		}
	}
}

module.exports = Neko;
