import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from 'canvas';
import request from 'node-superfetch';

export = class FishEyeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'fish-eye',
            description: 'Draws avatar with a fish-eye lens',
            aliases: ['fisheye'],
            usages: ['fish-eye <member>'],
            examples: ['fish-eye @user#1234', 'fish-eye 249997303916527616'],
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
            this.client.avatar.fishEye(ctx, 20, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'fish-eye.png');
            return this.client.functions.avatarEmbed(message, `fish-eye - ${member.displayName}`, attachment, 'fish-eye');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Fish Eye Error', null, err.message);
        }
    }
}