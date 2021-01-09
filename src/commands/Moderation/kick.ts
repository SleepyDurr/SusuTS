import Command from '../Command';
import SleepyClient from "../../index";
import {Message, TextChannel, MessageCollector, MessageEmbed} from 'discord.js';

export = class KickCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'kick',
            description: 'Kicks a member from the guild',
            usages: ['kick <member> [reason]'],
            examples: ['kick 249997303916527616 harassing members'],
            params: ['<member> - Mention or ID of the member', '[reason] - Reason for kicking member'],
            guildOnly: true,
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Member Provided', null,
            `Please provide a member to kick.
            Example: \`${this.client.functions.getPrefix(message)}kick @user#1234 harassing members\``, null, null, null, null, null,
            15000);

        const member = await this.client.functions.moderationCheckMention(message, args[0]);
        if (!member) return this.client.functions.sendEmbed(message, null, null, 'Member Not Found', null,
            'That member could not be found on the server.', null, null, null, null, null, 15000);

        if (!member.kickable || !(await this.client.functions.canModerate(message, member))) return this.client.functions.sendEmbed(message, null, null,
            'Unable to Kick', null,
            `I cannot kick ${member.user.tag} [${member.user.id}]
            Reasons it may have failed:
            - You cannot kick the owner of a guild.
            - You cannot kick a member with an equal or higher role`, null, null, null, null, null, 30000);

        const reason = args.slice(1).join(' ');

        let collector = new MessageCollector(<TextChannel>message.channel, (m: Message) => !m.author.bot);

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`Are you sure that you want to kick **${member.user.tag}**?
            type \`yes|y\` or \`no|n\``)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 256}));
        const confirmationMessage = await message.channel.send(embed);

        collector.on('collect', async m => {
            if (m.author.id !== message.author.id) return;
            if (['y', 'yes'].includes(m.content)) {
                try {
                    await member.kick(reason);

                    const caseNumber = await this.client.functions.appendCaseNumber(message.guild.id);
                    this.client.db.push(`cases.${message.guild.id}.cases`, {caseNumber:caseNumber + 1, action:'Kick', member_tag:member.user.tag, member_id:member.id, reason:reason,
                        moderator:message.author.tag, date:Date.now()});

                    await this.client.functions.sendEmbed(message, null, null, 'Member Kicked', null,
                        `Successfully kicked **${member.user.tag} [${member.user.id}]**
                            Reason: ${reason ? reason : 'No reason provided'}
                            Case #: ${caseNumber + 1}`, null,
                        member.user.displayAvatarURL({dynamic: true, size: 256}), null, null, null, null);

                    const modlog = this.client.functions.getModLogChannel(message);

                    if (modlog) await this.client.functions.sendToChannel(modlog, 'Kicked Member',
                        `Member: ${member.user.tag} [${member.user.id}]
                            Action: Kicked
                            Reason: ${reason ? reason : 'No reason provided'}
                            Moderator: ${message.author.tag}
                            Case #: ${caseNumber + 1}`, member.user.displayAvatarURL({dynamic: true, size: 512}));
                } catch (err) {
                    return this.client.functions.sendEmbed(message, null, null, 'Kick Error', null, err.message);
                }
            } else if (['n', 'no'].includes(m.content)) {

            }
            m.delete();
            await confirmationMessage.delete();
            return collector.stop();
        });
    }
}