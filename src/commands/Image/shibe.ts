import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';
import {SleepyDurrResults} from '../../structures/Interface';

export = class ShibeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'shibe',
            description: 'Displays a random image of a shibe',
            category: 'Image'
        });
    }

    async run(message: Message) {
        const imageUrl: SleepyDurrResults = JSON.parse((await request.get('https://shibe.online/api/shibes')).text)[0];

        return this.client.functions.sendEmbed(message, null, null, 'cute floof doggo', null, null, imageUrl);
    }
}