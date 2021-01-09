import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';

export = class LogCommandsCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'log-commands',
            description: 'Enables/disables logging of executed commands',
            usages: ['log-commands <enable/disable>'],
            examples: ['log-commands enable', 'log-commands disable'],
            params: ['<enable/disable> - Whether you want to enable or disable'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        const logCommands = this.client.db.get('config.logCommands');

        if (!args[0]) return this.client.functions.sendEmbed(message, null, null, 'Invalid Usage', null,
            'Please specify whether you want to enable or disable logging of executed commands.', null, null, null, null, null,
            15000);

        if (!['enable', 'disable'].includes(args[0])) return this.client.functions.sendEmbed(message, null, null, 'Invalid Usage', null,
            `You must provide \`enable\` or \`disable\`.`, null, null, null, null, null,
            15000);

        if (!logCommands && args[0] === 'disable') return this.client.functions.sendEmbed(message, null, null, 'Already Disabled', null,
            'Logging of executed commands is already disabled.', null, null, null, null, null, 15000);

        if (logCommands && args[0] === 'enable') return this.client.functions.sendEmbed(message, null, null, 'Already Enabled', null,
            'Logging of executed commands is already enabled.', null, null, null, null, null, 15000);

        this.client.db.set('config.logCommands', args[0] === 'enable');
        return this.client.functions.sendEmbed(message, null, null, null, null,
            `Logging of executed commands has been ${args[0]}d.`, null, null, null, null, null, 15000);
    }
}