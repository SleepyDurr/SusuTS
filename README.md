<img width="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="Susu" src="https://images.sleepydurr.uk/util/SleepyDurr.png">

# Susu-Chan
Susu-Chan is a multi-purpose discord bot with commands ranging from moderation, roleplay, to random images.

## Table of Contents

- [Commands](#commands)
    * [Avatar Manipulation](#avatar-manipulation)
    * [Bot Owner](#bot-owner)
    * [Configuration](#configuration)
    * [Fun](#fun)
    * [Image](#image)
    * [Info](#info)
    * [Moderation](#moderation)
    * [NSFW](#NSFW)
    * [Roleplay](#roleplay)
    * [Util](#util)
  
## Commands
### Avatar Manipulation
All avatar manipulation commands can be executed like so:
[command] or [command] [userMention/ID]
* **avatar-fusion** - Combines the users avatar without another users avatar
* **blur** - Blurs the users avatar
* **bob-ross** - Draws the avatar on Bob Ross' canvas
* **brazzers** - Places the brazzers logo on the avatar
* **charcoal** - Draws the avatar with charcoal
* **circle** - Draws the avatar as a circle
* **communist** - Places the communist flag over the avatar
* **contrast** - Draws the avatar with increased contrast
* **dexter** - Draws the avatar on the dexter from Pokemon
* **distort** - Draws the avatar but distorted
* **emboss** - Draws the avatar but embossed
* **fire-frame** - Draws a frame burning around the avatar
* **fish-eye** - Draws the avatar with a fish-eye lens effect
* **frame** - Draws a frame around the avatar
* **ghost** - Draws the avatar with a ghost-like transparency
* **glass-shatter** - Draws the avatar with a glass shatter effect
* **glitch** - Draws the avatar with a glitch effect
* **greyscale** - Draws the avatar with greyscale effect
* **gun** - Gives the avatar a gun
* **hands** - Gives the avatar a set of hands
* **ifunny** - Places the ifunny logo on the avatar
* **implode** - Implodes the avatar
* **invert** - Inverts the avatar
* **liquid-rescale** - Draws the avatar with a liquid effect
* **noise** - Adds noise to the avatar
* **oil-painting** - Draws the avatar with oil paints
* **pixelize** - Pixelizes the avatar
* **police-tape** - Draws police tape over the avatar
* **rainbow** - Draws the rainbow colors over the avatar
* **rejected** - Stamps the avatar with 'Rejected'
* **santa** - Places a santa hat on the avatar
* **sepia** - Draws the avatar with sepia effect
* **simp** - Stamps the avatar with 'Simp'
* **wanted** - Draws the avatar on a wanted poster
* **you-died** - Draws the 'You-Died' screen over the avatar

### Bot Owner
These commands can only be executed by the person hosting the bot
* **leave-server** - Leaves a guild
  * leave-server [ID]
* **log-commands** - Enables/disables the logging of executed commands
  * log-commands [enable/disable]
* **reload** - Reloads a command
  * reload [command_name]
* **restart** - Restarts the bot
* **set-avatar** - Sets the client users avatar
  * set-avatar [link]
* **set-presence** - Sets the client users presence
  * set-presence [type] [presence]
* **set-username** - Sets the client users username
  * set-username [username]
  
### Configuration
* **disable-channel** - Disables a channel so that commands can't be executed in it
  * disable-channel [channelMention/ID]
* **disable-command** - Disables a command so that it can no longer be executed
  * disable-command [commandName]
* **enable-channel** - Enables a channel so that commands can be executed in it
  * enable-channel [channelMention/ID]
* **enable-command** - Enables a command so that it can be executed again
  * enable-command [commandName]
* **modlog** - Set a moderation channel where moderation actions will log to
  * modlog [channelName/channelID/channelMention]
  * modlog disable
* **set-prefix** - Changes the prefix on the guild instead of using the default
  * set-prefix [prefix]
  
### Fun
* **8ball** - Asks the magic 8ball a question
  * 8ball [question]
* **cat-fact** - Displays a random fact about cats
* **dog-fact** - Displays a random fact about dogs
* **meme** - Displays a random meme from memes, dankmemes, or me_irl subreddits

### Image
* **bear** - Displays a random image of a bear
* **bird** - Displays a random image of a bird
* **bunny** - Displays a random image of a bunny
* **cat** - Displays a random image of a cat
* **dog** - Displays a random image of a dog
* **duck** - Displays a random image of a duck
* **fox** - Displays a random image of a fox
* **image** - Displays a random image from a provided tag
  * image [tag]
  * image list
* **sfurry** - Displays a random SFW furry image from a provided tag
  * sfurry [tag]
  * sfurry list
* **shibe** - Displays a random image of a Shiba Inu
* **wolf** - Displays a random image of a wolf

### Info
* **about** - Displays information about the developer
* **oldest-user** - Displays who the oldest user is on the guild
* **server-info** - Displays information about the server
* **user-info** - Displays information about yourself, or a specified user
  * user-info [username/nickname/mention/ID]
  
### Moderation
* **ban** - Bans a user from the guild - set days to 0 if you don't want to delete messages
  * ban [mention/ID] [days (0-7)] [reason],
* **hack-ban** - Bans a user even if they aren't in the guild
  * hack-ban [ID] [reason]
* **kick** - Kicks a user from the guild
  * kick [mention/ID] [reason]
* **softban** - Bans a user from the guild, deletes their messages from the last x days, and then unbans
  * softban [mention/ID] [days (0-7)] [reason]
* **tempban** - Bans a user from the guild temporarily
  * tempban [mention/ID] [duration (d, h, m, s)] [reason]
* **unban** - Unbans a user from the guild
  * unban [ID]
  
### NSFW
* **anime** - Displays a random NSFW anime image from a provided tag
  * anime [tag]
  * anime list
* **human** - Displays a random NSFW IRL image from a provided tag
  * human [tag]
  * human list
* **nfurry** - Displays a random NSFW furry image from a provided tag
  * nfurry [tag]
  * nfurry list

### Roleplay
* **baka** - Calls a member a baka
  * baka [username/nickname/mention/ID/any_text]
* **bite** - Bites a member
  * bite [username/nickname/mention/ID/any_text]
* **hug** - Hugs a member
  * hug [username/nickname/mention/ID/any_text]
* **kiss** - Kisses a member
  * kiss [username/nickname/mention/ID/any_text]
* **lick** - Licks a member
  * lick [username/nickname/mention/ID/any_text]
* **pat** - Pats a member
  * pat [username/nickname/mention/ID/any_text]
* **poke** - Pokes a member
  * poke [username/nickname/mention/ID/any_text]
* **slap** - Slaps a member
  * slap [username/nickname/mention/ID/any_text]
* **tickle** - Tickles a member
  * tickle [username/nickname/mention/ID/any_text]
  
### Util
* **avatar** - Displays your avatar or a specified members
  * avatar [username/nickname/mention/ID]
* **docs** - Gets information from the Discord.js docs
  * docs [query] --src=[src]
* **help** - Displays a list of commands, commands in a specified module, or information about a command
  * help [module] --module
  * help [command]
* **invite** - Displays invite link so that you can invite Susu to your own guild
* **ping** - Checks the bots latency
* **purge** - Deletes x amount of messages (need MANAGE_MESSAGES permission)
  * purge [amount]