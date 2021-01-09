import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import {createCanvas, loadImage} from 'canvas';
import request from 'node-superfetch';

export = class AvatarFusionCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'avatar-fusion',
            description: 'Fuses two avatars together',
            aliases: ['avatarfusion', 'fuse'],
            usages: ['avatar-fusion <member>'],
            examples: ['avatar-fusion @user#1234', 'avatar-fusion 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user.'],
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const member = await this.client.functions.checkMention(message, args) as GuildMember;
            const baseAvatarData = await request.get(message.author.displayAvatarURL({format: 'png', size: 512}));
            const baseAvatar = await loadImage(<Buffer>baseAvatarData.body);
            const overlayAvatarData = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
            const overlayAvatar = await loadImage(<Buffer>overlayAvatarData.body);
            const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.5;
            ctx.drawImage(baseAvatar, 0, 0);
            ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);

            const attachment = new MessageAttachment(canvas.toBuffer(), 'avatar-fusion.png');
            return this.client.functions.avatarEmbed(message, `Fused ${message.member.displayName} and ${member.displayName}`, attachment, 'avatar-fusion');
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Avatar Fusion Error', null, err.message);
        }
    }
}