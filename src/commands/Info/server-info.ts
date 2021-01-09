import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";

export = class ServerInfoCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'server-info',
            description: 'Displays information about the guild',
            aliases: ['serverinfo', 'sinfo', 'server'],
            guildOnly: true,
            category: 'Info'
        });
    }

    async run(message: Message, args: string[]) {
        const server = this.client.db.get(`guild.${message.guild.id}`);
        const guild = message.guild;
        const guildOwner = await guild.members.fetch(guild.ownerID);
        const guildMembers = await guild.members.fetch();

        return this.client.functions.sendEmbed(message, null, null, `Information about: ${guild.name}`, guild.iconURL({dynamic: true, size: 256}),
            null, null, null, null, null,
            {'Name':{'value':guild.name,'inline':true},
                'ID':{'value':guild.id,'inline':true},
                'Owner':{'value':`${guildOwner.user.tag} [${guildOwner.id}]`,'inline':true},
                'Region':{'value':guild.region,'inline':true},
                'Channels':{'value':`${guild.channels.cache.filter(channel => channel.type === 'text' || channel.type === 'voice').size} (Text: ${guild.channels.cache.filter(channel => channel.type === 'text').size} & Voice: ${guild.channels.cache.filter(channel => channel.type === 'voice').size})`,'inline':true},
                'Members':{'value':`${guild.memberCount} (Users: ${guildMembers.filter((member) => !member.user.bot).size} & Bots: ${guildMembers.filter(member => member.user.bot).size})`,'inline':true},
                'Roles':{'value':guild.roles.cache.filter(role => role.name !== '@everyone').map(role => role).sort((a,b) => b.position - a.position).join(', ') || 'No roles','inline':true},
                'Disabled Commands':{'value':server.disabledCommands.join(', ') || 'No commands disabled','inline':true},
                'Disabled Channels':{'value':server.disabledChannels.map((channel: string) => `<#${channel}>`).join(', ') || 'No channels disabled','inline':true}});
    }
}