import Command from '../Command';
import SleepyClient from "../../index";
import {GuildChannel, Message} from 'discord.js';

export = class EnableChannelCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'enable-channel',
            description: 'Enables a channel that was previously disabled so that commands can be executed',
            aliases: ['ech', 'enablechannel'],
            usages: ['enable-channel <channel>'],
            examples: ['enable-channel general'],
            params: ['<channel> - Name, mention, or ID of the channel'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No channel provided', null,
            'You need to specify the channel to enable.', null, null, null, null, null, 15000);

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find((c: GuildChannel) => c.name === args[0]);

        if (!channel) return this.client.functions.sendEmbed(message, null, null, 'Channel not found', null,
            'The specified channel could not be found.', null, null, null, null, null, 15000);

        try {
            const server = this.client.db.get(`guild.${message.guild.id}`);

            if (!server.disabledChannels.includes(channel.id)) return this.client.functions.sendEmbed(message, null, null, 'Failed to enable channel',
                null, `**${channel.name}** is not disabled.`, null, null, null, null, null, 15000);

            let arrayIndex = server.disabledChannels.indexOf(channel.id);
            server.disabledChannels.splice(arrayIndex, 1);
            this.client.db.set(`guild.${message.guild.id}.disabledChannels`, server.disabledChannels);

            return this.client.functions.sendEmbed(message, null, null, 'Successfully enabled channel', null,
                `Channel enabled: **${channel.name}**
                Current disabled channels: ${server.disabledChannels.map((c: GuildChannel) => `<#${c}>`).join(', ') || 'No disabled channels'}`, null,
                null, null, null, null, 30000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Failed to enable channel', null, err.message);
        }
    }
}