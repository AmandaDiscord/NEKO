'use strict';

const Action = require('discord.js/src/client/actions/Action');
const { Events } = require('discord.js/src/util/Constants');

class MessageReactionAdd extends Action {
	/**
	 * @param {import("../../../typings").DiscordReactionData} data
	 */
  handle(data) {
		/** @type {import("../../../typings").Neko} */
		this.client
    if (!data.emoji) return false;

    const user = this.getUser(data);
    if (!user) return false;

    // Verify channel
    const channel = this.getChannel(data);
    if (!channel || channel.type === 'voice') return false;

    // Verify message
    let reaction
    // @ts-ignore
    const message = this.getMessage(data, channel); // the third param is optional but Discord.js sucks at internal typings.
    if (message) {
      // Verify reaction
      reaction = message.reactions.add({
        emoji: data.emoji,
        count: 0,
        me: user.id === this.client.user.id,
      });
      reaction._add(user);
    }

    // @ts-ignore
    this.client.emit(Events.MESSAGE_REACTION_ADD, data, channel, user); // Discord.js sucks at internal typings.
    return { message, reaction, user };
  }
}

module.exports = MessageReactionAdd;
