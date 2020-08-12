import Discord = require("discord.js");

export interface NekoOptions extends Discord.ClientOptions {
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

export interface DiscordMessageData {
	type: number;
	tts: boolean;
	timestamp: string;
	pinned: boolean;
	mentions: Array<string>;
	mention_roles?: Array<string>;
	member?: {
		roles: Array<string>;
		premium_since?: string;
		nick?: string;
		mute: boolean;
		joined_at: string;
		hoisted_role?: string;
		deaf: boolean;
	};
	id: string;
	flags: number;
	embeds: Array<any>;
	edited_timestamp: string;
	content?: string;
	channel_id: string;
	author: {
		username: string;
		public_flags: number;
		id: string;
		discriminator: string;
		avatar: string;
	};
	attachments: Array<any>;
	guild_id?: string;
}

export interface DiscordReactionData {
	user_id: string;
	message_id: string;
	emoji: {
		name: string;
		id?: string;
	};
	channel_id: string;
}

export interface NekoEvents extends Discord.ClientEvents {
	messageUpdate: [Discord.Message | DiscordMessageData];
	messageReactionAdd: [DiscordReactionData, Discord.Channel, OptimizedUser];
	messageReactionRemove: [DiscordReactionData, Discord.Channel, OptimizedUser];
}

export type PresenceException = UserPresenceException | GuildPresenceException | StatusPresenceException | GuildMemberCountPresenceException | BotPresenceException;
/**
 * Configure which Users are allowed or not allowed to have Presences.
 */
export type UserPresenceException = ["user", Discord.Snowflake, boolean];
/**
 * Configure which Guilds are allowed or not allowed to have Presences.
 */
export type GuildPresenceException = ["guild", Discord.Snowflake, boolean];
/**
 * Configure what status types dictate which accounts are allowed or not allowed to have presences.
 */
export type StatusPresenceException = ["status", StatusType, boolean];
/**
 * Configure how many Members can be in a Guild before presences for that Guild are disabled. This does not override GuildPresenceException.
 */
export type GuildMemberCountPresenceException = ["memberCount", number];
/**
 * Configure whether Bot accounts are allowed to have Presences or not.
 */
export type BotPresenceException = ["bot", boolean];

export type StatusType = "streaming" | "online" | "idle" | "dnd" | "invisible";

// Actual affected classes
export class Neko extends Discord.Client {
	constructor(options?: NekoOptions);

	private actions: import("../structures/client/actions/ActionsManager") | import("discord.js/src/client/actions/ActionsManager")

	public optimizations: {
		presencesDisabled: boolean;
		richPresencesDisabled: boolean;
		globalPresences: boolean;
		presenceOverrides: Array<PresenceException>;
		/**
		 * Updating the value of this property will have no effect.
		 */
		messageCachingDisabled: boolean;
	};

	presences: Discord.Collection<string, OptimizedPresence>;

	public on<K extends keyof NekoEvents>(event: K, listener: (...args: NekoEvents[K]) => void): this;
	public on<K extends keyof Discord.ClientEvents>(event: K, listener: (...args: Discord.ClientEvents[K]) => void): this;

	public once<K extends keyof NekoEvents>(event: K, listener: (...args: NekoEvents[K]) => void): this;
	public once<K extends keyof Discord.ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

	public emit<K extends keyof NekoEvents>(event: K, ...args: NekoEvents[K]): boolean;
	public emit<K extends keyof Discord.ClientEvents>(event: K, ...args: Discord.ClientEvents[K]): boolean;
}
export class OptimizedPresenceManager extends Discord.PresenceManager {
	constructor(client: Neko, iterable?: Iterable<any>);

	public client: Neko;
	public cache: Discord.Collection<string, OptimizedPresence>;

	public add(data: any, cache?: boolean): any;
}
export class OptimizedGuild extends Discord.Guild {
	constructor(client: Neko, data: any);

	public presences: OptimizedPresenceManager;
}

export class OptimizedPresence extends Discord.Presence {
	constructor(client: Neko, data: any);

	public client: Neko;

	public patch(data): this;
}

export class OptimizedActivity extends Discord.Activity {
	constructor(presence: OptimizedPresence, data: any);

	public presence: OptimizedPresence;
	public syncID: string;
}

export class OptimizedUser {
	constructor(client: Neko, data: any);

	public client: Neko;

	public presence: OptimizedPresence;
}
