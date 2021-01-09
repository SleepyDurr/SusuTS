import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from '../../structures/Interface';

export = class FoxCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'fox',
            description: 'Displays a random image of a fox',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://randomfox.ca/floof')).text).image;

        return this.client.functions.sendEmbed(message, null, null, 'cute fox', null, null, imageUrl);
    }
}