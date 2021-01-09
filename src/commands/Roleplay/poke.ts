import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";

const cmdName = 'poke';
export = class PokeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: cmdName,
            description: 'Pokes someone',
            usages: [`${cmdName} <user>`],
            examples: [`${cmdName} @user#1234`, `${cmdName} 249997303916527616`],
            params: ['<user> - Mention, ID, username/nickname, or any text.'],
            guildOnly: true,
            category: 'Roleplay'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.interactionCheckMentions(message, args);
        if (member) return this.client.functions.getImage(message, `**${message.member.displayName}** poked ${member} <a:nkoHehe:586124196988583954>`, 'poke', true, 'image');
    }
}