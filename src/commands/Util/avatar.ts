import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, User} from "discord.js";

export = class AvatarCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'avatar',
            description: 'Displays the avatar of a user',
            usages: ['avatar [user]'],
            examples: ['avatar @user#1234', 'avatar 249997303916527616', 'avatar SleepyDurr'],
            params: ['[user] - ID, mention, or username/nickname of the user'],
            category: 'Util'
        });
    }

    async run(message: Message, args: string[]) {
        const member = await this.client.functions.checkMention(message, args);

        if (member) {
            return this.client.functions.sendEmbed(message, null, null, `${(<GuildMember>member).displayName || (<User>member).username}'s avatar:`, null, null,
                (<GuildMember>member).user?.displayAvatarURL({dynamic: true, size: 256}) || (<User>member).displayAvatarURL({dynamic: true, size: 256}),
                null, null, null, null, 120000);
        }
    }
}