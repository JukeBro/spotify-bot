module.exports = {
    "name": "ping",
    "data": {
        "name": "ping",
        "description": "Replies with pong!",
    },
    run: async (client, interaction) => {
        await interaction.reply("pong!");
    }
}