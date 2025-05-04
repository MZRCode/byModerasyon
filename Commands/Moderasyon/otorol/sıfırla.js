const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'otorol.sıfırla',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild } = interaction;

        const otorol = db.get(`otorol.${guild.id}`);
        if (!otorol) return await interaction.editReply(`Sunucuda özel otorol zaten ayarlanmamış.`);

        const rol = await guild.roles.fetch(otorol);
        if (!rol) return await interaction.editReply(`Otorol rolü bulunamadı.`);

        db.delete(`otorol.${guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Otorol sistemi başarıyla sıfırlandı.`)
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Sıfırlayan: ${user.username}`, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: 'Sıfırlayan', value: `${user} \`(${user.id})\``, inline: false },
                { name: 'Eski Otorol Rolü', value: `${rol} \`(${rol.id})\``, inline: false }
            )

        return await interaction.editReply({ embeds: [embed] });
    },
};