import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import request from 'node-superfetch';
const gm = require('gm').subClass({imageMagick: true});

export = class ImplodeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'implode',
            description: 'Draws the avatar but imploded',
            usages: ['implode <member>'],
            examples: ['implode @user#1234', 'implode 249997303916527616'],
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
            magik.implode(80 / 100);
            magik.setFormat('png');

            const attachment = new MessageAttachment(<Buffer>(await this.client.avatar.magikToBuffer(magik)), 'implode.png');
            return this.client.functions.avatarEmbed(message, `implode - ${member.displayName}`, attachment, 'implode');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Implode Error', null, err.message);
        }
    }
}