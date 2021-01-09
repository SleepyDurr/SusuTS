import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";
import request from 'node-superfetch';

export = class LewdFurryCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'nfurry',
            description: 'Displays a random lewd furry related image w/ tag',
            usages: ['nfurry <tag>', 'nfurry list'],
            examples: ['nfurry yiff'],
            params: ['<tag> - Tag you wish to get a relevant image of'],
            nsfw: true,
            category: 'Nsfw'
        });
    }

    async run(message: Message, args: string[]) {
        const prefix = message.guild ? this.client.db.get(`guild.${message.guild.id}.prefix`) : 's!';

        try {
            const endpoints = Object.keys(JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/furry/nsfw`)).text).nsfw).map(tag => tag.replace('nsfw_fur_', ''));

            if (args[0]) {
                if (args[0] === 'list') {
                    return this.client.functions.sendEmbed(message, null, null, 'Lewd Furry tags', null, endpoints.join('\n'), null,
                        null, null, null, null, 30000);
                } else if (endpoints.includes(args[0])) {
                    const imageUrl = (JSON.parse((await request.get(args[0] === 'yiff' ? `https://sleepydurr.uk/api/v2/furry/nsfw/${args[0]}` : `https://sleepydurr.uk/api/v2/furry/nsfw/nsfw_fur_${args[0]}`)).text).image.url);

                    return this.client.functions.sendEmbed(message, null, null, null, null,
                        `[NSFW] furry - ${args[0]}`, imageUrl);
                } else {
                    return this.client.functions.sendEmbed(message, null, null, 'Image not found', null,
                        'An image with that tag does not exist', null, null, null, null, null, 15000);
                }
            } else {
                return this.client.functions.sendEmbed(message, null, null, 'No tag provided', null,
                    `You need to provide a tag.
                    Type '${prefix}nfurry list' for a list of tags.`, null, null, null, null, null, 15000);
            }
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Lewd Furry Error', null, err.message);
        }
    }
}