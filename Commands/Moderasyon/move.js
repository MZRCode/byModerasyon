const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Üyeyi belirtilen ses kanalına taşır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Taşınacak üyeyi etiketleyin.')
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('Üyenin taşınacağı ses kanalını belirtin.')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { guild, options, user } = interaction;

        const üye = options.getMember('üye');
        const kanal = options.getChannel('kanal');

        if (!üye.voice.channel) return await interaction.editReply({ content: `Taşınması istenen üye ses kanalında bulunmuyor.` });
        if (!guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyeleri Taşı** yetkim bulunmuyor.' });
        if (!kanal.isVoiceBased()) return await interaction.editReply({ content: 'Seçtiğiniz kanal bir ses kanalı değil.' });
        if (!kanal.permissionsFor(guild.members.me).has(PermissionFlagsBits.Connect)) return await interaction.editReply({ content: 'Bu ses kanalına taşıma yetkim bulunmuyor.' });

        const eskiKanal = üye.voice.channel;

        try {
            await üye.voice.setChannel(kanal);

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setDescription(`Üye başarıyla ses kanalından taşındı.`)
                .setColor('Blurple')
                .setTimestamp()
                .setFooter({ text: `Taşıyan: ${user.username}`, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'Taşıyan Yetkili', value: `${user} (\`${user.id}\`)`, inline: true },
                    { name: 'Taşınan Üye', value: `${üye.user} (\`${üye.id}\`)`, inline: true },
                    { name: '\u200B', value: `\u200B`, inline: true },
                    { name: 'Eski Kanal', value: `${eskiKanal} (\`${eskiKanal.id}\`)`, inline: true },
                    { name: 'Yeni Kanal', value: `${kanal} (\`${kanal.id}\`)`, inline: true }
                );

            return await interaction.editReply({ embeds: [mzrEmbed] });
        } catch {
            return await interaction.editReply({ content: 'Kanala taşıma işlemi sırasında bir hata oluştu.' });
        }
    },
};