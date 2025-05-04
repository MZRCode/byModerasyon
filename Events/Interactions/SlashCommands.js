const { ChatInputCommandInteraction, Client, Events } = require('discord.js');
const { OwnerId } = require('../../config.json');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const { user, options } = interaction;

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: 'Bu komut artık kullanılmıyor!', ephemeral: true });

        if (command.developer && user.id !== OwnerId) return interaction.reply({ content: 'Bu komutu kullana bilmek için **Bot Sahibim** olmalısın!', ephemeral: true });

        const subCommand = options.getSubcommand(false);
        if (subCommand) {
            const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
            if (!subCommandFile) return interaction.reply({ content: 'Bu komut artık kullanılmıyor!', ephemeral: true });

            subCommandFile.execute(interaction, client);
        } else command.execute(interaction, client);
    },
};









































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!