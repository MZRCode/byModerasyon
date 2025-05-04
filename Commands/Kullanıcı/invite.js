const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationIntegrationType, MessageFlags } = require('discord.js');
const { DestekSunucuLink } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Beni sunucuna davet etmek için kullanabilirsiniz.')
        .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const mzrRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Davet Et')
                .setStyle(ButtonStyle.Link)
                .setEmoji('1193303896270065817')
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
            new ButtonBuilder()
                .setLabel('Topluluk Sunucusu')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🌐')
                .setURL(`${DestekSunucuLink}`));

        const mzrEmbed = new EmbedBuilder()
            .setTitle(`${client.user.username} Botuna Destek Ver`)
            .setDescription(`**${client.user.username}** Botunu kullanarak sunucunuza düzen katıp büyüte bilirsiniz.`)
            .setColor('Green')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }));

        return interaction.reply({ embeds: [mzrEmbed], components: [mzrRow], flags: [MessageFlags.Ephemeral] });
    },
};