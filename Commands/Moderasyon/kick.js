const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, ApplicationIntegrationType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Belirtilen üyeyi sunucudan atar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Atılacak üyeyi etiketleyin.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('sebep')
            .setDescription('Atma sebebini belirtin.')
            .setRequired(false)
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

        üye = await guild.members.fetch(üye.id).catch(() => null);

        try {
            if (!üye) return interaction.editReply({ content: 'Belirtilen üye sunucuda bulunmuyor!' });
            if (!üye.kickable) return interaction.editReply({ content: 'Bu üyeyi sunucudan atamam!' });
            if (!guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyeleri At** yetkim bulunmuyor.' });

            if (üye.id === member.id) return interaction.editReply({ content: 'Kendini sunucudan atamazsın!' });
            if (üye.id === client.user.id) return interaction.editReply({ content: 'Beni, benim komutum ile sunucudan atamazsın!' });
            if (üye.id === guild.ownerId) return interaction.editReply({ content: 'Sunucu sahibini, benim komutum ile atamazsın!' });

            if (üye.roles.highest.position >= member.roles.highest.position) return interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek bir role sahip!' });

            await üye.kick({ reason: sebep });
            return await interaction.editReply({ content: `${üye.user} başarıyla sunucudan atıldı! Sebep: **${sebep}**` });
        } catch {
            return interaction.editReply({ content: 'Belirtilen üye sunucuda bulunmuyor!' });
        };
    },
};