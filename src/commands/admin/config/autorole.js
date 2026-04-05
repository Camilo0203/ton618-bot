"use strict";

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { reactionRoles, autoRoleSettings, settings } = require("../../../utils/database");
const { requireSupportServer } = require("../../../utils/supportServerOnly");
const { resolveGuildLanguage, t } = require("../../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Configure automatic role assignment")
    .setDescriptionLocalizations({
      "es-ES": "Configurar asignación automática de roles",
      "es-419": "Configurar asignación automática de roles"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommandGroup(group =>
      group
        .setName("reaction")
        .setDescription("Manage reaction roles")
        .setDescriptionLocalizations({
          "es-ES": "Gestionar roles por reacción",
          "es-419": "Gestionar roles por reacción"
        })
        .addSubcommand(sub =>
          sub
            .setName("add")
            .setDescription("Add a reaction role to a message")
            .setDescriptionLocalizations({
              "es-ES": "Agregar un rol por reacción a un mensaje",
              "es-419": "Agregar un rol por reacción a un mensaje"
            })
            .addStringOption(opt =>
              opt
                .setName("message_id")
                .setDescription("ID of the message")
                .setRequired(true)
            )
            .addStringOption(opt =>
              opt
                .setName("emoji")
                .setDescription("Emoji to react with")
                .setRequired(true)
            )
            .addRoleOption(opt =>
              opt
                .setName("role")
                .setDescription("Role to assign")
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("remove")
            .setDescription("Remove a reaction role from a message")
            .setDescriptionLocalizations({
              "es-ES": "Remover un rol por reacción de un mensaje",
              "es-419": "Remover un rol por reacción de un mensaje"
            })
            .addStringOption(opt =>
              opt
                .setName("message_id")
                .setDescription("ID of the message")
                .setRequired(true)
            )
            .addStringOption(opt =>
              opt
                .setName("emoji")
                .setDescription("Emoji to remove")
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("panel")
            .setDescription("Create a reaction role panel")
            .setDescriptionLocalizations({
              "es-ES": "Crear un panel de roles por reacción",
              "es-419": "Crear un panel de roles por reacción"
            })
            .addChannelOption(opt =>
              opt
                .setName("channel")
                .setDescription("Channel to post the panel in")
            )
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName("join")
        .setDescription("Manage join roles")
        .setDescriptionLocalizations({
          "es-ES": "Gestionar roles de entrada",
          "es-419": "Gestionar roles de entrada"
        })
        .addSubcommand(sub =>
          sub
            .setName("set")
            .setDescription("Set a role to be given when users join")
            .setDescriptionLocalizations({
              "es-ES": "Establecer un rol para dar cuando los usuarios se unan",
              "es-419": "Establecer un rol para dar cuando los usuarios se unan"
            })
            .addRoleOption(opt =>
              opt
                .setName("role")
                .setDescription("Role to assign on join")
                .setRequired(true)
            )
            .addIntegerOption(opt =>
              opt
                .setName("delay")
                .setDescription("Delay in seconds before assigning (default: 0)")
                .setMinValue(0)
                .setMaxValue(3600)
            )
            .addBooleanOption(opt =>
              opt
                .setName("exclude_bots")
                .setDescription("Don't give role to bots (default: true)")
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("remove")
            .setDescription("Remove the join role")
            .setDescriptionLocalizations({
              "es-ES": "Remover el rol de entrada",
              "es-419": "Remover el rol de entrada"
            })
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName("level")
        .setDescription("Manage level-based roles")
        .setDescriptionLocalizations({
          "es-ES": "Gestionar roles basados en nivel",
          "es-419": "Gestionar roles basados en nivel"
        })
        .addSubcommand(sub =>
          sub
            .setName("add")
            .setDescription("Add a role reward for reaching a level")
            .setDescriptionLocalizations({
              "es-ES": "Agregar una recompensa de rol por alcanzar un nivel",
              "es-419": "Agregar una recompensa de rol por alcanzar un nivel"
            })
            .addIntegerOption(opt =>
              opt
                .setName("level")
                .setDescription("Level required")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
            )
            .addRoleOption(opt =>
              opt
                .setName("role")
                .setDescription("Role to assign")
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("remove")
            .setDescription("Remove a level role reward")
            .setDescriptionLocalizations({
              "es-ES": "Remover una recompensa de rol de nivel",
              "es-419": "Remover una recompensa de rol de nivel"
            })
            .addIntegerOption(opt =>
              opt
                .setName("level")
                .setDescription("Level to remove reward from")
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("list")
            .setDescription("List all level role rewards")
            .setDescriptionLocalizations({
              "es-ES": "Listar todas las recompensas de rol de nivel",
              "es-419": "Listar todas las recompensas de rol de nivel"
            })
        )
        .addSubcommand(sub =>
          sub
            .setName("mode")
            .setDescription("Set how level roles are assigned")
            .setDescriptionLocalizations({
              "es-ES": "Establecer cómo se asignan los roles de nivel",
              "es-419": "Establecer cómo se asignan los roles de nivel"
            })
            .addStringOption(opt =>
              opt
                .setName("mode")
                .setDescription("Assignment mode")
                .setRequired(true)
                .addChoices(
                  { name: "Stack - Keep all previous level roles", value: "stack" },
                  { name: "Replace - Only keep highest level role", value: "replace" }
                )
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("list")
        .setDescription("View all auto-role configurations")
    ),

  async execute(interaction) {
    const isAllowed = await requireSupportServer(interaction);
    if (!isAllowed) return;

    const guildSettings = await settings.get(interaction.guildId);
    const lang = resolveGuildLanguage(guildSettings);

    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (group === "reaction") {
      if (subcommand === "add") {
        return this.handleReactionAdd(interaction, lang);
      } else if (subcommand === "remove") {
        return this.handleReactionRemove(interaction, lang);
      } else if (subcommand === "panel") {
        return this.handleReactionPanel(interaction, lang);
      }
    } else if (group === "join") {
      if (subcommand === "set") {
        return this.handleJoinSet(interaction, lang);
      } else if (subcommand === "remove") {
        return this.handleJoinRemove(interaction, lang);
      }
    } else if (group === "level") {
      if (subcommand === "add") {
        return this.handleLevelAdd(interaction, lang);
      } else if (subcommand === "remove") {
        return this.handleLevelRemove(interaction, lang);
      } else if (subcommand === "list") {
        return this.handleLevelList(interaction, lang);
      } else if (subcommand === "mode") {
        return this.handleLevelMode(interaction, lang);
      }
    } else if (subcommand === "list") {
      return this.handleList(interaction, lang);
    }
  },

  async handleReactionAdd(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options.getString("message_id");
    const emoji = interaction.options.getString("emoji");
    const role = interaction.options.getRole("role");

    try {
      const message = await interaction.channel.messages.fetch(messageId).catch(() => null);
      if (!message) {
        return interaction.editReply({
          content: t(lang, "autorole.errors.message_not_found"),
          ephemeral: true
        });
      }

      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.editReply({
          content: t(lang, "autorole.errors.role_hierarchy"),
          ephemeral: true
        });
      }

      await reactionRoles.add(
        interaction.guildId,
        messageId,
        interaction.channelId,
        emoji,
        role.id,
        "toggle"
      );

      try {
        await message.react(emoji);
      } catch (error) {
        console.error("Error adding reaction:", error);
      }

      return interaction.editReply({
        content: t(lang, "autorole.success.reaction_added", { emoji, role: role.toString() }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error adding reaction role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.add_failed"),
        ephemeral: true
      });
    }
  },

  async handleReactionRemove(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const messageId = interaction.options.getString("message_id");
    const emoji = interaction.options.getString("emoji");

    try {
      const removed = await reactionRoles.remove(interaction.guildId, messageId, emoji);

      if (!removed) {
        return interaction.editReply({
          content: t(lang, "autorole.errors.not_found"),
          ephemeral: true
        });
      }

      return interaction.editReply({
        content: t(lang, "autorole.success.reaction_removed", { emoji }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error removing reaction role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.remove_failed"),
        ephemeral: true
      });
    }
  },

  async handleReactionPanel(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("channel") || interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle(t(lang, "autorole.panel.title"))
      .setDescription(t(lang, "autorole.panel.description"))
      .setColor(0x5865F2)
      .setFooter({ text: t(lang, "autorole.panel.footer") });

    try {
      const message = await channel.send({ embeds: [embed] });

      return interaction.editReply({
        content: t(lang, "autorole.success.panel_created", { channel: channel.toString(), messageId: message.id }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error creating panel:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.panel_failed"),
        ephemeral: true
      });
    }
  },

  async handleJoinSet(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole("role");
    const delay = interaction.options.getInteger("delay") || 0;
    const excludeBots = interaction.options.getBoolean("exclude_bots") ?? true;

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.editReply({
        content: t(lang, "autorole.errors.role_hierarchy"),
        ephemeral: true
      });
    }

    try {
      await autoRoleSettings.setJoinRole(interaction.guildId, role.id, delay, excludeBots);

      return interaction.editReply({
        content: t(lang, "autorole.success.join_set", { 
          role: role.toString(), 
          delay: delay.toString(), 
          excludeBots: excludeBots ? t(lang, "common.yes") : t(lang, "common.no") 
        }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error setting join role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.join_set_failed"),
        ephemeral: true
      });
    }
  },

  async handleJoinRemove(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    try {
      await autoRoleSettings.setJoinRole(interaction.guildId, null, 0, true);

      return interaction.editReply({
        content: t(lang, "autorole.success.join_removed"),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error removing join role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.join_remove_failed"),
        ephemeral: true
      });
    }
  },

  async handleLevelAdd(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const level = interaction.options.getInteger("level");
    const role = interaction.options.getRole("role");

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.editReply({
        content: t(lang, "autorole.errors.role_hierarchy"),
        ephemeral: true
      });
    }

    try {
      await autoRoleSettings.addLevelRole(interaction.guildId, level, role.id, "add");

      return interaction.editReply({
        content: t(lang, "autorole.success.level_added", { level: level.toString(), role: role.toString() }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error adding level role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.level_add_failed"),
        ephemeral: true
      });
    }
  },

  async handleLevelRemove(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const level = interaction.options.getInteger("level");

    try {
      await autoRoleSettings.removeLevelRole(interaction.guildId, level);

      return interaction.editReply({
        content: t(lang, "autorole.success.level_removed", { level: level.toString() }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error removing level role:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.level_remove_failed"),
        ephemeral: true
      });
    }
  },

  async handleLevelList(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const settings = await autoRoleSettings.get(interaction.guildId);

      if (!settings.level_roles || settings.level_roles.length === 0) {
        return interaction.editReply({
          content: t(lang, "autorole.errors.no_level_roles"),
          ephemeral: true
        });
      }

      const sorted = settings.level_roles.sort((a, b) => a.level - b.level);

      const embed = new EmbedBuilder()
        .setTitle(t(lang, "autorole.list.level_roles", { mode: settings.level_roles_mode || "stack" }))
        .setDescription(
          sorted.map(lr => `**Level ${lr.level}:** <@&${lr.role_id}>`).join("\n")
        )
        .setColor(0x5865F2)
        .setFooter({ text: `Mode: ${settings.level_roles_mode || "stack"}` });

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error listing level roles:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.list_failed"),
        ephemeral: true
      });
    }
  },

  async handleLevelMode(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    const mode = interaction.options.getString("mode");

    try {
      await autoRoleSettings.setLevelRolesMode(interaction.guildId, mode);

      return interaction.editReply({
        content: t(lang, "autorole.success.mode_set", { mode }),
        ephemeral: true
      });
    } catch (error) {
      console.error("Error setting level mode:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.list_failed"),
        ephemeral: true
      });
    }
  },

  async handleList(interaction, lang) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const settings = await autoRoleSettings.get(interaction.guildId);
      const reactionRolesList = await reactionRoles.getByGuild(interaction.guildId);

      const embed = new EmbedBuilder()
        .setTitle(t(lang, "autorole.list.title"))
        .setColor(0x5865F2);

      if (settings.join_role_id) {
        embed.addFields({
          name: t(lang, "autorole.list.join_role"),
          value: t(lang, "autorole.list.join_role_value", {
            role: `<@&${settings.join_role_id}>`,
            delay: settings.join_role_delay.toString(),
            excludeBots: settings.join_role_exclude_bots ? t(lang, "common.yes") : t(lang, "common.no")
          })
        });
      }

      if (reactionRolesList.length > 0) {
        const grouped = {};
        reactionRolesList.forEach(rr => {
          if (!grouped[rr.message_id]) grouped[rr.message_id] = [];
          grouped[rr.message_id].push(rr);
        });

        const reactionText = Object.entries(grouped).map(([msgId, roles]) => {
          return `**${t(lang, "autorole.list.message")}:** \`${msgId}\`\n${roles.map(r => `${r.emoji} → <@&${r.role_id}>`).join("\n")}`;
        }).join("\n\n");

        embed.addFields({
          name: t(lang, "autorole.list.reaction_roles"),
          value: reactionText.slice(0, 1024)
        });
      }

      if (settings.level_roles && settings.level_roles.length > 0) {
        const sorted = settings.level_roles.sort((a, b) => a.level - b.level);
        const levelText = sorted.map(lr => t(lang, "autorole.list.level_entry", { level: lr.level.toString(), roleId: lr.role_id })).join("\n");
        
        embed.addFields({
          name: t(lang, "autorole.list.level_roles", { mode: settings.level_roles_mode || "stack" }),
          value: levelText.slice(0, 1024)
        });
      }

      if (embed.data.fields?.length === 0) {
        return interaction.editReply({
          content: t(lang, "autorole.errors.no_autoroles"),
          ephemeral: true
        });
      }

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error listing auto-roles:", error);
      return interaction.editReply({
        content: t(lang, "autorole.errors.list_failed"),
        ephemeral: true
      });
    }
  },
};
