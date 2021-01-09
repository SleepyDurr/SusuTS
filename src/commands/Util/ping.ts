import SleepyClient from "../../index";
import Command from "../Command";
import {Message, MessageEmbed} from "discord.js";

export = class PingCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'ping',
            description: 'Pings the bot',
            category: 'Util'
        });
    }

    async run(message: Message) {
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('....');

        const msg = await message.channel.send(embed);
        embed.description = `It took me ${msg.createdTimestamp - message.createdTimestamp}ms to respond.
            WebSocket latency: ${message.client.ws.ping}ms`;

        await msg.edit(embed).then(m => setTimeout(() => {m.delete()}, 60000));
    }
}