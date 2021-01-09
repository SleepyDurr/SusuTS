import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class ModLogCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'modlog',
            description: 'Sets the channel for the moderation actions to log to',
            usages: ['modlog <channel>', 'modlog disable'],
            examples: ['modlog #staff-logs', 'modlog 794769397704032286'],
            params: ['<channel> - Name or ID of the channel'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        const modlog = this.client.functions.getModLogChannel(message);

        if (!modlog && !args[0]) return this.client.functions.sendEmbed(message, null, null, 'No modlog channel', null,
            `There is no modlog channel for this server yet.
            Set the channel with \`${this.client.functions.getPrefix(message)}modlog <channel>\``, null, null, null, null, null,
            15000);

        if (!modlog && args[0] === "enable") {
            try {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                || message.guild.channels.cache.find(c => c.name === args[0]);

                if (!channel) return this.client.functions.sendEmbed(message, null, null, 'Invalid Channel', null,
                    'The channel provided could not be found on the server.', null, null, null, null, null,
                    15000);

                if (channel.type !== 'text') return this.client.functions.sendEmbed(message, null, null, 'Invalid channel type', null,
                    'The channel provided must be a text channel.', null, null, null, null, null,
                    15000);

                this.client.db.set(`guild.${message.guild.id}.modLogChannel`, channel.id);

                return this.client.functions.sendEmbed(message, null, null, `Moderation actions will now log to \`${channel.name}\``, null,
                    null, null, null, null, null, null, 15000);
            } catch (err) {
                return this.client.functions.sendEmbed(message, null, null, 'Mod Log Error', null, err.message);
            }
        }

        if (args[0] === 'disable') {
            this.client.db.set(`guild.${message.guild.id}.modLogChannel`, '');
            return this.client.functions.sendEmbed(message, null, null, 'Modlog Disabled', null,
                `Moderation actions are no longer being logged.
                You can enable it again with \`${this.client.functions.getPrefix(message)}modlog <channel>\``, null, null, null, null,
                null, 15000);
        }

        return this.client.functions.sendEmbed(message, null, null, 'Modlog Channel', null,
            `Moderation actions are currently being logged to \`${this.client.functions.getModLogChannel(message).name}\``, null, null,
            null, null, null, 15000);
    }
}