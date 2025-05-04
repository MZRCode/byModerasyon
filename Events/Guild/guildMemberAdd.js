const { GuildMember, Client, Events, PermissionFlagsBits } = require('discord.js');
const db = require('mzrdb');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * @param {Client} client
     * @param {GuildMember} member
    */
    async execute(client, member) {
        if (member?.user?.bot) return;

        const otorolData = db.get(`otorol.${member.guild.id}`);
        if (!otorolData) return;

        if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return;

        try {
            const otorol = member.guild.roles.cache.get(otorolData) ?? await member.guild.roles.fetch(otorolData);
            if (!otorol) return;

            await member.roles.add(otorol, 'Otorol Sistemi');

            return;
        } catch { };
    },
};