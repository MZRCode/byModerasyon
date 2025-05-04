const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirtilen miktarda mesajı siler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addNumberOption(option => option
            .setName('miktar')
            .setDescription('Kaç mesaj silmek istediğinizi belirtin.')
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(1)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const { options, channel, user, guild } = interaction;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.editReply({ content: 'Sunucuda **Mesajları Yönet** yetkim bulunmuyor.' });

        const miktar = options.getNumber('miktar');
        let error = 0;

        await interaction.followUp(`**${miktar}** mesaj siliniyor...`);
        await channel.bulkDelete(miktar, true).catch(() => { error++; });

        if (error) {
            await interaction.deleteReply();
            await interaction.followUp(`**${miktar - error}** mesaj başarıyla silindi. Ancak **${error}** mesaj silinemedi.`);

            return
        } else {
            await interaction.deleteReply();
            await interaction.channel.send(`**${miktar}** mesaj başarıyla ${user} tarafından silindi.`);

            return;
        };
    },
};