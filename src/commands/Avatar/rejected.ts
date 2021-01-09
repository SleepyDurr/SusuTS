import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class RejectedCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'rejected',
            description: 'Draws a rejected stamp over the avatar',
            usages: ['rejected <member>'],
            examples: ['rejected @user#1234', 'rejected 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'rejected.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const { x, y, width, height } = this.client.avatar.centerImage(base, data);
            ctx.drawImage(base, x, y, width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'rejected.png');
            return this.client.functions.avatarEmbed(message, `rejected - ${member.displayName}`, attachment, 'rejected');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Rejected Error', null, err.message);
        }
    }
}