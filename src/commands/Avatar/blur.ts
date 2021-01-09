import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import {canvasRGBA} from "stackblur-canvas";
import request from 'node-superfetch';

export = class BlurCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'blur',
            description: 'Blurs the avatar',
            usages: ['blur <member>'],
            examples: ['blur @user#1234', 'blur 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            canvasRGBA(<any>canvas, 0, 0, canvas.width, canvas.height, 20);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'blur.png');
            return this.client.functions.avatarEmbed(message, `blur - ${member.displayName}`, attachment, 'blur');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Blur Error', null, err.message);
        }
    }
}