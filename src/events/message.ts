import SleepyClient from "../index";
import {Message, TextChannel} from "discord.js";
import {Data} from '../structures/Interface';

export = async (client: SleepyClient, message: Message) => {
    if (message.author.bot) return;

    const server = client.db.get(`guild.${message.guild?.id || message.channel.id}`);
    if (!server) client.db.set(`guild.${message.guild?.id || message.channel.id}`, {'prefix':client.config['SLEEPY_PREFIX'],'disabledCommands':[],'disabledChannels':[]});
    const prefix = server?.prefix || client.config['SLEEPY_PREFIX'];

    if (!message.content.startsWith(prefix)) return;

    const args: string[] = message.content.slice(prefix.length).split(/ +/g);
    const cmd: string = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.aliases.get(cmd);

    if (!command) return;
    if (message.guild && !command.keepCommand) await message.delete();

    if (server?.disabledChannels.includes(message.channel.id)) return;
    if (command.disabled) return client.functions.sendError(message, 'GLOBAL_COMMAND_DISABLED', {cmdName:command.name} as Data, 'channel');
    if (server?.disabledCommands.includes(command.name)) return client.functions.sendError(message, 'COMMAND_DISABLED', {cmdName:command.name} as Data, 'channel');
    if (!message.guild && command.guildOnly) return client.functions.sendError(message, 'GUILD_ONLY_COMMAND', {cmdName:command.name} as Data, 'channel');
    if (command.ownerOnly && !client.config['OWNER_IDs']?.split(',').includes(message.author.id) && message.author.id !== message.guild.ownerID) return client.functions.sendError(message, 'OWNER_ONLY_COMMAND', {cmdName:command.name} as Data, 'channel');
    if (command.botOwnerOnly && message.author.id !== client.config['MASTER_ID']) return client.functions.sendError(message, 'BOT_OWNER_ONLY_COMMAND', {cmdName:command.name} as Data, 'channel');
    if (command.nsfw && !(<TextChannel>message.channel).nsfw) return client.functions.sendError(message, 'NSFW_COMMAND', {cmdName:command.name} as Data, 'channel');

    const permission: boolean = await client.functions.checkPermissions(message, command);

    if (permission) {
        await client.functions.sendError(null, 'COMMAND_EXECUTED', {cmdName:command.name,authorID:message.author.id,channelID:message.channel.id,guild:message.guild} as Data);
        await client.functions.logExecutedCommands(message, 'Command Executed',
            `Member: ${message.author.tag} [${message.author.id}]
            Guild: ${message.guild?.name || 'DM Channel'} [${message.guild?.id || message.channel.id}]
            Command: ${command.name}`, message.author.displayAvatarURL({dynamic: true, size: 512}));
        command.run(message, args);
    }
}