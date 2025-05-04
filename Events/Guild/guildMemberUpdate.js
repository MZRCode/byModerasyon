const { GuildMember, Client, Events, EmbedBuilder } = require('discord.js');
const mzr = require('mzrdjs');
const db = require('mzrdb');

module.exports = {
    name: Events.GuildMemberUpdate,
    /**
     * @param {Client} client
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
    */
    async execute(client, oldMember, newMember) {
        if (newMember?.user?.bot) return;

        const modLog = db.get(`modLog.${newMember.guild.id}`);
        if (modLog) {
            const log = client.channels.cache.get(modLog);
            if (!log) return;

            if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
                const mzrEmbed = new EmbedBuilder()
                    .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL() })
                    .setTitle('🗞️ Üye Rolleri Güncellendi!')
                    .addFields(
                        { name: 'Rolleri Güncellenen', value: `${newMember.user} \`(${newMember.user.id})\``, inline: true },
                        { name: 'Düzenlenme Tarihi', value: `<t:${client.mzr.timestamp(Date.now())}:R>`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Eski Rolleri', value: `${oldMember.roles.cache.filter(rol => rol.id !== newMember.guild.id).map(rol => `<@&${rol.id}>`).join(', ') || 'Üyenin eski rolleri alınamadı.'}`, inline: false },
                        { name: 'Yeni Rolleri', value: `${newMember.roles.cache.filter(rol => rol.id !== newMember.guild.id).map(rol => `<@&${rol.id}>`).join(', ') || 'Üyenin yeni rolleri alınamadı.'}`, inline: false }
                    )
                    .setColor('Blurple')
                    .setTimestamp()
                    .setFooter({ text: newMember.guild.name, iconURL: newMember.guild.iconURL() })

                await log.send({ embeds: [mzrEmbed] }).catch(() => { });
            };

            if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
                let title = '';
                let message = '';
                let duration = newMember.communicationDisabledUntilTimestamp ? mzr.ms(newMember.communicationDisabledUntilTimestamp - Date.now(), { lang: 'tr' }) : 'Bilinmiyor.';

                if (newMember.communicationDisabledUntil) {
                    title = '🚫 Timeout Cezası Aldı!';
                    message = `${newMember.user} üyesi **${duration}** boyunca sürecek bir timeout cezası aldı.`;
                } else {
                    title = '🎙️ Timeout Cezası Kaldırıldı!';
                    message = `🎙️ **@${newMember.user.tag}** üyesinin timeout cezası kaldırıldı.`;
                };

                const mzrEmbed = new EmbedBuilder()
                    .setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL() })
                    .setTitle(title)
                    .setDescription(message)
                    .setColor(newMember.communicationDisabledUntil ? 'Red' : 'Green')
                    .setTimestamp()
                    .setFooter({ text: newMember.guild.name, iconURL: newMember.guild.iconURL() })

                await log.send({ embeds: [mzrEmbed] }).catch(() => { });
            };
        };
    },
};