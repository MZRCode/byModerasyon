const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, MessageFlags, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Belirtilen üyenin timeout cezasını kaldırır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Timeoutu kaldırılacak üyeyi etiketleyin.')
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, user, member, guild } = interaction;

        const üye = options.getMember('üye');

        if (!üye.manageable) return interaction.editReply({ content: 'Bu üyeyi susturmasını kaldıramam!' });
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyelere Zaman Aşımı Uygula** yetkim bulunmuyor.' });

        if (üye.id === user.id) return interaction.editReply({ content: 'Kendine timeout atamazsın!' });
        if (üye.id === client.user.id) return interaction.editReply({ content: 'Beni, benim komutum ile timeout atamazsın!' });
        if (üye.id === guild.ownerId) return interaction.editReply({ content: 'Sunucu sahibine, benim komutum ile timeout atamazsın!' });

        if (üye.roles.highest.position >= member.roles.highest.position) return interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek yada sizinle aynı bir role sahip!' });
        if (!üye.communicationDisabledUntil) return interaction.editReply({ content: 'Bu üye zaten timeout cezası almamış!' });

        try {
            await üye.timeout(null);

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setColor('Blurple')
                .setDescription('Timeout cezası kaldırıldı.')
                .setTimestamp()
                .setFooter({ text: `Yetkili: ${user.username}`, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'Kaldıran Yetkili', value: `${user} \`(${user.id})\``, inline: true },
                    { name: 'Kaldırılan Üye', value: `${üye.user} \`(${üye.id})\``, inline: true }
                );

            return await interaction.editReply({ embeds: [mzrEmbed] });
        } catch {
            return interaction.editReply({ content: `Timeout atma işlemi sırasında bir hata oluştu.` });
        }
    },
};