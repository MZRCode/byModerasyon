const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationIntegrationType, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription('Komutlarımı görmek için kullanabilirsiniz.')
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        const { user } = interaction;

        const mzrEmbed = new EmbedBuilder()
            .setTitle('Yardım Menüm')
            .addFields(
                { name: 'Moderasyon Komutları', value: `- /ban <üye> <sebep> <mesaj-sil>\n- /unban <üye> <sebep>\n- /kick <üye> <sebep>\n- /timeout <üye> <süre> <sebep>\n- /untimeout <üye>\n- /lock\n- /unlock\n- /slowmode <süre>\n- /move <üye> <kanal>\n- /nuke\n- /sil <miktar>\n- /snipe`, inline: false },
                { name: 'Rol Komutları', value: `- /rol-ver <üye> <rol>\n- /rol-al <üye> <rol>`, inline: false },
                { name: 'Küfür Engel Komutları', value: `- /küfür-engel aç\n- /küfür-engel kapat`, inline: false },
                { name: 'Mod Log Komutları', value: `- /modlog aç <kanal>\n- /modlog kapat`, inline: false },
                { name: 'Otorol Komutları', value: `- /otorol ayarla <rol> <kanal>\n- /otorol sıfırla`, inline: false },
                { name: 'Reklam Engel Komutları', value: `- /reklam-engel aç\n- /reklam-engel kapat`, inline: false },
                { name: 'Bot Sahibi Komutları', value: `- /reload command <komut>\n- /reload commands\n- /reload events`, inline: false },
                { name: 'Kullanıcı Komutları', value: `- /yardım\n- /ping\n- /invite`, inline: false },
            )
            .setTimestamp()
            .setFooter({ text: `${user.username} tarafından istendi.`, iconURL: user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('Blurple')

        const mzrRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Davet Et')
                .setStyle(ButtonStyle.Link)
                .setEmoji('1193303896270065817')
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`));

        return interaction.reply({ embeds: [mzrEmbed], components: [mzrRow], flags: [MessageFlags.Ephemeral] });
    },
};
