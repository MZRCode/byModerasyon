const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    subCommand: 'modlog.aç',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { user, guild, options } = interaction;

        const kanal = options.getChannel('kanal');

        const modLog = db.get(`modLog.${guild.id}`);
        if (modLog) return await interaction.editReply(`Sunucuda mod log sistemi zaten açılmış.`);

        db.set(`modLog.${guild.id}`, kanal.id);

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setDescription(`Mod log sistemi başarıyla açıldı.`)
            .addFields(
                { name: 'Log Kanalı', value: `${kanal} \`(${kanal.id})\``, inline: true }
            )
            .setColor('Blurple')
            .setTimestamp()
            .setFooter({ text: `Açan: ${user.username}`, iconURL: user.displayAvatarURL() })

        return await interaction.editReply({ embeds: [embed] });
    },
};