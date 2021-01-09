import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class BrazzersCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'brazzers',
            description: 'Draws brazzers logo over avatar',
            usages: ['brazzers <member>'],
            examples: ['brazzers @user#1234', 'brazzers 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'brazzers.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const ratio = base.width / base.height;
            const width = data.width / 3;
            const height = Math.round(width / ratio);
            ctx.drawImage(base, 0, data.height - height, width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'brazzers.png');
            return this.client.functions.avatarEmbed(message, `brazzers - ${member.displayName}`, attachment, 'brazzers');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Brazzers Error', null, err.message);
        }
    }
}