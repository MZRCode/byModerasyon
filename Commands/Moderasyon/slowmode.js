const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType } = require("discord.js");
const mzr = require('mzrdjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Kanala belirtilen süre aralığında mesaj yazma sınırı ekler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addStringOption(option => option
            .setName('süre')
            .setDescription('Kanalda mesaj yazma sınırı olacak süreyi belirtin. (5sa = 5 saat & 5h = 5 saat)')
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, channel, guild } = interaction;
        if (!channel.manageable) return interaction.editReply({ content: `Bu kanala slowmode atamam! Yeterli yetkiye sahip değilim.` });
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.editReply({ content: 'Sunucuda **Kanalları Yönet** yetkim bulunmuyor.' });

        const time = options.getString('süre');
        const sixHour = mzr.ms('6h');

        if (time.startsWith('0')) {
            await channel.setRateLimitPerUser(0);
            return await interaction.editReply({ content: `Kanaldan slowmode başarıyla kaldırıldı!` });
        };

        const timeMs = mzr.ms(time);
        if (!timeMs) return interaction.editReply({ content: `Lütfen geçerli bir süre belirtin!` });

        const süreSec = mzr.timestamp(timeMs);
        const süre = mzr.ms(timeMs, { lang: 'tr' });

        if (timeMs > sixHour) return interaction.editReply({ content: `Süre en fazla **6 saat** olabilir!` });

        await channel.setRateLimitPerUser(süreSec);
        return await interaction.editReply({ content: `Kanalda slowmode başarıyla ayarlandı: **${süre}**` });
    },
};