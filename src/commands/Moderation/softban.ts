import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class SoftBanCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'softban',
            description: 'Bans a user, deletes messages from the last x days, and then unbans',
            usages: ['softban <member> <days> [reason]'],
            examples: ['softban 249997303916527616 7 abusing members'],
            params: ['<member> - Mention or ID of the user', '<days> - Last x days to delete messages from', '[reason] - reason for softbanning the member'],
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Member Provided', null,
            `Please provide a member to softban.
            Example: \`${this.client.functions.getPrefix(message)}softban @user#1234 6\``, null, null, null, null, null, 15000);

        const member = await this.client.functions.moderationCheckMention(message, args[0]);

        if (!member) return this.client.functions.sendEmbed(message, null, null, 'Member Not Found', null,
            'That member could not be found on the server.', null, null, null, null, null, 15000);

        if (!member.bannable || !(await this.client.functions.canModerate(message, member))) return this.client.functions.sendEmbed(message, null, null, 'Unable to Ban', null,
            `I cannot softban ${member.user.tag} [${member.user.id}]
            Reasons it may have failed:
            - You cannot ban the owner of a guild.
            - You cannot ban a member with an equal or higher role`, null, null, null, null, null, 30000);

        const days = parseInt(args.slice(1)[0]);
        const reason = args.slice(2).join(' ');

        const reg = new RegExp(/[0-7]/);
        if (!reg.test(`${days}`)) return this.client.functions.sendEmbed(message, null, null, 'Incorrect Days', null,
            `You can only delete messages up to the last 7 days. Please provide a number from 0-7.
            Example: \`${this.client.functions.getPrefix(message)}softban @user#1234 6\``, null, null, null, null, null, 15000);

        await member.ban({reason: reason, days: days});
        await message.guild.members.unban(member);

        const modlog = this.client.functions.getModLogChannel(message);

        if (modlog) await this.client.functions.sendToChannel(modlog, 'Softbanned Member',
            `Member: ${member.user.tag} [${member.id}]
            Days: ${days}
            Reason: ${reason ? reason : 'No reason provided'}
            Moderator: ${message.author.tag}`, member.user.displayAvatarURL({dynamic: true, size: 512}));
        return this.client.functions.sendEmbed(message, null, null, 'Softbanned Member', null,
            `Successfully softbanned \`${member.user.tag} [${member.user.id}]\`
            Reason: ${reason ? reason : 'No reason provided'}`, null, member.user.displayAvatarURL({dynamic: true, size: 512}), null, null,
            null, 15000);
    }
}