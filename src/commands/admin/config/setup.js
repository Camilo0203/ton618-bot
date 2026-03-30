const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { settings } = require("../../../utils/database");
const E = require("../../../utils/embeds");
const { getLanguageLabel, setGuildLanguage } = require("../../../utils/languageService");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");
const {
  withDescriptionLocalizations,
  localizedChoice,
} = require("../../../utils/slashLocalizations");

const general = require("./setup/general");
const automod = require("./setup/automod");
const tickets = require("./setup/tickets");
const sugerencias = require("./setup/sugerencias");
const confesiones = require("./setup/confesiones");
const bienvenida = require("./setup/bienvenida");
const despedida = require("./setup/despedida");
const comandos = require("./setup/comandos");
const wizard = require("./setup/wizard");

const setupModules = [wizard, general, automod, tickets, sugerencias, confesiones, bienvenida, despedida, comandos];

let data = withDescriptionLocalizations(
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription(t("en", "setup.slash.description"))
    .addSubcommand((subcommand) =>
      withDescriptionLocalizations(
        subcommand
          .setName("language")
          .setDescription(t("en", "setup.slash.subcommands.language.description"))
          .addStringOption((option) =>
            withDescriptionLocalizations(
              option
                .setName("value")
                .setDescription(t("en", "setup.slash.options.language_value"))
                .setRequired(false)
                .addChoices(
                  localizedChoice("en", "setup.slash.choices.english"),
                  localizedChoice("es", "setup.slash.choices.spanish")
                ),
              "setup.slash.options.language_value"
            )
          ),
        "setup.slash.subcommands.language.description"
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  "setup.slash.description"
);

for (const mod of setupModules) {
  data = mod.register(data);
}

module.exports = {
  data,

  async execute(interaction) {
    let group = null;
    try {
      group = interaction.options.getSubcommandGroup(false);
    } catch (_) {}
    const sub = interaction.options.getSubcommand();
    const gid = interaction.guild.id;
    const s = await settings.get(gid);

    const ok = (msg) => interaction.reply({ embeds: [E.successEmbed(msg)], flags: 64 });
    const er = (msg) => interaction.reply({ embeds: [E.errorEmbed(msg)], flags: 64 });

    if (!group && sub === "language") {
      const value = interaction.options.getString("value");
      const currentLanguage = resolveGuildLanguage(s, "en");

      if (!value) {
        const label = getLanguageLabel(currentLanguage, currentLanguage);
        return interaction.reply({
          embeds: [
            E.infoEmbed(
              t(currentLanguage, "setup.language.title"),
              [
                t(currentLanguage, "setup.language.description"),
                "",
                t(currentLanguage, "setup.language.current_value", { label }),
                "",
                `${t(currentLanguage, "common.labels.onboarding_status")}: **${
                  s.language_onboarding_completed
                    ? t(currentLanguage, "setup.language.onboarding_completed")
                    : t(currentLanguage, "setup.language.onboarding_pending")
                }**`,
                s.language_selected_at
                  ? `${t(currentLanguage, "common.labels.last_updated")}: <t:${Math.floor(
                      new Date(s.language_selected_at).getTime() / 1000
                    )}:R>`
                  : t(currentLanguage, "setup.language.fallback_note"),
              ].join("\n")
            ),
          ],
          flags: 64,
        });
      }

      const updated = await setGuildLanguage(gid, value, interaction.user.id, {
        onboardingCompleted: true,
        source: "command.setup.language",
        reason: t(value, "setup.language.audit_reason_manual"),
      });

      if (!updated) {
        return er(t(value, "errors.language_save_failed"));
      }

      const label = getLanguageLabel(value, value);
      return ok(t(value, "setup.language.updated_value", { label }));
    }

    const ctx = { interaction, group, sub, gid, s, ok, er };

    for (const mod of setupModules) {
      const handled = await mod.execute(ctx);
      if (handled) return;
    }

    return interaction.reply({
      embeds: [E.errorEmbed(t(resolveGuildLanguage(s, "en"), "interaction.unexpected"))],
      flags: 64,
    });
  },

  async autocomplete(interaction) {
    let group = null;
    let sub = null;
    try {
      group = interaction.options.getSubcommandGroup(false);
    } catch (_) {}
    try {
      sub = interaction.options.getSubcommand(false);
    } catch (_) {}

    const gid = interaction.guild?.id || null;
    const s = gid ? await settings.get(gid) : null;
    const ctx = { interaction, group, sub, gid, s };

    for (const mod of setupModules) {
      if (typeof mod.autocomplete !== "function") continue;
      const handled = await mod.autocomplete(ctx);
      if (handled) return;
    }

    await interaction.respond([]).catch(() => {});
  },
};
