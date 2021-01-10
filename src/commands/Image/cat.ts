import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from "../../structures/Interface";

export = class CatCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'cat',
            description: 'Displays random image of a cat',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://sleepydurr.uk/api/v2/animals/cat')).text).image.url;

        return this.client.functions.sendEmbed(message, null, null, 'cute kitty', null, null, imageUrl,
            null, null, null, null, 'keep');
    }
}