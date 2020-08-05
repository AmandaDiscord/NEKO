# NEKO
NEKO is an add-on for Discord.js which offers misc tunings for performance gains.

# Why NEKO?
Discord.js trades efficiency for ease of use which isn't bad but Discord.js has the capability of becoming competitive with Eris in terms of scalability which currently isn't widely available and requires edits of Discord.js' source by someone who knows what they're doing.

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
	};
}
```
Please use VSCode's intellisense or other intellisense alternatives to determine how to use the PresenceException. Or look at the typings located at /typings/index.d.ts


# Recommendations
As NEKO is about performance, most of the features of this add-on are not added without reason. Each one will be explained in detail here.

## Presences (The only thing added currently)
Presences include things such as client statuses which would be what client an account is on whether it be mobile, desktop or browser. They also include Activities which is details about what an account is doing such as playing a game or listening to something. This data takes up a lot of memory and could easily make the stack size considerably larger of what it could be if they were just disabled.

https://amanda.moe/to/stats
This link leads you to a stats graph for Amanda#8293 (A music bot). If you zoom into the Ram used graph at November 3rd, 2019, you will see that memory spiked to 608MB and then memory usage smooths out to be considerably < that. This was due to implementing a patch to disable adding Presences to a Guild's presence cache which dramatically reduced memory usage. Prior, memory would always start low then over a few days, spike up to >600MB. Amanda was hosted on a small memory size VM at the time and would often cause the process to run out of memory which explains the dips and rises in the memory graph prior to said date.

https://github.com/AmandaDiscord/discord.js/commit/84b6b6ca039920b7866cba1dbffe422f022b1560
This is a link to the commit of a modified fork of Discord.js which is a few days before the memory issues calmed down which has relative code of Discord.js v12 modifications prior to the Manager PR. There are no commits after the commit's date and before Nov 6th, 2019 (when memory issues were fixed) which have actual code base changes.

## Users in general
Users can take up a considerable amount of memory. We obviously do not limit the amount of users which can be cached at one point since that would break a lot of functionality but as a word of advice, if you do not ABSOLUTELY need the priviledged intents of Discord, do not use them. Working around not having most users cached until they send a message or are mentioned or somehow end up in cache will be a slight pain but things are not so bad. It's a small price to pay for ~~salvation~~ not blowing the entire allocated memory space.

## Messages
This is one of those things where I have heard a lot of people say that they take up quite a bit of space in memory but I have never actually witnessed the affects of before and after. For now, I'll say that if you do not do anything with the channel's message history, you should set the channels max message size to 0. This comes with it's own problems, however. You will not be able to react to uncached messages (I believe) and you will not be able to receive the messageUpdate, messageReactionAdd or the messageReactionRemove Client events unless a message which gets edited/reacted to is somehow already in the cache prior to the event.


# Conclusion
That's about it. These are all of the optimization tips I can currently offer. If you have any personal optimization tips, feel free to hit me up on Discord (PapiOphidian#0110) and I'll try my best to implement them here into a format which is extensible and intuitive.

Need support for this add-on? Join my Guild and ask! https://amanda.moe/to/server
Or hit me up on Discord. Either works but I'd prefer if you joined my Guild :)
