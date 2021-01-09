import Command from '../Command';
import SleepyClient from "../../index";
import {GuildChannel, Message} from 'discord.js';

export = class DisableChannelCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'disable-channel',
            description: 'Disables a channel so that commands cannot be executed in it',
            aliases: ['dch', 'disablechannel'],
            usages: 'disable-channel <channel>',
            examples: ['disable-channel general'],
            params: ['<channel> - Name, mention, or ID of the channel'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No channel provided', null,
            'You need to specify a channel to disable', null, null, null, null, null, 15000);

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(g => g.name === args[0]);

        if (!channel) return this.client.functions.sendEmbed(message, null, null, 'Channel not found', null,
            'The specified channel could not be found.', null, null, null, null, null, 15000);
        if (channel.type !== 'text') return this.client.functions.sendEmbed(message, null, null, 'Failed to disable channel', null,
            'The specified channel is not a text channel.', null, null, null, null, null, 15000);

        try {
            const server = this.client.db.get(`guild.${message.guild.id}`);

            if (server.disabledChannels.includes(channel.id)) return this.client.functions.sendEmbed(message, null, null, 'Failed to disabled channel',
                null, `**${channel.name}** is already disabled.`, null, null, null, null, null, 15000);

            this.client.db.push(`guild.${message.guild.id}.disabledChannels`, channel.id);
            const disabledChannels = this.client.db.get(`guild.${message.guild.id}.disabledChannels`);

            return this.client.functions.sendEmbed(message, null, null, 'Successfully disabled channel', null,
                `Channel disabled: **${channel.name}**
                Current disabled channels: ${disabledChannels.map((c: GuildChannel) => `<#${c}>`).join(', ')}`, null,
                null, null, null, null, 30000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Failed to disable channel', null, err.message);
        }
    }
}