import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class SetAvatarCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'set-avatar',
            description: 'Sets the client users avatar',
            usages: ['set-avatar <url>'],
            examples: ['set-avatar https://images.sleepydurr.uk/util/SleepyDurr.png'],
            params: ['<url> - Image for new avatar'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No URL', null,
            `You need to provide a new avatar.
            Example: \`${this.client.functions.getPrefix(message)}set-avatar https://images.sleepydurr.uk/util/SleepyDurr.png\``, null, null, null,
            null, null, 15000);

        try {
            await this.client.user.setAvatar(args[0]);
            return this.client.functions.sendEmbed(message, null, null, null, null, `Avatar successfully changed`, args[0],
                null, null, null, null, 15000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Setting Avatar Error', null, err.message);
        }
    }
}