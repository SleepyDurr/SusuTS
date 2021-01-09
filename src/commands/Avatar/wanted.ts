import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class WantedCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'wanted',
            description: 'Draws avatar on a wanted poster',
            usages: ['wanted <member>'],
            examples: ['wanted @user#1234', 'wanted 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'wanted.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            const { x, y, width, height } = this.client.avatar.centerImagePart(data, 430, 430, 150, 360);
            ctx.drawImage(data, x, y, width, height);
            this.client.avatar.sepia(ctx, x, y, width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'wanted.png');
            return this.client.functions.avatarEmbed(message, `wanted - ${member.displayName}`, attachment, 'wanted');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Wanted Error', null, err.message);
        }
    }
}