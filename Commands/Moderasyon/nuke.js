const { ChatInputCommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, ApplicationIntegrationType, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, EmbedBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Kanalı silip tekrar oluşturarak tüm mesajları temizler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild, channel } = interaction;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.editReply({ content: 'Sunucuda **Kanalları Yönet** yetkim bulunmuyor.' });

        const mzrRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setEmoji('💣')
                .setCustomId('nukeOnay')
                .setLabel('Evet, Sil!')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setEmoji('<:downvote:1193618926224027709>')
                .setCustomId('nukeReddet')
                .setLabel('Hayır, İptal Et')
                .setStyle(ButtonStyle.Secondary));

        const mzrEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor('Yellow')
            .setTimestamp()
            .setTitle('⚠️ Bu işlem geri alınamaz!')
            .setDescription('Kanalı gerçekten silmek ve temizlemek istiyor musunuz?')
            .setFooter({ text: channel.name, iconURL: guild.iconURL() });

        const reply = await interaction.editReply({ embeds: [mzrEmbed], components: [mzrRow] });

        try {
            const onayMsg = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === user.id && (i.customId === 'nukeOnay' || i.customId === 'nukeReddet'),
                time: 10000,
                componentType: ComponentType.Button
            });

            if (onayMsg.customId === 'nukeOnay') {
                await onayMsg.update({ content: `Kanal ${user} tarafından nukeleniyor...`, components: [], embeds: [] });

                const channelName = channel.name;
                const newChannel = await channel.clone({
                    name: channelName,
                    position: channel.position,
                    parent: channel.parentId,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    permissionOverwrites: channel.permissionOverwrites.cache,
                    reason: `${user.username} tarafından nuke işlemi gerçekleşti`
                });

                await channel.delete(`Kanal ${user.username} tarafından nukelendi!`);
                await newChannel.send(` Kanal ${user} tarafından nukelendi!`);

                await interaction.followUp({ content: `**${channelName}** kanalı başarıyla temizlendi!`, flags: [MessageFlags.Ephemeral] });
            } else {
                await interaction.deleteReply();
            };
        } catch {
            await interaction.editReply({ content: 'Süre doldu. İşlem iptal edildi.', components: [], embeds: [] }).catch(() => { });
        }
    },
};