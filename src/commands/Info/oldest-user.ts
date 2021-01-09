import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message} from 'discord.js';
import moment from 'moment';
require('moment-duration-format');

export = class OldestUserCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'oldest-user',
            description: 'Gets the oldest member in the guild (excluding owner)',
            aliases: ['oldest'],
            guildOnly: true,
            category: 'Info'
        });
    }

    async run(message: Message, args: string[]) {
        const members = await message.guild.members.fetch();
        const member = members.filter(m => !m.user.bot && m.id !== message.guild.ownerID).sort((a: GuildMember,b: GuildMember) => a.joinedTimestamp - b.joinedTimestamp).first();

        return this.client.functions.sendEmbed(message, null, null, 'Oldest Member', null,
            `The oldest member is **${member} [${member.id}]**
            They joined @ ${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}`, null, member.user.displayAvatarURL({dynamic: true, size: 256}),
            null, null, null, 60000);
    }
}