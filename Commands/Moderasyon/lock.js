const { ChatInputCommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, ApplicationIntegrationType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Kanalı kitler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
    */
    async execute(interaction, client) {
        await interaction.deferReply();
        const { user, guild, channel } = interaction;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.editReply({ content: 'Sunucuda **Kanalları Yönet** yetkim bulunmuyor.' });

        await channel.permissionOverwrites.edit(guild.roles.everyone.id, {
            SendMessages: false
        });

        return await interaction.editReply({ content: `🔐 Kanal Kitlendi! Kitleyen: ${user}` });
    },
};