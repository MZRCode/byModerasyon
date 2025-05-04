const { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reklam-engel')
        .setDescription('Reklam engel sistemi.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addSubcommand((options) => options
            .setName('aç')
            .setDescription('Reklam engel sistemini açar.')
        )
        .addSubcommand((options) => options
            .setName('kapat')
            .setDescription('Reklam engel sistemini kapatır.')
        )
}