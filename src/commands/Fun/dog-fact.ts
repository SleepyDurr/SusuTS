import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';

export = class DogFactCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'dog-fact',
            description: 'Displays a random fact about dogs',
            aliases: ['dogfact'],
            category: 'Fun'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const {text} = await request.get('https://dog-api.kinduff.com/api/facts');
            return this.client.functions.sendEmbed(message, null, null, 'Dog Fact', null, JSON.parse(text).facts[0]);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Dog Fact Error', null, err.message);
        }
    }
}