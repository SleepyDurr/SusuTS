import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import {join} from 'path';
import request from 'node-superfetch';

export = class PoliceTapeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'police-tape',
            description: 'Draws police tape over the avatar',
            aliases: ['policetape', 'police'],
            usages: ['police-tape <member>'],
            examples: ['police-tape @user#1234', 'police-tape 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'police-tape.png'));
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const { x, y, width, height } = this.client.avatar.centerImage(base, data);
            ctx.drawImage(base, x, y, width, height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'police-tape.png');
            return this.client.functions.avatarEmbed(message, `police-tape - ${member.displayName}`, attachment, 'police-tape');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Police Tape Error', null, err.message);
        }
    }
}