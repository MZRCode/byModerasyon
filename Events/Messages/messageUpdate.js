const { Message, Client, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: Events.MessageUpdate,
    /**
     * @param {Client} client
     * @param {Message} oldMessage
     * @param {Message} newMessage
    */
    async execute(client, oldMessage, newMessage) {
        if (newMessage?.author?.bot) return;
        if (!newMessage.guild || !newMessage.content || !newMessage.channel || !newMessage.author || !newMessage.createdTimestamp) return;

        const modLog = db.get(`modLog.${oldMessage.guildId}`);
        if (modLog) {
            const log = client.channels.cache.get(modLog);
            if (!log) return;

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL() })
                .setTitle('📝 Mesaj Düzenlendi!')
                .addFields(
                    { name: 'Mesajın Sahibi', value: `${newMessage.author} \`(${newMessage.author.id})\``, inline: true },
                    { name: 'Düzenlendiği Kanal', value: `${newMessage.channel} \`(${newMessage.channel.id})\``, inline: true },
                    { name: 'Düzenlenme Tarihi', value: `<t:${client.mzr.timestamp(Date.now())}:R>`, inline: true },
                    { name: 'Eski Mesajın İçeriği', value: oldMessage.content || 'Eski mesaj içeriği bulunamadı.', inline: false },
                    { name: 'Yeni Mesajın İçeriği', value: newMessage.content || 'Yeni mesaj içeriği bulunamadı.', inline: false }
                )
                .setColor('Blurple')
                .setTimestamp()
                .setFooter({ text: newMessage.channel.name, iconURL: newMessage.guild.iconURL() })

            const mzrRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Mesaja Git')
                    .setStyle(ButtonStyle.Link)
                    .setURL(newMessage.url)
                    .setEmoji('<:link:1345763488118607914>'));

            await log.send({ embeds: [mzrEmbed], components: [mzrRow] }).catch(() => { });
        };
    },
};