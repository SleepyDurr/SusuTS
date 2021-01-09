import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";

const cmdName = 'slap';
export = class SlapCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: cmdName,
            description: 'Slaps someone',
            usages: [`${cmdName} <user>`],
            examples: [`${cmdName} @user#1234`, `${cmdName} 249997303916527616`],
            params: ['<user> - Mention, ID, username/nickname, or any text.'],
            guildOnly: true,
            category: 'Roleplay'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.interactionCheckMentions(message, args);
        if (member) return this.client.functions.getImage(message, `**${message.member.displayName}** slapped ${member} <a:reeee:773944047122645012>`, 'slap', true, 'image');
    }
}