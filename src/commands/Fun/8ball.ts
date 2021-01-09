import Command from '../Command';
import SleepyClient from "../../index";
import {Message, MessageEmbed} from 'discord.js';

export = class EightBallCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: '8ball',
            description: 'Ask the magic 8ball a question',
            category: 'Fun'
        });
    }

    async run(message: Message, args: string[]) {
        const answers = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "No.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My reply is yes.",
            "My sources say no.",
            "My sources say yes.",
            "Outlook not so good.",
            "Outlook good.",
            "Very doubtful."
        ];

        const question = args.join(' ');
        if (!question) return this.client.functions.sendEmbed(message, null, null, 'No Question Asked', null,
            'Please provide a question to ask.', null, null, null, null, null, 15000);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail('https://images.sleepydurr.uk/util/8ball.png')
            .addField('Question', question)
            .addField('Answer', answers[Math.floor(Math.random() * answers.length)]);
        return message.channel.send(embed).then(msg => {
            if (message.guild) setTimeout(() => msg.delete(), 300000);
        });
    }
}