const { Message, Client, Events, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: Events.MessageDelete,
    /**
     * @param {Client} client
     * @param {Message} message
    */
    async execute(client, message) {
        if (message?.author?.bot) return;
        if (!message.guild || !message.content || !message.channel || !message.author || !message.createdTimestamp) return;

        client.snipes.set(message.guildId, {
            channel: message.channel.id,
            user: message.author.id,
            content: message.content,
            date: message.createdTimestamp
        });

        db.set(`snipe.${message.guildId}`, {
            channel: message.channel.id,
            user: message.author.id,
            content: message.content,
            date: message.createdTimestamp
        });

        const modLog = db.get(`modLog.${message.guildId}`);
        if (modLog) {
            const log = client.channels.cache.get(modLog);
            if (!log) return;

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setTitle('🗑️ Mesaj Silindi!')
                .addFields(
                    { name: 'Mesajın Sahibi', value: `${message.author} \`(${message.author.id})\``, inline: true },
                    { name: 'Silindiği Kanal', value: `${message.channel} \`(${message.channel.id})\``, inline: true },
                    { name: 'Silinme Tarihi', value: `<t:${client.mzr.timestamp(Date.now())}:R>`, inline: true },
                    { name: 'Mesajın İçeriği', value: message.content || 'Mesaj içeriği bulunamadı.', inline: false },
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: message.channel.name, iconURL: message.guild.iconURL() })

            await log.send({ embeds: [mzrEmbed] }).catch(() => { });
        };
    },
};