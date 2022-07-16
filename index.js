const { Client, Collection } = require("discord.js");
const { REST }  = require( '@discordjs/rest');
const { Routes }  = require( 'discord-api-types/v9');
const { readdirSync }  = require( "fs");
const { Console } = require("console");
require( "dotenv").config();

const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
    ]
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

let commands = new Collection();
let commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for(let file of commandFiles) {
    let command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

(async() => {
    console.log("Refreshing slash commands...")
    try{
        await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commands.map(command => command.data) },
        );
    } catch(err) {
        console.log(`Refreshing slash commands failed. \n${err}`)
    }
    console.log("Finished refreshing slash commands")
})();

client.on("ready", () => {
    console.log("Bot started");
})

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    commands.get(interaction.commandName).run(client, interaction);
})

client.login(process.env.DISCORD_TOKEN);