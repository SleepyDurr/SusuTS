import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from "discord.js";
import request from 'node-superfetch';

export = class LewdAnimeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'anime',
            description: 'Displays a random lewd anime related image w/ tag',
            usages: ['anime <tag>', 'anime list'],
            examples: ['anime yaoi'],
            params: ['<tag> - Tag you wish to get a relevant image of'],
            nsfw: true,
            category: 'Nsfw'
        });
    }

    async run(message: Message, args: string[]) {
        const prefix = message.guild ? this.client.db.get(`guild.${message.guild.id}.prefix`) : 's!';

        try {
            const endpoints = Object.keys(JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/anime/nsfw`)).text).nsfw);

            if (args[0]) {
                if (args[0] === 'list') {
                    return this.client.functions.sendEmbed(message, null, null, 'Anime tags', null, endpoints.join('\n'), null,
                        null, null, null, null, 30000);
                } else if (endpoints.includes(args[0])) {
                    const imageUrl = (JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/anime/nsfw/${args[0]}`)).text).image.url);

                    return this.client.functions.sendEmbed(message, null, null, null, null,
                        `[NSFW] anime - ${args[0]}`, imageUrl);
                } else {
                    return this.client.functions.sendEmbed(message, null, null, 'Image not found', null,
                        'An image with that tag does not exist', null, null, null, null, null, 15000);
                }
            } else {
                return this.client.functions.sendEmbed(message, null, null, 'No tag provided', null,
                    `You need to provide a tag.
                    Type '${prefix}anime list' for a list of tags.`, null, null, null, null, null,15000);
            }
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Anime Error', null, err.message);
        }
    }
}