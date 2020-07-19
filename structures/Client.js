const Discord = require("discord.js");

class Neko extends Discord.Client {
	/**
	 * @param {import("../typings").NekoOptions} [options]
	 */
	constructor(options) {
		super(options);

		this.optimizations = {
			presencesDisabled: false,
			richPresencesDisabled: false,
			globalPresences: false,
			/** @type {Array<import("../typings").PresenceException>} */
			presenceOverrides: []
		};

		/** @type {Discord.Collection<string, import("../typings").OptimizedPresence>} */
		this.presences = new Discord.Collection();

		if (options && typeof options === "object") {
			if (options.optimizations && typeof options.optimizations === "object") {
				if (options.optimizations.disablePresences && typeof options.optimizations.disablePresences === "boolean") this.optimizations.presencesDisabled = true;
				if (options.optimizations.presenceOverrides && typeof options.optimizations.presenceOverrides === "object") this.optimizations.presenceOverrides = options.optimizations.presenceOverrides;
				if (options.optimizations.disableRichPresences && typeof options.optimizations.disableRichPresences === "boolean") this.optimizations.richPresencesDisabled = options.optimizations.disableRichPresences;
				if (options.optimizations.globalPresences && typeof options.optimizations.globalPresences === "boolean") this.optimizations.globalPresences = options.optimizations.globalPresences;
			}
		}
	}
}

module.exports = Neko;
