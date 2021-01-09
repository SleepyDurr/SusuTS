import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class GreyscaleCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'greyscale',
            description: 'Greyscales the avatar',
            usages: ['greyscale <member>'],
            examples: ['greyscale @user#1234', 'greyscale 249997303916527616'],
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
            this.client.avatar.greyscale(ctx, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'greyscale.png');
            return this.client.functions.avatarEmbed(message, `greyscale - ${member.displayName}`, attachment, 'greyscale');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Greyscale Error', null, err.message);
        }
    }
}