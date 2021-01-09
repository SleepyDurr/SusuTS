import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import request from 'node-superfetch';

export = class MemeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'meme',
            description: 'Displays a random meme from memes, dankmemes, or me_irl subreddits',
            category: 'Fun'
        });
    }

    async run(message: Message, args: string[]) {
        try {
            const {text} = await request.get('https://meme-api.herokuapp.com/gimme');
            return this.client.functions.sendEmbed(message, null, null, JSON.parse(text).title, null, null, JSON.parse(text).url);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Meme Error', null, err.message);
        }
    }
}