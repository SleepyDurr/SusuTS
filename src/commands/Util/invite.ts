import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class InviteCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'invite',
            description: 'Invite the bot to your own guild',
            category: 'Util'
        });
    }

    async run(message: Message, args: string[]) {
        return this.client.functions.sendEmbed(message, null, null, 'Invite Me <a:rainbowNeko:796802299418378280>', null,
            `[**Click here to invite me to your super awesome guild ^^**](https://discord.com/api/oauth2/authorize?client_id=486271736174739456&permissions=8&scope=bot)
            
            Default prefix: \`${this.client.config.SLEEPY_PREFIX}\`
            Change prefix with \`${this.client.config.SLEEPY_PREFIX}set-prefix <new_prefix>\``,
            null, 'https://images.sleepydurr.uk/util/SleepyDurr.png');
    }
}