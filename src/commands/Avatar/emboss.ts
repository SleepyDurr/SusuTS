import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import request from 'node-superfetch';
const gm = require('gm').subClass({imageMagick: true});

export = class EmbossCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'emboss',
            description: 'Draws the avatar but embossed',
            usages: ['emboss <member>'],
            examples: ['emboss @user#1234', 'emboss 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const magik = gm(body);
            magik.emboss();
            magik.setFormat('png');

            const attachment = new MessageAttachment(<Buffer>(await this.client.avatar.magikToBuffer(magik)), 'emboss.png');
            return this.client.functions.avatarEmbed(message, `emboss - ${member.displayName}`, attachment, 'emboss');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Emboss Error', null, err.message);
        }
    }
}