const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, MessageFlags, EmbedBuilder } = require("discord.js");
const mzr = require('mzrdjs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Belirtilen üyeyi belirtilen süre kadar timeout atar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Timeout atılacak üyeyi etiketleyin.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('süre')
            .setDescription('Atılacak timeoutun süresini belirtin.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('sebep')
            .setDescription('Timeout sebebini belirtin.')
            .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, user, member, guild } = interaction;

        const üye = options.getMember('üye');
        const süre = options.getString('süre');
        const sebep = options.getString('sebep') || 'Yok';
        const süreMS = mzr.ms(süre);

        if (!üye.manageable) return interaction.editReply({ content: 'Bu üyeyi susturamam!' });
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyelere Zaman Aşımı Uygula** yetkim bulunmuyor.' });
        if (süreMS > mzr.ms('28d')) return interaction.editReply({ content: '**28 Günden** uzun bir süreli timeout atamam!' });

        if (üye.communicationDisabledUntil) return interaction.editReply({ content: 'Bu üye zaten timeout cezası almış!' });
        if (üye.id === user.id) return interaction.editReply({ content: 'Kendine timeout atamazsın!' });
        if (üye.id === client.user.id) return interaction.editReply({ content: 'Beni, benim komutum ile timeout atamazsın!' });
        if (üye.id === guild.ownerId) return interaction.editReply({ content: 'Sunucu sahibine, benim komutum ile timeout atamazsın!' });

        if (üye.roles.highest.position >= member.roles.highest.position) return interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek yada sizinle aynı bir role sahip!' });

        try {
            await üye.timeout(süreMS, sebep);

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setColor('Blurple')
                .setDescription('Timeout cezası verildi.')
                .setTimestamp()
                .setFooter({ text: `Yetkili: ${user.username}`, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'Cezayı Veren Yetkili', value: `${user} \`(${user.id})\``, inline: true },
                    { name: 'Cezayı Alan Üye', value: `${üye.user} \`(${üye.id})\``, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: 'Cezanın Süresi', value: `${mzr.ms(süreMS, { lang: 'tr' })}`, inline: true },
                    { name: 'Cezanın Sebebi', value: sebep, inline: true }
                );

            return await interaction.editReply({ embeds: [mzrEmbed] });
        } catch {
            return interaction.editReply({ content: `Timeout atma işlemi sırasında bir hata oluştu.` });
        }
    },
};