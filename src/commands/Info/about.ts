import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class AboutCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'about',
            description: 'Tells a little about myself, the thing that created this bot ^^',
            category: 'Info'
        });
    }

    async run(message: Message, args: string[]) {
        return this.client.functions.sendEmbed(message, null, null, '<a:pointLeft:796689372090597379> SleepyDurr<a:pointRight:796689372354314280>',
            null, `Hello, I am Amelia (Lia), also known as Sleepy; I am the creator of Susu.
            I hope you enjoy and if you have any requests, feel free to contact on Discord.`, null,
             'https://images.sleepydurr.uk/util/SleepyDurr.gif', 'If you want, you can donate to my ko-fi but it is NOT expected!',
            null,
            {'Github': {value:'[SleepyDurr](https://github.com/SleepyDurr)',inline:true}, 'Discord':{value:'sleepy#8096',inline:true},
                'Ko-fi':{value:'[Sleepy [Lia]](https://ko-fi.com/lia)',inline:true}}, 120000);
    }
}