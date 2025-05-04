const { SlashCommandBuilder, PermissionFlagsBits, ApplicationIntegrationType } = require('discord.js');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Bot sahibi özel yeniden başlatma komutu.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
        .addSubcommand((options) => options
            .setName('events')
            .setDescription('Eventleri yeniden başlatır.')
        )
        .addSubcommand((options) => options
            .setName('commands')
            .setDescription('Komutları yeniden başlatır.')
        )
        .addSubcommand((options) => options
            .setName('command')
            .setDescription('Komutu yeniden başlatır.')
            .addStringOption(opt => opt
                .setName('komut')
                .setDescription('Yeniden başlatılacak komutun adını girin.')
                .setRequired(true)
            )
        ),
}










































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!