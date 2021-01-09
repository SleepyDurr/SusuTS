import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class CommunistCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'communist',
            description: 'Draws communist flag over avatar',
            usages: ['communist <member>'],
            examples: ['communist @user#1234', 'communist 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'communist.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            this.client.avatar.drawImageWithTint(ctx, data, 'red', 0, 0, data.width, data.height);
            const { x, y, width, height } = this.client.avatar.centerImage(base, data);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(base, x + (width / 20), y + (height / 20), width * 0.9, height * 0.9);
            ctx.globalAlpha = 1;

            const attachment = new MessageAttachment(canvas.toBuffer(), 'communist.png');
            return this.client.functions.avatarEmbed(message, `communist - ${member.displayName}`, attachment, 'communist');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Communist Error', null, err.message);
        }
    }
}