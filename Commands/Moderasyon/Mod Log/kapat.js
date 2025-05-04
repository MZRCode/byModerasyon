const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'modlog.kapat',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild } = interaction;

        const modLog = db.get(`modLog.${guild.id}`);
        if (!modLog) return await interaction.editReply(`Sunucuda mod log sistemi zaten kapalı.`);

        db.delete(`modLog.${guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Mod log sistemi başarıyla kapatıldı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Kapatan: ${user.username}`, iconURL: user.displayAvatarURL() })

        return await interaction.editReply({ embeds: [embed] });
    },
};