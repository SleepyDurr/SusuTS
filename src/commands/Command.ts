import SleepyClient from "../index";
import {Message} from "discord.js";
import {CommandOptions} from "../structures/Interface";

export default class Command {
    public client: SleepyClient;
    private readonly name: string;
    private readonly description: string;
    private readonly usages: string | string[];
    private readonly aliases: string | string[] | null;
    private readonly examples: string | string[];
    private readonly params: string[] | null;
    private readonly ownerOnly: boolean;
    private readonly botOwnerOnly: boolean;
    private readonly disabled: boolean;
    private readonly guildOnly: boolean;
    private readonly nsfw: boolean;
    private readonly clientPermissions: string[] | null;
    private readonly userPermissions: string[] | null;
    private readonly additionalInfo: string;
    private readonly category: string;
    private readonly keepCommand: boolean;

    constructor(client: SleepyClient, options: CommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.usages = options.usages || options.name;
        this.aliases = options.aliases || null;
        this.examples = options.examples || options.name;
        this.params = options.params || null;
        this.ownerOnly = options.ownerOnly;
        this.botOwnerOnly = options.botOwnerOnly;
        this.disabled = options.disabled;
        this.guildOnly = options.guildOnly;
        this.nsfw = options.nsfw;
        this.clientPermissions = options.clientPermissions || null;
        this.userPermissions = options.userPermissions || null;
        this.additionalInfo = options.additionalInfo || '';
        this.category = options.category;
        this.keepCommand = options.keepCommand || false;
    }

    public run(message?: Message, args?: string[]) {
        console.log(this.client.chalk.bgRed(`The ${this.name} command has no run() method.`));
    }
}
