import Discord = require("discord.js");

export interface NekoOptions extends Discord.ClientOptions {
	optimizations?: {
		/**
		 * Configure whether or not all presences are disabled. This global option overrides NekoOptions#presencesOverrides
		 */
		disablePresences?: boolean;
		/**
		 * Configure whether Activities should contain RichPresence data.
		 */
		disableRichPresences?: boolean;
		/**
		 * Configure whether Guild Presence caches should be empty in favor of a global Presence cache on the Client
		 */
		globalPresences?: boolean;
		presenceOverrides?: Array<PresenceException>;
	};
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

	public optimizations: {
		presencesDisabled: boolean;
		richPresencesDisabled: boolean;
		globalPresences: boolean;
		presenceOverrides: Array<PresenceException>;
	};

	presences: Discord.Collection<string, OptimizedPresence>;
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
}
