const ActionManager = require("discord.js/src/client/actions/ActionsManager");

class NekoActionsManager extends ActionManager {
	/**
	 * @param {import("../../../typings").Neko} client
	 */
	constructor(client) {
		super(client);
		this.register(require("./MessageUpdate"));
		this.register(require("./MessageReactionAdd"));
	}
}

module.exports = NekoActionsManager;
