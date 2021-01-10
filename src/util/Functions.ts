import SleepyClient from "../index";
import {
    BitFieldResolvable, Guild,
    GuildMember,
    Message,
    MessageAttachment,
    MessageEmbed,
    PermissionString,
    TextChannel,
    User
} from "discord.js";
import {CaseOptions, CommandOptions, Data, SleepyDurrResults} from '../structures/Interface';
import request from 'node-superfetch';
import moment from "moment";
require('moment-duration-format');

export default class Functions {
    private client: SleepyClient;
    private readonly error: any;

    constructor(client: SleepyClient) {
        this.error = require('./errors.json');
        this.client = client;
    }

    sendError(message: Message | null, errorType: string, errorData: Data, errorLocation: string = null) {
        const data = this.error[errorType];

        switch(errorLocation) {
            case 'channel':
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(data?.title)
                    .setDescription(this.parseError(data?.description, errorData));
                return message.channel.send(embed).then(msg => {
                    setTimeout(async () => {
                        await msg.delete();
                    }, data?.delete || 60000);
                });
            default:
                let output: any  = [this.parseError(data?.description, errorData)];
                output.raw = [output];
                console.log(this.client.chalk(output));
        }

        if (data?.stopProcess) return process.exit(0);
    }

    parseError(description: string, data: Data) {
        const values: any = {
            '{cmdName}':data?.cmdName,
            '{who}':data?.who,
            '{data}':Array.isArray(data?.data) ? data.data.join(', ') : data?.data,
            '{authorID}':data?.authorID,
            '{channelID}':data?.channelID,
            '{guild}':data?.guild ? `[${data?.guild.id}]` : ''
        }
        const valueKeys = Object.keys(values);
        valueKeys.forEach((key: string) => description = description?.replace(key, values[key]));
        return description;
    }

    async sendEmbed(message: Message, author: string | null = null, authorURL: string | null = null, title: string | null = null, titleURL: string | null = null, description: string | null = null, image: string | null | SleepyDurrResults = null, thumbnail: string | null = null, footer: string | null = null, footerURL: string | null = null, fields: any = null , time: number | string = null): Promise<Message> {
        const embed = new MessageEmbed()
            .setColor("RANDOM");
        if (author) embed.setAuthor(author, authorURL);
        if (title) embed.setTitle(title);
        if (titleURL) embed.setURL(titleURL);
        if (description) embed.setDescription(description);
        if (image) embed.setImage(image as string);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (footer) embed.setFooter(footer, footerURL);

        if (fields) {
            const fieldKeys = Object.keys(fields);
            if (fieldKeys.length > 0) fieldKeys.forEach(key => embed.addField(key, fields[key].value, fields[key].inline));
        }

        const sentMessage = await message.channel.send(embed);

        if (message.guild && time !== 'keep') setTimeout(() => {
            sentMessage.delete();
        }, <number>time || 1000 * 60 * 5);

        return sentMessage;
    }

    async checkMention(message: Message, args: string[]): Promise<GuildMember | User> {
        if (!message.guild) return message.author;
        let member: GuildMember = args.length > 0 ? (await message.guild.members.fetch({query: args.join(' ')})).first() : null;

        if (!member) {
            try {
                member = await message.guild.members.fetch(args[0] ? args[0] : 'force error');
            } catch {
                member = message.mentions.members.first() || message.member;
            }
        }

        return member;
    }

    async moderationCheckMention(message: Message, memberID: string): Promise<GuildMember> {
        try {
            let member;

            try {
                member = await message.guild.members.fetch(memberID || 'force-error');
            } catch {
                member = message.mentions.members.first();
            }

            if (member) return member;
            return null;
        } catch {
            return null;
        }
    }

    async interactionCheckMentions(message: Message, args: string[]) {
        if (message.mentions.members.size > 0) {
            const mentions = message.mentions.members.map(m => `**${m.displayName}**`);
            let members = mentions.join(', ');
            let pos = members.lastIndexOf(',');
            if (pos !== -1) members = members.substring(0, pos) + ' and' + members.substring(pos + 1);
            return members;
        }

        let member: GuildMember | string = args.length > 0 ? (await message.guild.members.fetch({query: args.join(' ')})).first() : null;

        if (!member && args.length > 0) {
            try {
                member = await message.guild.members.fetch(args[0]);
            } catch {
                member = args.join(' ');
            }
        }

        if (!member) {
            return this.sendEmbed(message, null, null, 'Couldn\'t find user', null, `I couldn't find that user on the server.`);
        }

        return `**${(<GuildMember>member).displayName || member}**`;
    }

