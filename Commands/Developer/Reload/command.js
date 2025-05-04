const { ChatInputCommandInteraction, Client, MessageFlags } = require('discord.js');
const { glob } = require('glob');
const path = require('path');

module.exports = {
    subCommand: 'reload.command',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        const { options } = interaction;
        const komutGirisi = options.getString('komut');

        const komutParcalari = komutGirisi.split(' ');
        const anaKomut = komutParcalari[0];
        const altKomut = komutParcalari[1] || null;

        const isMainCommand = client.commands.has(anaKomut);
        const isSubCommand = client.subCommands.has(`${anaKomut}.${altKomut}`);

        if (!isMainCommand && !isSubCommand) return interaction.reply({ content: `**${komutGirisi}** adlı komut veya alt komut bulunamadı!`, flags: [MessageFlags.Ephemeral] });

        try {
            const files = await glob(path.join(process.cwd(), 'Commands', '**', '*.js').replace(/\\/g, '/'));

            let commandPath = null;
            if (isSubCommand) commandPath = files.find(file => file.endsWith(`${altKomut}.js`));
            else commandPath = files.find(file => file.endsWith(`${anaKomut}.js`));

            if (!commandPath) return interaction.reply({ content: `**${komutGirisi}** adlı dosya bulunamadı!`, flags: [MessageFlags.Ephemeral] });

            delete require.cache[require.resolve(commandPath)];

            const newCommand = require(commandPath);

            if (isSubCommand) client.subCommands.set(`${anaKomut}.${altKomut}`, newCommand);
            else client.commands.set(newCommand.data.name, newCommand);

            return interaction.reply({ content: `**/${komutGirisi}** komutu başarıyla yeniden yüklendi!`, flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            console.log(error);
            return interaction.reply({ content: 'Komut yeniden yüklenirken bir sorun oluştu!', flags: [MessageFlags.Ephemeral] });
        }
    },
};











































// YouTube: @MZRDev tarafından yapılmıştır. Satılması, paylaşılması tamamen yasaktır!