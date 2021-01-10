import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from '../../structures/Interface';

export = class BunnyCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'bunny',
            description: 'Displays a random image of a bunny',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://sleepydurr.uk/api/v2/animals/bunny')).text).image.url;

        return this.client.functions.sendEmbed(message, null, null, 'cute boonie', null, null, imageUrl,
            null, null, null, null, 'keep');
    }
}