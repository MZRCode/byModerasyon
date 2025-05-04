const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Üyenin ismini değiştirir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addUserOption(option => option
            .setName('üye')
            .setDescription('İsmi değiştirilecek üyeyi etiketleyin.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('isim')
            .setDescription('Üyenin yeni ismini girin.')
            .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, user, guild } = interaction;

        const üye = options.getMember('üye');
        const isim = options.getString('isim');

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) return await interaction.editReply({ content: 'Sunucuda **Takma Adları Yönet** yetkim bulunmuyor.' });

        try {
            const embed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setDescription(`Üyenin adı başarıyla değiştirildi.`)
                .addFields(
                    { name: 'Üye', value: `${üye.user} \`(${üye.id})\``, inline: false },
                    { name: 'Eski Adı', value: üye.displayName, inline: true },
                    { name: 'Yeni Adı', value: isim, inline: true },
                )
                .setColor('Blurple')
                .setFooter({ text: `Değiştiren: ${user.username}`, iconURL: user.displayAvatarURL() })
                .setTimestamp();

            await üye.setNickname(isim);

            return interaction.followUp({ embeds: [embed], allowedMentions: { parse: [] } });
        } catch {
            return interaction.followUp({ content: 'Bir hata oluştu. Üyenin adı düzenlenemiyor.' });
        }
    },
};