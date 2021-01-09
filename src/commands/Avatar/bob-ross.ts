import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from 'canvas';
import request from 'node-superfetch';
import {join} from 'path';

export = class BobRossCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'bob-ross',
            description: 'Draws the avatar on Bob Ross\' canvas',
            aliases: ['bobross'],
            usages: ['bob-ross <member>'],
            examples: ['bob-ross @user#1234', 'bob-ross 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            const { x, y, width, height } = this.client.avatar.centerImagePart(data, 440, 440, 15, 20);
            ctx.drawImage(data, x, y, width, height);
            ctx.drawImage(base, 0, 0);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'bob-ross.png');
            return this.client.functions.avatarEmbed(message, `Bob Ross painted ${member.displayName}`, attachment, 'bob-ross');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Bob Ross Error', null, err.message);
        }
    }
}