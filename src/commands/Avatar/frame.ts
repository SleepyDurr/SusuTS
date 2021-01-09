import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class FrameCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'frame',
            description: 'Displays avatar in a frame',
            usages: ['frame <member>'],
            examples: ['frame @user#1234', 'frame 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'frame.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            ctx.drawImage(base, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'frame.png');
            return this.client.functions.avatarEmbed(message, `frame - ${member.displayName}`, attachment, 'frame');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Frame Error', null, err.message);
        }
    }
}