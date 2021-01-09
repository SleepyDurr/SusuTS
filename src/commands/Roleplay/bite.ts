import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";

const cmdName = 'bite';
export = class BiteCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: cmdName,
            description: 'Bites someone',
            aliases: 'nom',
            usages: [`${cmdName} <user>`],
            examples: [`${cmdName} @user#1234`, `${cmdName} 249997303916527616`],
            params: ['<user> - Mention, ID, username/nickname, or any text.'],
            guildOnly: true,
            category: 'Roleplay'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.interactionCheckMentions(message, args);
        if (member) return this.client.functions.getImage(message, `**${message.member.displayName}** noms on ${member} softly <a:nom:773949323624841246>`, 'nom', true, 'image');
    }
}