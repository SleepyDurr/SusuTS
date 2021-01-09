import Command from '../Command';
import SleepyClient from "../../index";
import {GuildMember, Message, MessageAttachment} from 'discord.js';
import request from 'node-superfetch';
import {Args, Lexer, longStrategy, Parser} from "lexure";
const gm = require('gm').subClass({imageMagick: true});

export = class NoiseCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'noise',
            description: 'Draws the avatar but with noise',
            usages: ['noise list', 'noise <member>', 'noise <member> --type=[type]'],
            examples: ['noise @user#1234', 'noise 249997303916527616'],
            params: ['<member> - Mention, ID, or username/nickname of the user', '[type] - type of noise'],
            additionalInfo: '**--type** is optional, type \`noise list\` to see the available types (default: \`poisson\`)',
            guildOnly: true,
            category: 'Avatar'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const lexer = new Lexer(message.content);
            const res = lexer.lexCommand(() => 1);
            const tokens = res[1]();
            const parser = new Parser(tokens).setUnorderedStrategy(longStrategy());
            const out = parser.parse();
            const noiseArgs = new Args(out);

            const noiseType = noiseArgs.option('type');
            const noiseList = ['uniform', 'gaussian', 'multiplicative', 'impulse', 'laplacian', 'poisson'];

            if (args[0] === 'list') {
                return this.client.functions.sendEmbed(message, null, null, null, null, null, null, null, null, null,
                    {'Noise Types':{value:noiseList.join('\n')}}, 60000);
            } else {
                const member = await this.client.functions.checkMention(message, args) as GuildMember;
                const {body} = await request.get(member.user.displayAvatarURL({format: 'png', size: 512}));
                const magik = gm(body);
                magik.noise(noiseList.includes(noiseType) ? noiseType : 'poisson');
                magik.setFormat('png');

                const attachment = new MessageAttachment(<Buffer>(await this.client.avatar.magikToBuffer(magik)), 'noise.png');
                return this.client.functions.avatarEmbed(message, `noise [${noiseList.includes(noiseType) ? noiseType : 'poisson'}] - ${member.displayName}`, attachment,
                    'noise');
            }
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Noise Error', null, err.message);
        }
    }
}