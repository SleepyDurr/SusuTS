import SleepyClient from "../index";
import {stripIndents} from 'common-tags';
import {TextChannel} from "discord.js";
import moment from "moment";

export = async (client: SleepyClient) => {
    console.log(stripIndents(client.chalk`{cyanBright [READY]} {magentaBright Logged in as ${client.user.tag} [ID: ${client.user.id}]}
    {cyanBright [GUILD STATS]} {magentaBright Active in} {greenBright ${client.guilds.cache.size}} {magentaBright guilds [}{greenBright ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}} {magentaBright members]}
    {cyanBright [BOT STATS]} {greenBright ${client.commands.size}} {magentaBright commands}`));

    await client.user.setActivity('over the cuties :3', {type: "WATCHING"});

    if (!client.db.get('bans')) {
        await new client.db.table('bans');
    }

    setInterval(async () => {
        for (const [, guild] of client.guilds.cache) {
            if (!client.db.get(`bans.${guild.id}`)) client.db.set(`bans.${guild.id}.infractions`, []);

            const infractions = client.db.get(`bans.${guild.id}.infractions`);
            for (const infraction of infractions) {
                const time = infraction.bantime - Date.now();
                if (time < 0) {
                    const guild = await client.guilds.fetch(infraction.guild);
                    const ban = await guild.fetchBans();
                    if (ban.has(infraction.member)) await guild.members.unban(infraction.member);

                    let arrayIndex = infractions.indexOf(infraction);
                    infractions.splice(arrayIndex, 1);
                    client.db.set(`bans.${infraction.guild}.infractions`, infractions);

                    const modlog = await (await client.guilds.fetch(infraction.guild)).channels.cache.get(client.db.get(`guild.${infraction.guild}.modLogChannel`)) as TextChannel;

                    if (modlog && ban.has(infraction.member)) {
                        return client.functions.sendToChannel(modlog, 'Member Unbanned',
                            `Member: ${infraction.tag} [${infraction.member}]
            Ban issued: ${moment.utc(infraction.date).format("dddd, MMMM Do YYYY | HH:mm:ss")}
            Reason: ${infraction.reason ? infraction.reason : 'No reason provided'}
            Moderator: ${(await client.users.fetch(infraction.moderator)).tag}`)
                    }
                }
            }
        }
    }, 10000);
}