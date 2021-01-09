import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from '../../structures/Interface';

export = class WolfCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'wolf',
            description: 'Displays a random image of a wolf',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://sleepydurr.uk/api/v2/animals/wolf')).text).image.url;

        return this.client.functions.sendEmbed(message, null, null, 'cute wolfu', null, null, imageUrl);
    }
}