import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import request from 'node-superfetch';
const gm = require('gm').subClass({imageMagick: true});

export = class OilPaintingCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'oil-painting',
            description: 'Draws the avatar but with oil paints',
            usages: ['oil-painting <member>'],
            examples: ['oil-painting @user#1234', 'oil-painting 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const magik = gm(body);
            magik.paint(5);
            magik.setFormat('png');

            const attachment = new MessageAttachment(<Buffer>(await this.client.avatar.magikToBuffer(magik)), 'oil-painting.png');
            return this.client.functions.avatarEmbed(message, `oil-painting - ${member.displayName}`, attachment, 'oil-painting');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Oil Painting Error', null, err.message);
        }
    }
}