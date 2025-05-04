const { GuildBan, Client, Events, AuditLogEvent, EmbedBuilder } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: Events.GuildBanRemove,
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
                type: AuditLogEvent.MemberBanRemove,
            });

            const auditLog = fetchedLogs.entries.first();
            if (!auditLog) return;

            const { executor, target } = auditLog;
            if (target.id !== ban.user.id) return;

            const mzrEmbed = new EmbedBuilder()
                .setAuthor({ name: ban.user.username, iconURL: ban.user.displayAvatarURL() })
                .setTitle('✨ Üyenin Banı Kaldırıldı!')
                .addFields(
                    { name: 'Banı Kaldırılan Üye', value: `${ban.user} \`(${ban.user.id})\``, inline: true },
                    { name: 'Banı Kaldıran Yetkili', value: `${executor} \`(${executor.id})\``, inline: true },
                    { name: 'Ban Kaldırılma Tarihi', value: `<t:${client.mzr.timestamp(Date.now())}:R>`, inline: true },
                )
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL() })

            await log.send({ embeds: [mzrEmbed] }).catch(() => { });
        };
    },
};