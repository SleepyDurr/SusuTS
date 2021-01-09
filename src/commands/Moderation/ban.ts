import Command from '../Command';
import SleepyClient from "../../index";
import {Message, MessageCollector, MessageEmbed, TextChannel} from 'discord.js';

export = class BanCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'ban',
            description: 'Bans a member from the guild',
            usages: ['ban <member> <days> [reason]'],
            examples: ['ban 249997303916527616 7 harassing members'],
            params: ['<member> - Mention or ID of the member', '<days> Last x days to delete messages from (min 0, max 7)', '[reason] - Reason for banning member'],
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Member Provided', null,
            `You need to provide a member to ban.
            Example: \`${this.client.functions.getPrefix(message)}ban @user#1234 7`, null, null, null, null, null, 15000);

        const member = await this.client.functions.moderationCheckMention(message, args[0]);
        if (!member) return this.client.functions.sendEmbed(message, null, null, 'Member Not Found', null,
            `That member could not be found on the server.`, null, null, null, null, null, 15000);

        if (!member.bannable || !(await this.client.functions.canModerate(message, member))) return this.client.functions.sendEmbed(message, null, null,
            'Unable to Ban', null,
            `I cannot ban ${member.user.tag} [${member.user.id}]
            Reasons it may have failed:
            - You cannot ban the owner of a guild.
            - You cannot ban a member with an equal or higher role`, null, null, null, null, null, 30000);

        const days = parseInt(args.slice(1)[0]);
        const reason = args.slice(2).join(' ');
        const reg = new RegExp(/[0-7]/);
        if (!reg.test(`${days}`)) return this.client.functions.sendEmbed(message, null, null, 'Incorrect Days', null,
            `You can only delete messages up to the last 7 days. Please provide a number from 0-7.
            Example: \`${this.client.functions.getPrefix(message)}ban @user#1234 7\``, null, null, null, null, null, 15000);

        const collector = new MessageCollector(<TextChannel>message.channel, m => !m.author.bot);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`Are you sure that you want to ban **${member.user.tag}**?
                type \`yes|y\` or \`no|n\``)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 256}));
        const confirmationMessage = await message.channel.send(embed);

        collector.on('collect', async m => {
            if (m.author.id !== message.author.id) return;
            if (['y', 'yes'].includes(m.content)) {
                try {
                    await member.ban({reason: reason, days: days});
                    await this.client.functions.sendEmbed(message, null, null, 'Member Banned', null,
                        `Successfully banned **${member.user.tag} [${member.user.tag}]**
                        Reason: ${reason ? reason : 'No reason provided'}`,
                        null, member.user.displayAvatarURL({dynamic: true, size: 256}));

                    const modlog = this.client.functions.getModLogChannel(message);

                    if (modlog) await this.client.functions.sendToChannel(modlog, 'Banned Member',
                        `Member: ${member.user.tag} [${member.user.id}]
                            Action: Banned
                            Days: ${days}
                            Reason: ${reason ? reason : 'No reason provided'}
                            Moderator: ${message.author.tag}`, member.user.displayAvatarURL({dynamic: true, size: 512}));
                } catch (err) {
                    return this.client.functions.sendEmbed(message, null, null, 'Ban Error', null, err.message);
                }
            } else if (['n', 'no'].includes(m.content)) {

            }
            m.delete();
            await confirmationMessage.delete();
            return collector.stop();
        });
    }
}