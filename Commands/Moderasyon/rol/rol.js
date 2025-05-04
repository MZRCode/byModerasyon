const { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol')
        .setDescription('Rol işlemleri yapmanızı sağlar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addSubcommand((options) => options
            .setName('ver')
            .setDescription('Belirlediğiniz üyeye belirlediğiniz rolü verir.')
            .addUserOption(option => option
                .setName('üye')
                .setDescription('Rol verilecek üyeyi etiketleyin.')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('rol')
                .setDescription('Verilecek rolü etiketleyin.')
                .setRequired(true)
            )
        )
        .addSubcommand((options) => options
            .setName('al')
            .setDescription('Belirlediğiniz üyeden belirlediğiniz rolü alır.')
            .addUserOption(option => option
                .setName('üye')
                .setDescription('Rol alınacak üyeyi etiketleyin.')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('rol')
                .setDescription('Alınacak rolü etiketleyin.')
                .setRequired(true)
            )
        )
}