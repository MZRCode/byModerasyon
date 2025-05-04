const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'küfür-engel.kapat',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild } = interaction;

        const küfürEngel = db.get(`küfürEngel.${guild.id}`);
        if (!küfürEngel) return await interaction.editReply(`Sunucuda küfür engel sistemi zaten kapalı.`);

        db.delete(`küfürEngel.${guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Küfür engel sistemi başarıyla kapatıldı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Kapatan: ${user.username}`, iconURL: user.displayAvatarURL() })

        return await interaction.editReply({ embeds: [embed] });
    },
};