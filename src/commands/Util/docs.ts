import Command from '../Command';
import SleepyClient from "../../index";
import {Message, MessageOptions} from "discord.js";
import request from 'node-superfetch';
import {Lexer, Parser, Args, longStrategy} from 'lexure';

export = class DocsCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'docs',
            description: 'Gets information from the discord.js docs',
            usages: ['docs <query>', 'docs <query> --src=[branch]'],
            examples: ['docs MessageType', 'docs Collection#find --src=collection'],
            params: ['<query> - The query you want to search', '[branch] - the branch you want to check'],
            category: 'Util',
            keepCommand: true
        });
    }

    async run(message: Message, args: string[]) {
        if (args[0]) {
            const lexer = new Lexer(args.join(' '));
            const res = lexer.lexCommand(() => 1);
            const tokens = res[1]();
            const parser = new Parser(tokens).setUnorderedStrategy(longStrategy());
            const out = parser.parse();
            const docArgs = new Args(<any>out);

            const query = args[0].replace(/#+/g, '.');
            const src = docArgs.option('src');

            const {body} = await request.get(`https://djsdocs.sorta.moe/v2/embed?src=${src || 'master'}&q=${query}`);

            return message.channel.send({embed: body} as MessageOptions);
        } else {
            return this.client.functions.sendEmbed(message, null, null, 'No query provided', null, 'Please provide a query');
        }
    }
}