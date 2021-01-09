import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class FireFrameCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'fire-frame',
            description: 'Draws a fire frame around the avatar',
            aliases: ['fireframe'],
            usages: ['fire-frame <member>'],
            examples: ['fire-frame @user#1234', 'fire-frame 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'fire-frame.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            this.client.avatar.drawImageWithTint(ctx, data, '#fc671e', 0, 0, data.width, data.height);
            ctx.drawImage(base, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'fire-frame.png');
            return this.client.functions.avatarEmbed(message, `fire-frame - ${member.displayName}`, attachment, 'fire-frame');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Fire Frame Error', null, err.message);
        }
    }
}