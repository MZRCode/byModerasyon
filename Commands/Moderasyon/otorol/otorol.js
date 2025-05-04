const { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('otorol')
        .setDescription('Sunucuya katılan üyelere otomatik rol veren sistemi kurarsınız.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addSubcommand((options) => options
            .setName('ayarla')
            .setDescription('Sunucuya katılan üyeye verilecek rolü ayarlar.')
            .addRoleOption(option => option
                .setName('rol')
                .setDescription('Otomatik verilecek rolü etiketleyin.')
                .setRequired(true)
            )
        )
        .addSubcommand((options) => options
            .setName('sıfırla')
            .setDescription('Sunucuya katılan üyeye verilecek rolü sıfırlar.')
        )
}