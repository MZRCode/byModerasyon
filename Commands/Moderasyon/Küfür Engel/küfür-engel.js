const { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('küfür-engel')
        .setDescription('Küfür engel sistemi.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addSubcommand((options) => options
            .setName('aç')
            .setDescription('Küfür engel sistemini açar.')
        )
        .addSubcommand((options) => options
            .setName('kapat')
            .setDescription('Küfür engel sistemini kapatır.')
        )
}