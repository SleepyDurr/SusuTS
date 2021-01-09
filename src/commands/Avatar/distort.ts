import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from 'canvas';
import request from 'node-superfetch';

export = class DistortCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'distort',
            description: 'Distorts the avatar',
            usages: ['distort <member>'],
            examples: ['distort @user#1234', 'distort 249997303916527616'],
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
            this.client.avatar.distort(ctx, 20, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'distort.png');
            return this.client.functions.avatarEmbed(message, `distort - ${member.displayName}`, attachment, 'distort');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Distort Error', null, err.message);
        }
    }
}