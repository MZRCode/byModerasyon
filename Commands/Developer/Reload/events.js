const { ChatInputCommandInteraction, Client, MessageFlags } = require('discord.js');
const { loadEvents } = require('../../../Handlers/eventHandler');

module.exports = {
    subCommand: 'reload.events',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        for (const [key, value] of client.events) client.removeListener(`${key}`, value, true);
        await loadEvents(client);

        return interaction.reply({ content: 'Etkinlikler (Eventler) yeniden yüklendi!', flags: [MessageFlags.Ephemeral] });
    },
};





















































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!