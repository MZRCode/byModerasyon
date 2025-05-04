const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, ApplicationIntegrationType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirtilen üyeyi sunucudan banlar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Banlanacak üyeyi etiketleyin.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('sebep')
            .setDescription('Ban sebebini belirtin.')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('mesaj-sil')
            .setDescription('Banlanan üyenin mesajlarını siler. (1-7 gün arasında)')
            .setRequired(false)
            .addChoices(
                { name: 'Hiçbir Şey Silme', value: '0' },
                { name: 'Önceki Saat', value: '1' },
                { name: 'Önceki 6 Saat', value: '6' },
                { name: 'Önceki 12 Saat', value: '12' },
                { name: 'Önceki 24 Saat', value: '24' },
                { name: 'Önceki 3 Gün', value: '72' },
                { name: 'Önceki 7 Gün', value: '168' }

            )
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, guild, member } = interaction;

        let üye = options.getMember('üye');
        const sebep = options.getString('sebep') || 'Belirtilmedi!';
        const mesajSil = (options.getString('mesaj-sil') ? parseInt(options.getString('mesaj-sil')) * 3600 : 0) || 0;

        üye = await guild.members.fetch(üye.id).catch(() => null);

        try {
            if (!üye) return interaction.editReply({ content: 'Belirtilen üye sunucuda bulunmuyor!' });
            if (!üye.bannable) return interaction.editReply({ content: 'Bu üyeyi banlayamam!' });
            if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyeleri Engelle** yetkim bulunmuyor.' });

            if (üye.id === member.id) return interaction.editReply({ content: 'Kendini banlayamazsın!' });
            if (üye.id === client.user.id) return interaction.editReply({ content: 'Beni, benim komutum ile banlıyamazsın!' });
            if (üye.id === guild.ownerId) return interaction.editReply({ content: 'Sunucu sahibini, benim komutum ile banlıyamazsın!' });

            if (üye.roles.highest.position >= member.roles.highest.position) return interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek bir role sahip!' });

            await üye.ban({ reason: sebep, deleteMessageSeconds: mesajSil });
            return await interaction.editReply({ content: `${üye.user} başarıyla banlandı! Sebep: **${sebep}**`, allowedMentions: { parse: [] } });
        } catch {
            return interaction.editReply({ content: 'Belirtilen üye sunucuda bulunmuyor!' });
        };
    },
};

































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!