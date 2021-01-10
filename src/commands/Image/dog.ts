import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from "../../structures/Interface";

export = class DogCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'dog',
            description: 'Displays random image of a dog',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://sleepydurr.uk/api/v2/animals/dog')).text).image.url;

        return this.client.functions.sendEmbed(message, null, null, 'cute doggo', null, null, imageUrl,
            null, null, null, null, 'keep');
    }
}