import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class ReloadCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'reload',
            description: 'Reloads a command',
            usages: ['reload <command>'],
            examples: ['reload avatar'],
            params: ['<command> - Name of the command'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'No command provided', null,
            'You must specify which command you want to reload.', null, null, null, null, null, 15000);

        const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0]);

        if (!command) return this.client.functions.sendEmbed(message, null, null, 'Command Invalid', null,
            `A command with the name \`${args[0]}\` is not a valid command.`, null, null, null, null, null, 15000);

        delete require.cache[require.resolve(`../${command.category}/${command.name}`)];
        this.client.loadCommand(command.category, command.name);

        return this.client.functions.sendEmbed(message, null, null, null, null, `Successfully reloaded \`${command.name}\``,
            null, null, null, null, null, 10000);
    }
}