import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class YouDiedCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'you-died',
            description: 'Draws "You Died" screen over the avatar',
            aliases: ['died', 'dead'],
            usages: ['you-died <member>'],
            examples: ['you-died @user#1234', 'you-died 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'you-died.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            this.client.avatar.drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
            this.client.avatar.greyscale(ctx, 0, 0, data.width, data.height);
            const { x, y, width, height } = this.client.avatar.centerImage(base, data);
            ctx.drawImage(base, x, y, width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'you-died.png');
            return this.client.functions.avatarEmbed(message, `you-died - ${member.displayName}`, attachment, 'you-died');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'You Died Error', null, err.message);
        }
    }
}