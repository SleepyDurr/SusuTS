import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import request from 'node-superfetch';
const gm = require('gm').subClass({imageMagick: true});

export = class CharcoalCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'charcoal',
            description: 'Draws the avatar with charcoal',
            usages: ['charcoal <member>'],
            examples: ['charcoal @user#1234', 'charcoal 249997303916527616'],
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
            magik.charcoal(1);
            magik.setFormat('png');

            const image = await this.client.avatar.magikToBuffer(magik);
            const attachment = new MessageAttachment(<Buffer>image, 'charcoal.png');
            return this.client.functions.avatarEmbed(message, `charcoal - ${member.displayName}`, attachment, 'charcoal');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Charcoal Error', null, err.message);
        }
    }
}