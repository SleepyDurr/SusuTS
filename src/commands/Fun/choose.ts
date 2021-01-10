import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class ChooseCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'choose',
            description: 'Chooses between a list of options',
            usages: ['choose <options {split with | }>'],
            examples: ['choose Go to bed|play games|watch movies'],
            params: ['<options> - A list of options split with \`|\`'],
            category: 'Fun'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Options Provided', null,
            `Please provide a list of options for me to choose from.
            Example: \`${this.client.functions.getPrefix(message)}choose Go to bed|play games|watch movies\``, null, null, null, null,
            null, 15000);

        const options = args.join(' ').split('|');
        return this.client.functions.sendEmbed(message, null, null, null, null,
            `I choose: **${options[Math.floor(Math.random() * options.length)]}**`, null, null, null, null, null, 120000);
    }
}