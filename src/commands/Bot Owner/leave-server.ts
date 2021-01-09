import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class LeaveServerCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'leave-server',
            description: 'Leaves a discord server',
            usages: ['leave-server <ID>'],
            examples: ['leave-server 769871630872215572'],
            params: ['<ID> - ID of the server'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No ID provided', null,
            `You need to specify a guild to leave.
            Example: \`${this.client.functions.getPrefix(message)}leave-server 769871630872215572\``, null, null, null, null, null,
            150000);

        try {
            const guild = this.client.guilds.cache.get(args[0]);
            if (!guild) return this.client.functions.sendEmbed(message, null, null, 'Guild Not Found', null,
                `A guild with the ID \`${args[0]}\` was not found.`, null, null, null, null, null,
                150000);

            await guild.leave();
            return this.client.functions.sendEmbed(message, null, null, 'Left Guild', null,
                `Successfully left \`${guild.name} [${guild.id}]\``, null, null, null, null, null, 30000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Leaving Error', null, err.message);
        }
    }
}