import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class GlitchCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'glitch',
            description: 'Draws the avatar but glitched',
            usages: ['glitch <member>'],
            examples: ['glitch @user#1234', 'glitch 249997303916527616'],
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
            this.client.avatar.distort(ctx, 130, 0, 0, data.width, data.height, 5);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'glitch.png');
            return this.client.functions.avatarEmbed(message, `glitch - ${member.displayName}`, attachment, 'glitch');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Glitch Error', null, err.message);
        }
    }
}