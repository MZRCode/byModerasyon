const { loadCommands } = require('../../Handlers/commandHandler');
const { ActivityType, Client, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
    */
    async execute(client) {
        client.user.setPresence({ status: 'idle', activities: [{ name: 'YT: @MZRDev\'e abone oluyor', type: ActivityType.Custom }] });

        loadCommands(client).then(() => client.djs.slashBuilder);
    },
};

































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!