import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class HackBanCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'hack-ban',
            description: 'Bans a user even if they aren\'t in the guild',
            aliases: ['hackban'],
            usages: ['hack-ban <ID> [reason]'],
            examples: ['hack-ban 474807795183648809'],
            params: ['<ID> - ID of the user', '[reason] - Reason for banning the user'],
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No ID provided', null,
                'Please provide the ID of the user you want to ban.', null, null, null, null, null, 15000);

            const reason = args.slice(1).join(' ');

            await message.guild.members.ban(args[0], {reason: reason});

            const caseNumber = await this.client.functions.appendCaseNumber(message.guild.id);
            this.client.db.push(`cases.${message.guild.id}.cases`, {caseNumber:caseNumber + 1, action:'Hack Ban', member_tag:null, member_id:args[0], reason:reason,
                moderator:message.author.tag, date:Date.now()});

            await this.client.functions.sendEmbed(message, null, null, 'Successfully Banned', null,
                `User with ID **${args[0]}** [<@${args[0]}>] was banned.
                Reason: ${reason ? reason : 'No reason provided'}
                Case #: ${caseNumber + 1}`, null, null, null, null, null, null);

            const modlog = this.client.functions.getModLogChannel(message);

            if (modlog) return this.client.functions.sendToChannel(modlog, 'Banned Member',
                `Member: <@${args[0]}> [${args[0]}]
                            Action: Banned (hackban)
                            Reason: ${reason ? reason : 'No reason provided'}
                            Moderator: ${message.author.tag},
                            Case #: ${caseNumber + 1}`);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Hack Ban Error', null, err.message);
        }
    }
}