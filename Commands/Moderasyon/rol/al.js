const { ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    subCommand: 'rol.al',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await interaction.deferReply();

        const { options, user, member, guild } = interaction;

        const rol = options.getRole('rol');
        let üye = options.getMember('üye');
        üye = await üye.fetch();

        if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.editReply({ content: 'Sunucuda **Rolleri Yönet** yetkim bulunmuyor.' });
        if (üye.id === user.id) return await interaction.editReply({ content: 'Kendinden rol alamazsın!' });
        if (üye.id === client.user.id) return await interaction.editReply({ content: 'Benim komutum ile benden rol alamazsın!' });
        if (member.roles.highest.position <= üye.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek yada sizinle aynı bir role sahip!' });
        if (rol.position >= member.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol sizden daha yüksek yada sizinle aynı bir pozisyona sahip!' });
        if (rol.position >= guild.members.me.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol benim rolünden daha yüksek bir pozisyona sahip!' });
        if (!üye.roles.cache.has(rol.id)) return await interaction.editReply({ content: `Bu üye bu role zaten sahip değil.` });
        if (rol.tags?.botId || rol.tags?.bot_id) return await interaction.editReply({ content: 'Botlardan onlara özel olan rollerini alamazsın!' });

        try {
            await üye.roles.remove(rol);

            const embed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setDescription(`Üyeden başarıyla rol alındı.`)
                .setColor('Blurple')
                .setTimestamp()
                .setFooter({ text: `Rolü Alan: ${user.username}`, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'Rolü Alan', value: `${user} \`(${user.id})\``, inline: false },
                    { name: 'Rolü Alınan', value: `${üye} \`(${üye.id})\``, inline: false },
                    { name: 'Alınan Rol', value: `${rol}`, inline: false }
                )

            return await interaction.editReply({ embeds: [embed] });
        } catch {
            return await interaction.editReply({ content: 'Rol alma işlemi sırasında bir hata oluştu.' });
        }
    },
};