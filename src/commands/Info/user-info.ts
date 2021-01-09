import Command from '../Command';
import SleepyClient from "../../index";
import { GuildMember, Message, PresenceStatus, Role } from 'discord.js';
import moment from 'moment';
require('moment-duration-format');

export = class UserInfoCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'user-info',
            description: 'Displays information about a user',
            usages: ['user-info [user]'],
            examples: ['user-info @user#1234', 'user-info 249997303916527616'],
            params: ['[user] - ID, mention, username/nickname of the user'],
            guildOnly: true,
            category: 'Info'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.checkMention(message, args) as GuildMember;

        await this.client.functions.sendEmbed(message, null, null, `Information about: ${member.user.tag}`, null,
            null, null, member.user.displayAvatarURL({dynamic: true, size: 256}), null, null,
            {'Name':{'value':member.displayName,'inline':true},
                'ID':{'value':member.id,inline:true},
                'Bot':{'value':member.user.bot ? '✅' : '❌','inline':true},
                'Status':{'value':({
                        'online': 'Online',
                        'dnd': 'Do not Disturb',
                        'offline': 'Offline / Invisible',
                        'idle': 'Idle / Busy'
                    } as unknown as PresenceStatus)[<any>member.user.presence.status],'inline':true},
                'Joined':{'value':moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY"),'inline':true},
                'Created':{'value':moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY"),'inline':true},
                'Playing':{'value':this.getStatus(member),'inline':true},
                'Roles':{'value':member.roles.cache.filter((role: Role) => role.name !== '@everyone').map((r: Role) => r).sort((a: Role, b: Role) => b.position - a.position).join(', ') || 'No roles','inline':true},
                '\u200B':{'value':'\u200B','inline':true}});
    }

    getStatus(member: GuildMember) {
        const activities = member.user.presence.activities;
        if (activities.length > 0 && activities[0].name === 'Twitch') return `[${activities[0].details}](${activities[0].url})`;
        else return activities.length > 0 ? (activities[0].name === 'Custom Status' && activities[0].state ? activities[0].state : activities[0].name || 'No status') : 'No status';
    }
}