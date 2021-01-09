import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class RestartCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'restart',
            description: 'Restarts the bot',
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        await this.client.functions.sendEmbed(message, null, null, null, null, 'Restarting the bot...');
        process.exit(42);
    }
}
