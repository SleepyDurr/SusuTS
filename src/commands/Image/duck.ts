import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from '../../structures/Interface';

export = class DuckCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'duck',
            description: 'Displays a random image of a duck',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://random-d.uk/api/v2/random')).text).url;

        return this.client.functions.sendEmbed(message, null, null, 'cute ducky', null, null, imageUrl);
    }
}