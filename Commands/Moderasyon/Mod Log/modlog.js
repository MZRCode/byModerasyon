const { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Mod log sistemi.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addSubcommand((options) => options
            .setName('aç')
            .setDescription('Mod log sistemini açar.')
            .addChannelOption(option => option
                .setName('kanal')
                .setDescription('Mod log kanalını etiketleyin.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand((options) => options
            .setName('kapat')
            .setDescription('Mod log sistemini kapatır.')
        )
}