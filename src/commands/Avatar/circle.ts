import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from 'canvas';
import request from 'node-superfetch';

export = class CircleCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'circle',
            description: 'Displays avatar as a circle',
            usages: ['circle <member>'],
            examples: ['circle @user#1234', 'circle 249997303916527616'],
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
            const dimensions = data.width <= data.height ? data.width : data.height;
            const canvas = createCanvas(dimensions, dimensions);
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0 , Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));

            const attachment = new MessageAttachment(canvas.toBuffer(), 'circle.png');
            return this.client.functions.avatarEmbed(message, `circle - ${member.displayName}`, attachment, 'circle');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Circle Error', null, err.message);
        }
    }
}