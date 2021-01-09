import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import moment from "moment";

export = class CaseCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'case',
            description: 'Gets information about a case',
            usages: ['case <caseNumber>'],
            examples: ['case 46'],
            params: ['<caseNumber> - The case number of the infraction you want to fetch information for'],
            guildOnly: true,
            userPermissions: ['BAN_MEMBERS'],
            category: 'Moderation'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Case Number', null,
            `Please provide a case number.
            Example: \`${this.client.functions.getPrefix(message)}case 46\``, null, null, null, null, null, 15000);

        const caseData = await this.client.functions.fetchCase(message.guild, parseInt(args[0]));
        if (!caseData) return this.client.functions.sendEmbed(message, null, null, 'No Case', null,
            `Couldn't find a case with the case number \`${args[0]}\``, null, null, null, null, null, null);

        return this.client.functions.sendEmbed(message, null, null, `Information for case #: ${args[0]}`, null,
            `Case Number: ${caseData.caseNumber}
            Member: ${caseData.member_tag ? caseData.member_tag : ''} [${caseData.member_id}]
            Action: ${caseData.action}
            Reason: ${caseData.reason ? caseData.reason : 'No reason provided'}
            Moderator: ${caseData.moderator}
            Date: ${moment.utc(caseData.date).format("dddd, MMMM Do YYYY | HH:mm:ss")}
            ${caseData.banDuration ? (caseData.banDuration > Date.now() ? `Expires: ` : 'Expired: ') + moment.utc(caseData.banDuration).format("dddd, MMMM Do YYYY | HH:mm:ss") : ''}`,
            null, null, null, null, null, 120000);
    }
}