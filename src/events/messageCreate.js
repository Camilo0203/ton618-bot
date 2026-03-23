const { tickets, autoResponses } = require("../utils/database");
const { getGuildSettings, hasStaffPrivileges } = require("../utils/accessControl");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // 1. SISTEMA DE TICKETS
    const ticket = await tickets.get(message.channel.id);
    if (ticket && ticket.status === "open") {
      // Reuse the shared guild settings cache so this event stays aligned with access control.
      const s = await getGuildSettings(message.guild.id);
      const isStaff = hasStaffPrivileges(message.member, s);
      await tickets.incrementMessages(message.channel.id, isStaff);

      if (!isStaff && message.content) {
        const match = await autoResponses.match(message.guild.id, message.content);
        if (match) {
          await autoResponses.use(message.guild.id, match.trigger);
          await message.channel.send({
            content: `> 🤖 **Respuesta automática** - *"${match.trigger}"*\n\n${match.response}`,
          }).catch(() => {});
        }
      }
    }


  },
};
