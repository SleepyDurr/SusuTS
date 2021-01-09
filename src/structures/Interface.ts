import {Guild} from "discord.js";

export interface Data {
    cmdName?: string,
    who?: string,
    data?: string[] | string,
    authorID?: string,
    channelID?: string,
    guild?: Guild
}

export interface CommandOptions {
    name?: string,
    description?: string,
    usages?: string[] | string,
    examples?: string[] | string,
    params?: string[] | null,
    aliases?: string[] | string | null,
    ownerOnly?: boolean,
    botOwnerOnly?: boolean,
    disabled?: boolean,
    guildOnly?: boolean,
    nsfw?: boolean,
    clientPermissions?: string[] | null,
    userPermissions?: string[] | null,
    additionalInfo?: string,
    category?: string,
    keepCommand?: boolean,
    run?: any
}

export interface SleepyDurrResults {
    image: {
        sfw: boolean,
        url: string
    }
}

export interface SleepyDurrConfig {
    SLEEPY_TOKEN?: string,
    SLEEPY_PREFIX?: string,
    OWNER_IDs?: string,
    MASTER_ID?: string
}

export interface CaseOptions {
    caseNumber: number,
    action: string,
    member_tag: string,
    member_id: string,
    reason: string | null,
    moderator: string,
    date: Date,
    banDuration?: number
}