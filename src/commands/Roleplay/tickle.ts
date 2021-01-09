import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";

const cmdName = 'tickle';
export = class TickleCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: cmdName,
            description: 'Tickles someone',
            usages: [`${cmdName} <user>`],
            examples: [`${cmdName} @user#1234`, `${cmdName} 249997303916527616`],
            params: ['<user> - Mention, ID, username/nickname, or any text.'],
            guildOnly: true,
            category: 'Roleplay'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.interactionCheckMentions(message, args);
        if (member) return this.client.functions.getImage(message, `**${message.member.displayName}** tickled ${member} <:evil:773951772585885745>`, 'tickle', true, 'image');
    }
}