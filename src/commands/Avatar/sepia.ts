import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import request from 'node-superfetch';

export = class SepiaCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'sepia',
            description: 'Draws avatar in sepia',
            usages: ['sepia <member>'],
            examples: ['sepia @user#1234', 'sepia 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const data = await loadImage(<Buffer>body);
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            this.client.avatar.sepia(ctx, 0, 0, data.width, data.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'sepia.png');
            return this.client.functions.avatarEmbed(message, `sepia - ${member.displayName}`, attachment, 'sepia');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Sepia Error', null, err.message);
        }
    }
}