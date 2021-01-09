import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class ContrastCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'contrast',
            description: 'Adds contrast to avatar',
            usages: ['contrast <member>'],
            examples: ['contrast @user#1234', 'contrast 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            this.client.avatar.contrast(ctx, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'contrast.png');
            return this.client.functions.avatarEmbed(message, `contrast - ${member.displayName}`, attachment, 'contrast');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Contrast Error', null, err.message);
        }
    }
}