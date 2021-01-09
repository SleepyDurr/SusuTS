import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import request from 'node-superfetch';
const gm = require('gm').subClass({imageMagick: true});

export = class LiquidRescaleCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'liquid-rescale',
            description: 'Draws the avatar but with liquid rescale',
            usages: ['liquid-rescale <member>'],
            examples: ['liquid-rescale @user#1234', 'liquid-rescale 249997303916527616'],
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
            magik.out('-liquid-rescale');
            magik.out('50%');
            magik.implode(0.25);
            magik.setFormat('png');

            const attachment = new MessageAttachment(<Buffer>(await this.client.avatar.magikToBuffer(magik)), 'liquid-rescale.png');
            return this.client.functions.avatarEmbed(message, `liquid-rescale - ${member.displayName}`, attachment, 'liquid-rescale');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Liquid Rescale Error', null, err.message);
        }
    }
}