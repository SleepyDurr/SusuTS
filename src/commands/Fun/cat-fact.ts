import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';

export = class CatFactCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'cat-fact',
            description: 'Displays a random fact about cats',
            aliases: 'catfact',
            category: 'Fun'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const {text} = await request.get('https://catfact.ninja/fact');
            return this.client.functions.sendEmbed(message, null, null, 'Cat Fact', null, JSON.parse(text).fact);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Cat Fact Error', null, err.message);
        }
    }
}
