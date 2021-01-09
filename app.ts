import SleepyClient from './src/index';
import {config} from 'dotenv';
config();

const client: SleepyClient = new SleepyClient(process.env, {});

function init(): void {
    client.loadEvents();
    client.loadCommands();
    client.login(process.env['SLEEPY_TOKEN']);
}

init();