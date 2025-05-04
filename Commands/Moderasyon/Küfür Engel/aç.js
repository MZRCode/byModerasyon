const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'küfür-engel.aç',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild } = interaction;

        const küfürEngel = db.get(`küfürEngel.${guild.id}`);
        if (küfürEngel) return await interaction.editReply(`Sunucuda küfür engel sistemi zaten açılmış.`);

        db.set(`küfürEngel.${guild.id}`, true);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Küfür engel sistemi başarıyla açıldı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Açan: ${user.username}`, iconURL: user.displayAvatarURL() })

        return await interaction.editReply({ embeds: [embed] });
    },
};