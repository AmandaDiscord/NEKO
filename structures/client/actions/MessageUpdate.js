'use strict';

const path = require("path");
const djsDir = path.dirname(require.resolve("discord.js"));
const Discord = require("discord.js");

/** @type {typeof import("discord.js/src/client/actions/Action")} */
const Action = require(`${djsDir}/client/actions/Action`);

class MessageUpdateAction extends Action {
	/**
	 * @param {import("../../../typings").DiscordMessageData} data
	 */
	handle(data) {
		/** @type {import("../../../typings").Neko} */
		this.client;
		let message;
		if (data && data.id && data.channel_id && data.content && data.author) {
			const channel = this.client.channels.cache.get(data.channel_id);
			// ensure channel is a message channel, and ensure member exists if is a guild channel
			if (channel instanceof Discord.DMChannel || (channel instanceof Discord.TextChannel && data.member)) {
				// @ts-ignore
				message = new Discord.Message(this.client, data, channel);
			}
		}
		return message || data;
	}
}

module.exports = MessageUpdateAction;
