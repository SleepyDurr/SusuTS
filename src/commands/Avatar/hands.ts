import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class HandsCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'hands',
            description: 'Gives the avatar hands',
            usages: 'hands <member>',
            examples: ['hands @user#1234', 'hands 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'hands.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const ratio = data.width / base.width;
            const height = base.height * ratio;
            ctx.drawImage(base, 0, data.height - height, data.width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'hands.png');
            return this.client.functions.avatarEmbed(message, `hands - ${member.displayName}`, attachment, 'hands');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Hands Error', null, err.message);
        }
    }
}