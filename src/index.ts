import {Client, ClientOptions, Collection} from 'discord.js';
import Functions from './util/Functions';
import Avatar from './util/Avatar';
import chalk from 'chalk';
import db from 'quick.db';
import {readdir, readdirSync, existsSync} from 'fs';
import {resolve} from 'path';
import {CommandOptions, SleepyDurrConfig} from "./structures/Interface";

export default class SleepyClient extends Client {
    public config: SleepyDurrConfig;
    public functions: Functions;
    public avatar: Avatar;
    public chalk: typeof chalk;
    public db: typeof db;
    public commands: Collection<string, CommandOptions>
    public aliases: Collection<string, CommandOptions>

    constructor(config: SleepyDurrConfig, options: ClientOptions = {}) {
        super(options);

        this.config = config;
        this.functions = new Functions(this);
        this.avatar = new Avatar();
        this.chalk = chalk;
        this.db = db;
        this.commands = new Collection();
        this.aliases = new Collection();
    }

    public loadEvents(): void {
        readdir('./src/events', (err:NodeJS.ErrnoException | null, files: string[]) => {
            if (err) return console.log(this.chalk.bgRed('Events folder could not be found, please add it.'));
            let events: string[] = [];
            files = files.filter(file => file.split('.').pop() === 'ts' || file.split('.').pop() === 'js');
            if (files.length === 0) throw new Error('No events found');
            files.forEach(file => {
                const eventName = file.substring(0, file.indexOf('.'));
                const event = require(resolve(`./src/events/${file}`));
                super.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(resolve(`./src/events/${file}`))];
                events.push(eventName);
            });
            console.log(this.chalk`{cyanBright [LISTENERS]} {magentaBright ${events.join(', ')}}`);
        });
    }

    public loadCommands(): void {
        if (!existsSync('./src/commands')) return console.error(this.chalk.bgRed('Commands folder not found, please add it'));

        readdirSync('./src/commands').filter(file => !file.endsWith('.ts') && !file.endsWith('.js')).forEach(directory => {
            const commands = readdirSync(resolve(`./src/commands/${directory}`)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            commands.forEach(file => {
                const Command = require(resolve(`./src/commands/${directory}/${file}`));
                const command = new Command(this);
                this.commands.set(command.name, command);
                if (command.aliases) {
                    if (Array.isArray(command.aliases)) command.aliases.forEach((alias: string) => this.aliases.set(alias, command));
                    else this.aliases.set(command.aliases, command);
                }
            });
        });
    }

    public loadCommand(path: string, file: string): void {
        const Command = require(resolve(`./src/commands/${path}/${file}`));
        const command = new Command(this);
        this.commands.set(command.name, command);
        if (command.aliases) {
            if (Array.isArray(command.aliases)) command.aliases.forEach((alias: string) => this.aliases.set(alias, command));
            else this.aliases.set(command.aliases, command);
        }
    }
}