    async avatarEmbed(message: Message, titleText: string, attachment: MessageAttachment, title: string) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${titleText}`)
            .attachFiles(Array(attachment))
            .setImage(`attachment://${title}.png`);
        return message.channel.send(embed).then(msg => setTimeout(() => msg.delete(), 300000));
    }

    async getImage(message: Message, description: string, endpoint: string, sfw: boolean, command: string) {
        const baseUrl = 'https://sleepydurr.uk/api/v2';
        const animals = await request.get(`${baseUrl}/animals`);
        const animalEndpoints = Object.keys(JSON.parse(animals.text).animals);
        const anime = await request.get(`${baseUrl}/anime/sfw`);
        const animeEndpoints = Object.keys(JSON.parse(anime.text).sfw);

        if (command === 'image') {
            if (animalEndpoints.includes(endpoint)) {
                const imageURL = (JSON.parse((await request.get(`${baseUrl}/animals/${endpoint}`)).text).image.url);
                return this.sendEmbed(message, null, null, null, null, description, imageURL, null, null, null, null, 'keep');
            } else if (animeEndpoints.includes(endpoint)) {
                const imageURL = (JSON.parse((await request.get(`${baseUrl}/anime/sfw/${endpoint}`)).text).image.url);
                return this.sendEmbed(message, null, null, null, null, description, imageURL, null, null, null, null, 'keep');
            } else {
                return this.sendEmbed(message, null, null, 'No image found', null, `I couldn't find an image with that tag.
                You can find available tags **[here](https://sleepydurr.uk/api/v2/)**`);
            }
        }
    }

    async checkPermissions(message: Message, command: CommandOptions): Promise<boolean> {
        const clientPermissions = this.checkClientPermissions(message, command);
        const userPermissions = this.checkUserPermissions(message, command);

        return await (clientPermissions && userPermissions);
    }

    async checkClientPermissions(message: Message, command: CommandOptions): Promise<boolean> {
        if (!message.guild || !command.clientPermissions) return true;

        const missingPermissions: string[] = (<TextChannel>message.channel).permissionsFor(message.guild.me).missing(<Array<BitFieldResolvable<PermissionString>>>command.clientPermissions).map((perm: string) => perm);

        if (missingPermissions.length !== 0) {
            await this.sendError(message, 'MISSING_PERMISSION', {who:'I don\'t',cmdName:command.name,data:missingPermissions.join(', ')}, 'channel');
            return false;
        }
        return true;
    }

    async checkUserPermissions(message: Message, command: CommandOptions): Promise<boolean> {
        if (!message.guild || !command.userPermissions || this.client.config['OWNER_IDs'].split(',').includes(message.author.id)
        || message.member.hasPermission('ADMINISTRATOR')) return true;

        const missingPermissions: string[] = (<TextChannel>message.channel).permissionsFor(message.author).missing(<Array<BitFieldResolvable<PermissionString>>>command.userPermissions).map((perm: string) => perm);

        if (missingPermissions.length !== 0) {
            await this.sendError(message, 'MISSING_PERMISSION', {who:'You don\'t',cmdName:command.name,data:missingPermissions.join(', ')}, 'channel');
            return false;
        }
        return true;
    }

    getPrefix(message: Message) {
        return this.client.db.get(`guild.${message.guild?.id || message.channel.id}.prefix`);
    }

    getModLogChannel(message: Message) {
        const modlog = this.client.db.get(`guild.${message.guild.id}.modLogChannel`);
        if (modlog) {
            return message.guild.channels.cache.get(modlog) as TextChannel;
        } else {
            return null;
        }
    }

    async sendToChannel(channel: TextChannel, title: string, description: string, thumbnail?: string, time: number = null) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(title)
            .setThumbnail(thumbnail)
            .setDescription(description);
        return channel.send(embed).then(msg => {
            if (time) setTimeout(() => msg.delete(), time);
        });
    }

    async logExecutedCommands(message: Message, title?: string, description?: string, thumbnail?: string) {
        const logCommands = this.client.db.get('config.logCommands');

        if (!logCommands) return;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(title)
            .setDescription(description)
            .setThumbnail(thumbnail)
            .setFooter(moment.utc(Date.now()).format("dddd, MMMM Do YYYY | HH:mm:ss"));

        const guild = await this.client.guilds.fetch('769871630872215572');
        let channel = guild.channels.cache.find(c => c.name === 'commands');

        if (!channel) {
            channel = await guild.channels.create('commands', {type: 'text'});
        }

        return (<TextChannel>channel).send(embed);
    }

    async canModerate(message: Message, member: GuildMember) {
        if (message.guild.ownerID === message.author.id) return true;

        return message.member.roles.highest.rawPosition > member.roles.highest.rawPosition;
    }

    async appendCaseNumber(ID: string) {
        if (!this.client.db.get('cases')) {
            await new this.client.db.table('cases');
            this.client.db.set(`cases.${ID}.cases`, []);
            return 0;
        }

        const cases = this.client.db.get(`cases.${ID}.cases`);
        const caseNumber = cases.map((c: CaseOptions) => c.caseNumber).sort((a: number, b: number) => b - a);
        return caseNumber[0];
    }

    async fetchCase(guild: Guild, caseNumber: number) {
        const cases = this.client.db.get(`cases.${guild.id}.cases`);
        const findCase = cases?.filter((c: CaseOptions) => c.caseNumber === caseNumber);
        if (!findCase) return null;
        return findCase[0];
    }
}