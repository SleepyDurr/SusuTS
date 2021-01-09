import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class UnbanCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'unban',
            description: 'Unbans a user from the guild',
            usages: ['unban <ID>'],
            examples: ['unban 249997303916527616'],
            params: ['<ID> - ID of the user'],
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No ID provided', null,
            `Please provide the ID of the user you want to unban.
            Example: \`${this.client.functions.getPrefix(message)}unban 249997303916527616\``);

        const bans = await message.guild.fetchBans();
        if (!bans.has(args[0])) return this.client.functions.sendEmbed(message, null, null, 'Not Banned', null,
            `The user with the ID \`${args[0]}\` is not banned.`, null, null, null, null, null, 15000);

        try {
            const user = bans.get(args[0]).user;
            const reason = bans.get(args[0]).reason;
            await message.guild.members.unban(user.id);
            await this.client.functions.sendEmbed(message, null, null, 'Member Unbanned', null,
                `Successfully unbanned ${user.tag} [${user.id}]`, null, null, null, null, null, 30000);

            const modlog = this.client.functions.getModLogChannel(message);
            if (modlog) return this.client.functions.sendToChannel(modlog, 'Member Unbanned',
                `Member: ${user.tag} [${user.id}]
                Action: Unban
                Reason for ban: ${reason ? reason : 'No reason provided'}
                Moderator: ${message.author.tag}`);
        } catch (err) {

        }
    }
}