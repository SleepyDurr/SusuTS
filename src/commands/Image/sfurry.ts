import Command from '../Command';
import SleepyClient from '../../index';
import {Message} from 'discord.js';
import request from "node-superfetch";

export = class SfwFurryCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'sfurry',
            description: 'Displays a random sfw furry image w/ tag',
            usages: ['sfurry <tag>', 'sfurry list'],
            examples: ['sfurry hug'],
            params: ['<tag> - Tag you wish to get a relevant image of'],
            category: 'Image'
        });
    }

    async run(message: Message, args: string[]) {
        const prefix = this.client.db.get(`guild.${message.guild?.id || message.channel.id}.prefix`);

        try {
            const furry_endpoints = Object.keys(JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/furry/sfw`)).text).sfw).map(tag => tag.replace('sfw_fur_', ''));

            if (args[0]) {
                if (args[0] === 'list') {
                    return this.client.functions.sendEmbed(message, null, null, 'Furry Tags', null, furry_endpoints.join('\n'));
                } else if (furry_endpoints.includes(args[0])) {
                    const imageUrl = JSON.parse((await request.get(`https://sleepydurr.uk/api/v2/furry/sfw/sfw_fur_${args[0]}`)).text).image.url;

                    return this.client.functions.sendEmbed(message, null, null, `furry - ${args[0]}`, null, null, imageUrl);
                } else {
                    return this.client.functions.sendEmbed(message, null, null, 'Image not found', null,
                        `An image with that tag does not exist.
                        Type \`${prefix}sfurry list\` for a list of tags.`);
                }
            } else {
                return this.client.functions.sendEmbed(message, null, null, 'No tag provided', null,
                    `You need to provide a tag.
                    Type \`${prefix}furry list\` for a list of tags.`);
            }
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Furry Error', null, err.message);
        }
    }
}