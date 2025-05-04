const { ChatInputCommandInteraction, SlashCommandBuilder, Client, ApplicationIntegrationType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun pingini öğrenmek için kullanabilirsiniz.')
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        const initialResponse = await interaction.reply({ content: '**Yükleniyor..**', flags: [MessageFlags.Ephemeral] });

        setTimeout(async () => {
            await initialResponse.edit({ content: `🏓 Pingim: **${client.ws.ping}ms**` });
        }, 1000);
    },
};