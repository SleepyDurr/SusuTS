import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class GhostCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'ghost',
            description: 'Displays avatar with a ghost-like transparency',
            usages: ['ghost <member>'],
            examples: ['ghost @user#1234', 'ghost 249997303916527616'],
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
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, data.width, data.height);
            ctx.globalAlpha = 0.25;
            ctx.drawImage(data, 0, 0);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'ghost.png');
            return this.client.functions.avatarEmbed(message, `ghost - ${member.displayName}`, attachment, 'ghost');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Ghost Error', null, err.message);
        }
    }
}