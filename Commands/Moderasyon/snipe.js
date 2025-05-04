const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client, ApplicationIntegrationType, EmbedBuilder } = require('discord.js');
const mzr = require('mzrdjs');
const db = require('mzrdb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Son silinen mesajı gösterir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { guild } = interaction;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.editReply({ content: 'Sunucuda **Mesajları Yönet** yetkim bulunmuyor.' });

        let data = client.snipes.get(`${guild.id}`);
        if (!data) data = db.get(`snipe.${guild.id}`) || null;
        if (!data) return interaction.followUp({ content: 'Hiçbir mesaj silinmemiş.' });

        const snipeChannel = client.channels.cache.get(data.channel);
        if (!snipeChannel) return interaction.followUp({ content: 'Mesajın silindiği kanal bulunamadı.' });

        const snipeUser = await client.users.fetch(data.user).catch(() => null);
        if (!snipeUser) return interaction.followUp({ content: 'Mesajı atan kullanıcı bulunamadı.' });

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: snipeUser.username, iconURL: snipeUser.displayAvatarURL(), url: `https://discord.com/users/${snipeUser.id}` })
            .setTitle('Son Silinen Mesaj Bilgileri')
            .addFields(
                { name: `Mesaj Sahibi`, value: `${snipeUser} \`(${snipeUser.id})\``, inline: true },
                { name: `Mesajın Yazıldığı Kanal`, value: `${snipeChannel}`, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
                { name: `Silinme Tarihi`, value: `<t:${mzr.timestamp(data.date)}:f> (<t:${mzr.timestamp(data.date)}:R>)`, inline: false },
                { name: `Mesajın İçeriği`, value: data.content, inline: false },
            )
            .setTimestamp(data.date)
            .setFooter({ text: `Son silinen mesaj hakkında bilinen bilgiler` });

        return await interaction.followUp({ embeds: [embed] });
    },
};