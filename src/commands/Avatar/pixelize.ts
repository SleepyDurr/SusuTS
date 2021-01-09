import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class PixelizeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'pixelize',
            description: 'Pixelizes the avatar',
            aliases: ['pixelise', 'pixel'],
            usages: ['pixelize <member>'],
            examples: ['pixelize @user#1234', 'pixelize 249997303916527616'],
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
            this.client.avatar.pixelize(ctx, canvas, data, 0.15, 0, 0, canvas.width, canvas.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'pixelize.png');
            return this.client.functions.avatarEmbed(message, `pixelize - ${member.displayName}`, attachment, 'pixelize');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Pixelize Error', null, err.message);
        }
    }
}