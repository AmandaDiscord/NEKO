const Discord = require("discord.js");
const ActionManager = require("./actions/ActionsManager");

// @ts-ignore
class Neko extends Discord.Client {
	/**
	 * @param {import("../../typings").NekoOptions} [options]
	 */
	constructor(options) {
		if (options && options.optimizations && options.optimizations.disableMessageCaching) options.messageCacheMaxSize = 0;
		super(options);

		// @ts-ignore
		if (options && options.optimizations && options.optimizations.disableMessageCaching) this.actions = new ActionManager(this);

		this.optimizations = {
			presencesDisabled: false,
			richPresencesDisabled: false,
			globalPresences: false,
			/** @type {Array<import("../../typings").PresenceException>} */
			presenceOverrides: [],
			messageCachingDisabled: false
		};

		/** @type {Discord.Collection<string, import("../../typings").OptimizedPresence>} */
		this.presences = new Discord.Collection();

		if (options && typeof options === "object") {
			if (options.optimizations && typeof options.optimizations === "object") {
				if (options.optimizations.disablePresences && typeof options.optimizations.disablePresences === "boolean") this.optimizations.presencesDisabled = true;
				if (options.optimizations.presenceOverrides && typeof options.optimizations.presenceOverrides === "object") this.optimizations.presenceOverrides = options.optimizations.presenceOverrides;
				if (options.optimizations.disableRichPresences && typeof options.optimizations.disableRichPresences === "boolean") this.optimizations.richPresencesDisabled = options.optimizations.disableRichPresences;
				if (options.optimizations.globalPresences && typeof options.optimizations.globalPresences === "boolean") this.optimizations.globalPresences = options.optimizations.globalPresences;
				if (options.optimizations.disableMessageCaching && typeof options.optimizations.disableMessageCaching === "boolean") this.optimizations.messageCachingDisabled = options.optimizations.disableMessageCaching;
			}
		}
	}
}

module.exports = Neko;
