# NEKO
NEKO is an add-on for Discord.js which offers misc tunings for performance gains.

# Why NEKO?
Discord.js trades efficiency for ease of use which isn't bad but Discord.js has the capability of becoming competitive with Eris in terms of scalability which currently isn't widely available and requires edits of Discord.js' source by someone who knows what they're doing.

This module is still a work in progress and currently only provides means of disabling some Discord.js functionality without modifying the data structure too much. This does not exactly tackle the optimization issues completely but provides some form of cache control.

# ESModule/TypeScript Notice
NEKO has ESM/import statement support but discord.js does not properly support ESM when it comes to their Structures class mentioned below.
You can view the relevant issue [here](https://github.com/discordjs/discord.js/issues/4670).

To properly use this module with ESM/import, you must use the require statement to require discord.js. You can still import NEKO like you normally would.

# Using NEKO
NEKO only exports a few classes which are extensions of the Client, Guild, PresenceManager, Presence, User and Activity classes. This is intentional and is done this way to be extensible so that you are not locked into specifically using this add-on only. You will need to pass the OptimizedGuild, OptimizedPresence and OptimizedUser classes to the Discord.Structures extend method. Documentation [here](https://discord.js.org/#/docs/main/stable/class/Structures)

You will also need to change your client's construction definition to be that of the exported class Neko or if you have your own Client modifications, you can freely extend Neko instead of the vanilla Client class and everything *should* continue to function as normal.

To benefit from this add-on, you will need to pass special options to the client constructor. This is the def for the options
```ts
interface NekoOptions extends Discord.ClientOptions {
	optimizations?: {
		/**
		 * Configure whether or not all presences are disabled. This global option overrides NekoOptions#presencesOverrides.
		 */
		disablePresences?: boolean;
		/**
		 * Configure whether Activities should contain RichPresence data.
		 */
		disableRichPresences?: boolean;
		/**
		 * Configure whether Guild Presence caches should be empty in favor of a global Presence cache on the Client,
		 * removing a lot of Presence duplication.
		 */
		globalPresences?: boolean;
		presenceOverrides?: Array<PresenceException>;
		/**
		 * Configure whether channel max message caching should be set to 0 and still allow message related events to be emitted with a possibly different data structure.
		 */
		disableMessageCaching?: boolean;
	};
}
```
Please use VSCode's intellisense or other intellisense alternatives to determine how to use the PresenceException. Or look at the typings located at /typings/index.d.ts


# Recommendations
As NEKO is about performance, most of the features of this add-on are not added without reason. Each one will be explained in detail here.

## Presences (partial optimizations implemented)
Presences include things such as client statuses which would be what client an account is on whether it be mobile, desktop or browser. They also include Activities which is details about what an account is doing such as playing a game or listening to something. This data takes up a lot of memory and could easily make the stack size considerably larger of what it could be if they were just disabled.

https://amanda.moe/to/stats
This link leads you to a stats graph for Amanda#8293 (A music bot). If you zoom into the Ram used graph at November 3rd, 2019, you will see that memory spiked to 608MB and then memory usage smooths out to be considerably < that. This was due to implementing a patch to disable adding Presences to a Guild's presence cache which dramatically reduced memory usage. Prior, memory would always start low then over a few days, spike up to >600MB. Amanda was hosted on a small memory size VM at the time and would often cause the process to run out of memory which explains the dips and rises in the memory graph prior to said date.

https://github.com/AmandaDiscord/discord.js/commit/84b6b6ca039920b7866cba1dbffe422f022b1560
This is a link to the commit of a modified fork of Discord.js which is a few days before the memory issues calmed down which has relative code of Discord.js v12 modifications prior to the Manager PR. There are no commits after the commit's date and before Nov 6th, 2019 (when memory issues were fixed) which have actual code base changes.

## Messages (partial optimizations implemented)
Messages can actially take up quite a bit of memory since Discord.js holds every message in cache by default and stores old instances of Messages in an edits Array. This data is not particularly necessary and you could set the ClientOptions.messageCacheMaxSize to 0 but ClientEvents such as messageUpdate, messageReactionAdd and messageReactionRemove would not emit since they depend on cached messages. Setting the NekoOptions.disableMessageCaching to true will set the messageCacheMaxSize to 0 and will modify the Client's ActionManager to allow for events to be emitted but the data structure will be different. If you would like to create an instanceof Discord.Message from the data emitted by the modified messageUpdate event, this code can be helpful:
```js
if (data && data.id && data.channel_id && data.content && data.author) {
	const channel = client.channels.cache.get(data.channel_id)
	// ensure channel is a message channel, and ensure member exists if is a guild channel
	if (channel instanceof Discord.DMChannel || (channel instanceof Discord.TextChannel && data.member)) {
		const message = new Discord.Message(client, data, channel)
	}
}
```

## Users (partial optimizations implemented relating to Presences)
Users can take up a considerable amount of memory. We obviously do not limit the amount of users which can be cached at one point since that would break a lot of functionality but as a word of advice, if you do not ABSOLUTELY need the priviledged intents of Discord, do not use them. Working around not having most users cached until they send a message or are mentioned or somehow end up in cache will be a slight pain but things are not so bad. It's a small price to pay for ~~salvation~~ not blowing the entire allocated memory space.

# Conclusion
That's about it. These are all of the optimization tips I can currently offer. If you have any personal optimization tips, feel free to hit me up on Discord (PapiOphidian#0110) and I'll try my best to implement them here into a format which is extensible and intuitive.

Need support for this add-on? Join my Guild and ask! https://amanda.moe/to/server
Or hit me up on Discord. Either works but I'd prefer if you joined my Guild :)
