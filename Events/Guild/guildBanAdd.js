const { GuildBan, Client, Events, AuditLogEvent, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: Events.GuildBanAdd,
    /**
     * @param {Client} client
     * @param {GuildBan} ban
    */
    async execute(client, ban) {
        if (ban?.user?.bot) return;

        const modLog = db.get(`modLog.${ban.guild.id}`);
        if (modLog) {
            const log = client.channels.cache.get(modLog);
            if (!log) return;

            const fetchedLogs = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            });

            const auditLog = fetchedLogs.entries.first();
            if (!auditLog) return;

            const { executor, target } = auditLog;
            if (target.id !== ban.user.id) return;

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: ban.user.username, iconURL: ban.user.displayAvatarURL() })
                .setTitle('🚫 Üye Banlandı!')
                .addFields(
                    { name: 'Banlanan Üye', value: `${ban.user} \`(${ban.user.id})\``, inline: true },
                    { name: 'Banlayan Yetkili', value: `${executor} \`(${executor.id})\``, inline: true },
                    { name: 'Banlanma Tarihi', value: `<t:${client.mzr.timestamp(Date.now())}:R>`, inline: true },
                )
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL() })

            await log.send({ embeds: [mzrEmbed] }).catch(() => { });
        };
    },
};