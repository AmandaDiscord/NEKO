const path = require("path");
const djsDir = path.dirname(require.resolve("discord.js"));
/** @type {typeof import("discord.js/src/client/actions/ActionsManager")} */
const ActionManager = require(`${djsDir}/client/actions/ActionsManager`);

class NekoActionsManager extends ActionManager {
	/**
	 * @param {import("../../../typings").Neko} client
	 */
	constructor(client) {
		super(client);
		this.register(require("./MessageUpdate"));
		this.register(require("./MessageReactionAdd"));
		this.register(require("./MessageReactionRemove"));
	}
}

module.exports = NekoActionsManager;
