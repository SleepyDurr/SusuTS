import Command from '../Command';
import SleepyClient from '../../index';
import {Message, TextChannel} from 'discord.js';

export = class PurgeCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: "purge",
            description: "Deletes x amount of messages (max: 100)",
            aliases: ["delete", "remove", "clear"],
            usages: ["delete <amount>"],
            examples: ["delete 20"],
            params: ["<amount> - Amount of messages you want to delete (max: 100)"],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            category: 'Util'
        });
    }

    async run(message: Message, args: string[]) {
        const prefix = this.client.db.get(`guild.${message.guild.id}.prefix`);
        try {
            if (args[0]) {
                let amount = parseInt(args[0]);

                if (!Number.isNaN(amount)) {
                    if (amount !== 0) {
                        if (amount > 100) {
                            return this.client.functions.sendEmbed(message, null, null, 'Incorrect value', null,
                                `The value must be between 1-100.
                                blame api restrictions ;w;`, null, null, null, null, null, 15000);
                        } else {
                            await (<TextChannel>message.channel).bulkDelete(amount);

                            return this.client.functions.sendEmbed(message, null, null, 'Successfully deleted messages', null,
                                `Deleted ${amount} ${amount === 1 ? 'message' : 'messages'}`, null, null, null, null, null,
                                15000);
                        }
                    } else {
                        return this.client.functions.sendEmbed(message, null, null, 'b-baka!', null,
                            `You can't delete 0 messages ;w;`, null, null, null, null, null, 15000);
                    }
                } else {
                    return this.client.functions.sendEmbed(message, null, null, 'Not a number', null,
                        'The amount provided must be a whole number (1-100)', null, null, null, null, null, 15000);
                }
            } else {
                return this.client.functions.sendEmbed(message, null, null, 'Incorrect Value', null,
                    `Enter a valid amount.
                    Example: \`${prefix}purge 10\``, null, null, null, null, null, 15000);
            }
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Purge Error', null, err.message);
        }
    }
}