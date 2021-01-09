import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class SetPrefixCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'set-prefix',
            description: 'Changes the prefix for the guild',
            aliases: ['prefix', 'setprefix'],
            usages: ['set-prefix <value>'],
            examples: ['set-prefix +'],
            params: ['<value> - The new prefix you want the bot to use.'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No value provided', null,
            'You need to provide a new prefix', null, null, null, null, null, 15000);

        try {
            const server = this.client.db.get(`guild.${message.guild.id}`);
            this.client.db.set(`guild.${message.guild.id}.prefix`, args[0]);

            return this.client.functions.sendEmbed(message, null, null, 'Prefix Set', null,
                `New prefix: ${args[0]}
                Old prefix: ${server.prefix}`, null, null, null, null, null, 15000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Failed to set the prefix', null, err.message);
        }
    }
}