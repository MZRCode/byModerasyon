const { Message, Client, Events, PermissionFlagsBits } = require('discord.js');
const badwords = require('../../Utils/badwords.json');
const links = require('../../Utils/links.json');
const mzr = require('mzrdjs');
const db = require('mzrdb');

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Client} client
     * @param {Message} message
    */
    async execute(client, message) {
        if (message?.author?.bot) return;
        if (!message.guild || !message.content || !message.channel || !message.author) return;

        const { guild } = message;

        const reklamEngel = db.get(`reklamEngel.${guild.id}`);
        if (reklamEngel && links.some(link => message.content.toLowerCase().includes(link)) && (!message.member.permissions.has(PermissionFlagsBits.Administrator) || !message.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
            try {
                await message.delete();

                try {
                    await message.member.timeout(mzr.ms('2dk', 'Reklam yapmak yasak!'));
                } catch { };

                await message.channel.send(`${message.author}, bu sunucuda reklam yapmak yasak!`).then((msg) => {
                    setTimeout(() => msg.delete(), 5000);
                });
            } catch {
                return message.reply({ content: `Reklam engel sistemin de reklam engelleme işlemi sırasında bir hata oluştu. Lütfen yetkililere bildirin.` });
            }
        };

        const küfürEngel = db.get(`küfürEngel.${guild.id}`);
        if (küfürEngel && (!message.member.permissions.has(PermissionFlagsBits.Administrator) || !message.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
            const reg = new RegExp(`\\b(${badwords.join('|')})\\b`, 'i');

            if (reg.test(message.content)) {
                try {
                    await message.delete();

                    try {
                        await message.member.timeout(mzr.ms('5dk', 'Küfür etmek yasak!'));
                    } catch { };

                    await message.channel.send(`${message.author}, bu sunucuda küfür etmek yasakt!`).then((msg) => {
                        setTimeout(() => msg.delete(), 5000);
                    });
                } catch {
                    return message.reply({ content: `Küfür engel sistemin de küfür engelleme işlemi sırasında bir hata oluştu. Lütfen yetkililere bildirin.` });
                }
            }
        }
    },
};