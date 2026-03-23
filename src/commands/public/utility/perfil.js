const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { levels } = require("../../../utils/database");
const { economy } = require("../../../utils/economy");

async function resolveName(guild, userId) {
  const member = await guild.members.fetch(userId).catch(() => null);
  return member?.displayName || `Usuario ${String(userId).slice(-4)}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Perfil ultra simple: nivel + economia")
    .addSubcommand((s) =>
      s
        .setName("ver")
        .setDescription("Ver tu perfil o el de otro usuario")
        .addUserOption((o) => o.setName("usuario").setDescription("Usuario a consultar").setRequired(false))
    )
    .addSubcommand((s) =>
      s
        .setName("top")
        .setDescription("Ver top rapido de niveles y economia")
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const gid = guild.id;

    if (sub === "ver") {
      const target = interaction.options.getUser("usuario") || interaction.user;
      const [eco, lvl, rank] = await Promise.all([
        economy.get(gid, target.id),
        levels.get(gid, target.id),
        levels.getRank(gid, target.id),
      ]);

      const totalMoney = (eco?.wallet || 0) + (eco?.bank || 0);
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`Perfil de ${target.username}`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Nivel", value: `\`${lvl?.level || 0}\``, inline: true },
          { name: "XP Total", value: `\`${(lvl?.total_xp || 0).toLocaleString()}\``, inline: true },
          { name: "Rango", value: `\`#${rank || "-"}\``, inline: true },
          { name: "Wallet", value: `\`${(eco?.wallet || 0).toLocaleString()}\``, inline: true },
          { name: "Banco", value: `\`${(eco?.bank || 0).toLocaleString()}\``, inline: true },
          { name: "Total", value: `\`${totalMoney.toLocaleString()}\``, inline: true }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply();

    const [topLevels, topEco] = await Promise.all([
      levels.getLeaderboard(gid, 5),
      economy.getLeaderboard(gid, 5),
    ]);

    const levelLines = await Promise.all(
      topLevels.map(async (row, i) => `${i + 1}. **${await resolveName(guild, row.user_id)}** - Nv ${row.level}`)
    );
    const ecoLines = await Promise.all(
      topEco.map(async (row, i) => `${i + 1}. **${await resolveName(guild, row.user_id)}** - ${(row.total_earned || 0).toLocaleString()} monedas`)
    );

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("Top Rapido")
      .addFields(
        { name: "Top Niveles", value: levelLines.join("\n") || "Sin datos", inline: false },
        { name: "Top Economia", value: ecoLines.join("\n") || "Sin datos", inline: false }
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
