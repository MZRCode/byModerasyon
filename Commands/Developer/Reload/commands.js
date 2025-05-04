const { ChatInputCommandInteraction, Client, MessageFlags } = require('discord.js');
const { loadCommands } = require('../../../Handlers/commandHandler');

module.exports = {
    subCommand: 'reload.commands',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        await loadCommands(client);

        return interaction.reply({ content: 'Tüm komutlar yeniden yüklendi!', flags: [MessageFlags.Ephemeral] });
    },
};






















































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!