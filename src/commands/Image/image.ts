import Command from '../Command';
import SleepyClient from '../../index';
import {Message} from 'discord.js';
import request from "node-superfetch";

export = class ImageCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'image',
            description: 'Displays a random image w/ tag',
            usages: ['image <tag>', 'image list'],
            examples: ['image cat'],
            params: ['<tag> - Tag you want to get a relevant image of'],
            category: 'Image'
        });
    }

    async run(message: Message, args: string[]) {
        const prefix = this.client.db.get(`guild.${message.guild?.id}.prefix`);

        try {
            if (args[0]) {
                if (args[0] === 'list') {
                    const anime_endpoints = Object.keys(JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/anime/sfw`)).text).sfw);
                    const animal_endpoints = Object.keys(JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/animals`)).text).animals);

                    return this.client.functions.sendEmbed(message, null, null, 'List of tags:', null,
                        null, null, null, null, null,
                        {'Anime':{value:anime_endpoints.join(', '),inline: true},'Animals':{value:animal_endpoints.join(', ')}});
                } else {
                    return this.client.functions.getImage(message, `image - ${args[0]}`, args[0], true, 'image');
                }
            }
            return this.client.functions.sendEmbed(message, null, null, 'No tag provided', null,
                `You didn't provide a tag.
                Type \`${prefix}image list\` for a list of tags`);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Image Error', null, err.message);
        }
    }
}