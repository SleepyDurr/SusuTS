import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class DisableCommandCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'disable-command',
            description: 'Disables a command so that it cannot be executed on the guild.',
            aliases: ['dcom', 'disablecommand'],
            usages: ['disable-command <command>'],
            examples: ['disable-command ping'],
            params: ['<command> - Name of the command'],
            guildOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            category: 'Configuration'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No command provided', null,
            'You need to specify a command to disable.', null, null, null, null, null, 15000);

        const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0]);

        if (!command) return this.client.functions.sendEmbed(message, null, null, 'Command not found', null,
            `**${args[0]}** is not a valid command.`, null, null, null, null, null, 15000);

        try {
            const server = this.client.db.get(`guild.${message.guild.id}`);

            if (server.disabledCommands.includes(args[0])) return this.client.functions.sendEmbed(message, null, null, 'Failed to disable command',
                null, `**${args[0]}** is already disabled.`, null, null, null, null, null, 15000);

            this.client.db.push(`guild.${message.guild.id}.disabledCommands`, args[0]);
            const disabledCommands = this.client.db.get(`guild.${message.guild.id}.disabledCommands`);

            return this.client.functions.sendEmbed(message, null, null, 'Successfully disabled command', null,
                `Command disabled: **${args[0]}**
                Current disabled commands: ${disabledCommands.join(', ')}`, null, null, null, null, null, 30000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Failed to disable command', null, err.message,
                null, null, null, null, null, 15000);
        }
    }
}