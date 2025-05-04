const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'reklam-engel.kapat',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild } = interaction;

        const reklamEngel = db.get(`reklamEngel.${guild.id}`);
        if (!reklamEngel) return await interaction.editReply(`Sunucuda reklam engel sistemi zaten kapalı.`);

        db.delete(`reklamEngel.${guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Reklam engel sistemi başarıyla kapatıldı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Kapatan: ${user.username}`, iconURL: user.displayAvatarURL() })

        return await interaction.editReply({ embeds: [embed] });
    },
};