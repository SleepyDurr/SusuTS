import Command from '../Command';
import {Message, MessageEmbed} from 'discord.js';
import {readdirSync} from "fs";
import SleepyClient from "../../index";

export = class HelpCommand extends Command {
    constructor(client: SleepyClient) {
        super(client, {
            name: 'help',
            description: 'Displays available commands or information about a specified command',
            aliases: ['commands', 'h'],
            usages: ['help [command]', 'help [module] --module'],
            examples: ['help ping', 'help moderation --module'],
            params: ['[command/module] - The name of the command/module'],
            category: 'Util'
        });
    }

    async run(message: Message, args: string[]) {
        const command = this.client.commands.get(args[0]) || this.client.aliases.get(args[0]);
        const server = this.client.db.get(`guild.${message.guild?.id || message.channel.id}`);

        if (args[0]) {
            if (command && !args[1]) {
                await this.client.functions.sendEmbed(message, null, null, `${command.name.charAt(0).toUpperCase() + command.name.slice(1)} ${command.nsfw ? '[nsfw]' : ''}`,
                    null, command.additionalInfo, null, null, 'Parameters: [] = optional, <> = required', null,
                    {'Description':{'value':command.description,'inline':false},
                        'Usages':{'value':Array.isArray(command.usages) ? command.usages.join('\n') : command.usages, 'inline': true},
                        'Aliases':{'value':command.aliases ? (<string[]>command.aliases).join('\n') : 'No aliases', 'inline':true},
                        'Examples':{'value':Array.isArray(command.examples) ? command.examples.join('\n') : command.examples, 'inline':true},
                        'Owner Only':{'value':command.ownerOnly ? '✅' : '❌', 'inline':true},
                        'Bot Owner Only':{'value':command.botOwnerOnly ? '✅' : '❌', 'inline':true},
                        'Globally Disabled':{'value':command.disabled ? '✅' : '❌', 'inline':true},
                        'Client Permissions':{'value':command.clientPermissions ? command.clientPermissions.join('\n') : 'No extra permissions required', 'inline':true},
                        'User Permissions':{'value':command.userPermissions ? command.userPermissions.join('\n') : 'No extra permissions required', 'inline':true},
                        'Parameters':{'value':command.params ? command.params.join('\n') : 'No parameters','inline':false}}, 120000);
            } else if (args[1] && ['--m', 'm', '--module', 'module'].includes(args[1].toLowerCase())) {
                try {
                    const files = readdirSync(`./src/commands/${args[0].toLowerCase().charAt(0).toUpperCase() + args[0].toLowerCase().slice(1)}`).filter(file => file.endsWith('.ts') || file.endsWith('.js')).map(file => file.replace('.ts', '') && file.replace('.js', ''));

                    if (files.length > 25) {
                        const firstArray = files.slice(0, 25);
                        const secondArray = files.slice(25, files.length);

                        const firstEmbed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} commands:`)
                            .setThumbnail(this.client.user.displayAvatarURL());
                        firstArray.forEach(file => {
                            firstEmbed.addField(file.charAt(0).toUpperCase() + file.slice(1), this.client.commands.get(file).description, true);
                        });

                        const secondEmbed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} commands:`)
                            .setThumbnail(this.client.user.displayAvatarURL());
                        secondArray.forEach(file => {
                            secondEmbed.addField(file.charAt(0).toUpperCase() + file.slice(1), this.client.commands.get(file).description, true);
                        });

                        try {
                            await message.author.send(firstEmbed);
                            return message.author.send(secondEmbed);
                        } catch {
                            return this.client.functions.sendEmbed(message, null, null, `${message.member.displayName}, allow DM's`, null,
                                `This module has ${files.length} commands which can only be sent to DM's to avoid being spammy in servers
                                Allow DM's so I can send them`, null, null, null, null, null, 60000);
                        }
                    } else {
                        const embed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} commands:`)
                            .setThumbnail(this.client.user.displayAvatarURL());
                        files.forEach(file => {
                            embed.addField(file.charAt(0).toUpperCase() + file.slice(1), this.client.commands.get(file).description, true);
                        });

                        return message.channel.send(embed).then(msg => {
                            if (message.guild) setTimeout(() => {
                                msg.delete();
                            }, 120000);
                        });
                    }
                } catch (err) {
                    return this.client.functions.sendEmbed(message, null, null, 'No command/module found', null,
                        `Please provide a correct command/module.
                    Examples: \`${server.prefix}help image\` (command) **OR** \`${server.prefix}help image --module\` (module -- displays all commands in the image module)`,
                        null, null, null, null, null, 30000);
                }
            }
        } else {
            const types = readdirSync('./src/commands').filter(file => !file.endsWith('.ts') && !file.endsWith('.js')).map(type => type[0].toUpperCase() + type.slice(1));

            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('My commands:')
                .setDescription(`For additional information on a command, type \`${server.prefix}help <command>\`
                For a list of commands in a module, type \`${server.prefix}help <module> --module\``);
            types.forEach(type => {
                embed.addField(`**❯ ${type}**`, `${this.client.commands.filter(c => c.category === type).map(c => c.name).join(', ')}`);
            });

            await message.author.send(embed).then(async () => {
                if (message.guild) return message.channel.send(`📧 | ${message.author} check your DM's`).then(msg => setTimeout(() => {msg.delete()}, 15000));
            }).catch(async () => { return message.channel.send(embed).then(msg => setTimeout(() => {msg.delete()}, 120000)) });
        }
    }
}