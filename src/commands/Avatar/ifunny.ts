import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class iFunnyCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'ifunny',
            description: 'Displays ifunny logo on avatar',
            usages: ['ifunny <member>'],
            examples: ['ifunny @user#1234', 'ifunny 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'ifunny.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            ctx.fillStyle = '#181619';
            ctx.fillRect(0, canvas.height - base.height, canvas.width, base.height);
            ctx.drawImage(base, canvas.width - base.width, canvas.height - base.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'ifunny.png');
            return this.client.functions.avatarEmbed(message, `ifunny - ${member.displayName}`, attachment, 'ifunny');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'iFunny Error', null, err.message);
        }
    }
}