import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class DexterCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'dexter',
            description: 'Draws avatar over the screen of Dexter from Pokémon',
            usages: ['dexter <member>'],
            examples: ['dexter @user#1234', 'dexter 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'dexter.png'));
            const { body } = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.rotate(-11 * (Math.PI / 180));
            const { x, y, width, height } = this.client.avatar.centerImagePart(data, 225, 225, 234, 274);
            ctx.drawImage(data, x, y, width, height);
            ctx.rotate(11 * (Math.PI / 180));

            const attachment = new MessageAttachment(canvas.toBuffer(), 'dexter.png');

            return this.client.functions.avatarEmbed(message, `dexter - ${member.displayName}`, attachment, 'dexter');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Dexter Error', null, err.message);
        }
    }
}