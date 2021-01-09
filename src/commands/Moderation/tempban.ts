import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import ms from 'ms';
import moment from "moment";

export = class TempBanCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'tempban',
            description: 'Temporarily bans a member',
            usages: ['tempban <member> <duration> [reason]',],
            examples: ['tempban 249997303916527616 1d'],
            params: ['<member> - Mention or ID of the member', '<duration> - Duration of ban (d, h, m, s)', '[reason] - Reason for the ban'],
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Member Provided', null,
            `Please provide a member to tempban.
            Example: \`${this.client.functions.getPrefix(message)}tempban @user#1234 1d harassing members\``, null, null, null, null,
            null, 15000);

        const member = await this.client.functions.moderationCheckMention(message, args[0]);
        if (!member) return this.client.functions.sendEmbed(message, null, null, 'Member Not Found', null,
            'That member could not be found on the server.', null, null, null, null, null, 15000);

        if (!member.bannable || !(await this.client.functions.canModerate(message, member))) return this.client.functions.sendEmbed(message, null, null, 'Unable to Ban', null,
            `I cannot ban ${member.user.tag} [${member.user.id}]
            Reasons it may have failed:
            - You cannot ban the owner of a guild.
            - You cannot ban a member with an equal or higher role`, null, null, null, null, null, 30000);

        const time = args.slice(1, 2).join(' ');
        if (!time) return this.client.functions.sendEmbed(message, null, null, 'No Time Provided', null,
            `Please provide a correct time.
            Example: \`${this.client.functions.getPrefix(message)}tempban @user#1234 1d\``, null, null, null, null, null, 15000);

        const getTime = ms(time);
        if (!getTime) return this.client.functions.sendEmbed(message, null, null, 'Invalid Format', null,
            `Please provide a correct time format (such as \`1d\`).
            Example: \`${this.client.functions.getPrefix(message)}tempban @user#1234 1d\``, null, null, null, null, null, 15000);

        const bantime = Date.now() + getTime;
        const reason = args.slice(2).join(' ');

        await member.ban({reason: reason});

        this.client.db.push(`bans.${message.guild.id}.infractions`, {tag:member.user.tag,member:member.id,guild:message.guild.id,reason:reason,date:Date.now(),moderator:message.author.id,bantime:bantime});

        await this.client.functions.sendEmbed(message, null, null, 'Member Banned', null,
            `Successfully banned ${member.user.tag} [${member.id}] 
            Duration: ${args.slice(1, 2).join(' ')}`);

        const modlog = this.client.functions.getModLogChannel(message);
        if (modlog) await this.client.functions.sendToChannel(modlog, 'Member Banned',
            `Member: ${member.user.tag} [${member.id}]
            Action: Banned
            Ban issued: ${moment.utc(Date.now()).format("dddd, MMMM Do YYYY | HH:mm:ss")}
            Ban ending: ${moment.utc(bantime).format("dddd, MMMM Do YYYY | HH:mm:ss")}
            Reason: ${reason ? reason : 'No reason provided'}
            Moderator: ${message.author.tag}`);
    }
}