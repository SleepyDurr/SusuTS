import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class EnableCommandCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'enable-command',
            description: 'Enables command so that it can be executed again on the guild',
            aliases: ['ecom', 'enablecommand'],
            usages: ['enable-command <command>'],
            examples: ['enable-command ping'],
            params: ['<command> - Name of the command'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No command provided', null,
            'You need to specify a command to enable', null, null, null, null, null, 15000);

        const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0]);

        if (!command) return this.client.functions.sendEmbed(message, null, null, 'Command not found', null,
            `**${args[0]}** is not a valid command.`, null, null, null, null, null, 15000);

        try {
            const server = this.client.db.get(`guild.${message.guild.id}`);

            if (!server.disabledCommands.includes(args[0])) return this.client.functions.sendEmbed(message, null, null, 'Command not disabled',
                null, `**${args[0]}** is not disabled.`, null, null, null, null, null, 15000);

            let arrayIndex = server.disabledCommands.indexOf(args[0]);
            server.disabledCommands.splice(arrayIndex, 1);
            this.client.db.set(`guild.${message.guild.id}.disabledCommands`, server.disabledCommands);

            return this.client.functions.sendEmbed(message, null, null, 'Successfully enabled command', null,
                `Command enabled: **${args[0]}**
                Current disabled commands: ${server.disabledCommands.length > 0 ? server.disabledCommands.join(', ') : 'No commands disabled'}`,
                null, null, null, null, null, 30000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Failed to enable command',
                null, err.message, null, null, null, null, null, 15000);
        }
    }
}