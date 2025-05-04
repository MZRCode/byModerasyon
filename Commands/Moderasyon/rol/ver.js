const { ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    subCommand: 'rol.ver',
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
        if (üye.id === user.id) return await interaction.editReply({ content: 'Kendine rol veremezsin!' });
        if (üye.id === client.user.id) return await interaction.editReply({ content: 'Benim komutum ile bana rol veremezsin!' });
        if (member.roles.highest.position <= üye.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz üye sizden daha yüksek yada sizinle aynı bir role sahip!' });
        if (rol.position >= member.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol sizden daha yüksek yada sizinle aynı bir pozisyona sahip!' });
        if (rol.position >= guild.members.me.roles.highest.position) return await interaction.editReply({ content: 'Etiketlediğiniz rol benim rolünden daha yüksek bir pozisyona sahip!' });
        if (rol.tags?.botId || rol.tags?.bot_id) return await interaction.editReply({ content: 'Bot rollerini üyelere veremezsin!' });
        if (üye.roles.cache.has(rol.id)) return await interaction.editReply({ content: `Bu üye bu role zaten sahip.` });

        try {
            await üye.roles.add(rol);

            const embed = new EmbedBuilder()
                .setAuthor({ name: üye.user.username, iconURL: üye.user.displayAvatarURL() })
                .setDescription(`Üyeye başarıyla rol verildi.`)
                .setColor('Blurple')
                .setTimestamp()
                .setFooter({ text: `Rolü Veren: ${user.username}`, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'Rolü Veren', value: `${user} \`(${user.id})\``, inline: false },
                    { name: 'Rolü Verilen', value: `${üye} \`(${üye.id})\``, inline: false },
                    { name: 'Verilen Rol', value: `${rol}`, inline: false }
                )

            return await interaction.editReply({ embeds: [embed] });
        } catch {
            return await interaction.editReply({ content: 'Rol verme işlemi sırasında bir hata oluştu.' });
        }
    },
};