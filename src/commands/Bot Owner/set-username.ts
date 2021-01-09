import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class SetUsernameCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'set-username',
            description: 'Sets the client users username',
            usages: ['set-username <username>'],
            examples: ['set-username Susu'],
            params: ['<username> - The username to set to'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No Username Provided', null,
            `You need to specify a username to change to.
            Example: \`${this.client.functions.getPrefix(message)}set-username Susu\``, null, null, null, null, null, 15000);

        try {
            await this.client.user.setUsername(args.join(' '));
            return this.client.functions.sendEmbed(message, null, null, 'Username Set', null,
                `The clients username has been set to \`${args.join(' ')}\``, null, null, null, null, null, 15000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Setting Username Error', null, err.message);
        }
    }
}