const { ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'otorol.ayarla',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, user, member, guild } = interaction;
        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.editReply({ content: 'Sunucuda **Rolleri Yönet** yetkim bulunmuyor.' });

        const rol = options.getRole('rol');

        const otorol = db.get(`otorol.${guild.id}`);
        if (otorol) return await interaction.editReply(`Sunucuda zaten otorol kurulu! Sıfırlamak için **/otorol sıfırla** komutunu kullanabilirsin.`);

        if (rol.position >= member.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol sizden daha yüksek yada sizinle aynı bir pozisyona sahip!' });
        if (rol.position >= guild.members.me.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol benim rolünden daha yüksek bir pozisyona sahip!' });
        if (rol.tags?.botId || rol.tags?.bot_id) return await interaction.editReply({ content: 'Bot rollerini otomatik rol olarak ayarlayamazsın!' });

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Otorol başarıyla ayarlandı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Ayarlayan: ${user.username}`, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: 'Ayarlayan', value: `${user} \`(${user.id})\``, inline: false },
                { name: 'Otorol Rolü', value: `${rol} \`(${rol.id})\``, inline: false }
            )

        db.set(`otorol.${guild.id}`, rol.id);

        return await interaction.editReply({ embeds: [embed] });
    },
};