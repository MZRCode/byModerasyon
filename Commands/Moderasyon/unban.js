const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Belirtilen kullanıcının banını açar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
        .addStringOption(option => option
            .setName('kullanıcı')
            .setDescription('Banını açmak istediğiniz kullanıcının ID\'sini girin.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('sebep')
            .setDescription('Ban açma sebebini belirtin.')
            .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { guild, options } = interaction;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.editReply({ content: 'Sunucuda **Üyeleri Engelle** yetkim bulunmuyor.' });

        const userId = options.getString('kullanıcı');
        const sebep = options.getString('sebep') || 'Belirtilmedi!';

        await guild.bans.remove(userId, sebep).then((user) => {
            return interaction.editReply({ content: `**${user.username}** kullanıcısının banını başarıyla açtım!\nSebep: **${sebep}**` });
        }).catch((err) => {
            if (err.code === 10026) return interaction.editReply({ content: 'Bu kullanıcı zaten bu sunucudan banlı değil!' });
            else return interaction.editReply({ content: `**${userId}** ID'li üyenin banını açamadım, bir sorun oluştu.` });
        });
    },
};