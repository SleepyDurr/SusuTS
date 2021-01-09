import Command from '../Command';
import SleepyClient from "../../index";
import {Message} from 'discord.js';
import {Args, Lexer, longStrategy, Parser} from "lexure";

export = class SetPresenceCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'set-presence',
            description: 'Sets the client users presence',
            usages: ['set-presence "<presence>" --type=[type]'],
            examples: ['set-presence "with cuties"', 'set-presence "watching over the cuties" --type=watching'],
            params: ['<presence> - New presence', '[type] - Playing/watching/listening'],
            botOwnerOnly: true,
            category: 'Bot Owner'
        });
    }

    async run(message: Message, args: string[]) {
        const lexer = new Lexer(message.content)
            .setQuotes([
                ['"', '"'],
                ["'", "'"]
            ]);
        const res = lexer.lexCommand(() => 1);
        const tokens = res[1]();
        const parser = new Parser(tokens).setUnorderedStrategy(longStrategy());
        const out = parser.parse();
        const presenceArgs = new Args(<any>out);

        const type = presenceArgs.options('type').toString().toUpperCase();

        if (!['PLAYING', 'WATCHING', 'LISTENING'].includes(type)) return this.client.functions.sendEmbed(message, null, null,
            'Invalid Type', null, `The type provided must be \`playing, watching, or listening\`.`, null, null, null,
            null, null, 15000);

        try {
            await this.client.user.setPresence({activity: {name: tokens[0].value, type: type ? <any>type : 'PLAYING'}, status: 'online'});
            return this.client.functions.sendEmbed(message, null, null, 'Presence Set', null,
                `Presence: **${tokens[0].value}**
                Type: ${type}`, null, null, null, null, null, 15000);
        } catch (err) {
            return this.client.functions.sendEmbed(message, null, null, 'Error Setting Presence', null, err.message);
        }
    }
}