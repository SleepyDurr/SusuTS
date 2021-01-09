import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class GunCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'gun',
            description: 'Gives the avatar a gun',
            usages: ['gun <member>'],
            examples: ['gun @user#1234', 'gun 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'gun.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const ratio = (data.height / 2) / base.height;
            const width = base.width * ratio;
            ctx.drawImage(base, data.width - width, data.height - (data.height / 2), width, data.height / 2);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'gun.png');
            return this.client.functions.avatarEmbed(message, `gun - ${member.displayName}`, attachment, 'gun');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Gun Error', null, err.message);
        }
    }
}