const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, StringSelectMenuBuilder,
} = require("discord.js");

const { tickets, ticketEvents, settings, notes } = require("../../../utils/database");
const TH = require("../../../handlers/ticketHandler");
const { generateTranscript } = require("../../../utils/transcript");
const E = require("../../../utils/embeds");
const config = require("../../../../config");
const createTicketButton = require("../../../interactions/buttons/createTicket");
const playbookActions = require("./playbookActions");
const { generateCaseBrief } = require("../../../utils/caseBrief");
const { updateTicketControlPanelEmbed } = require("../../../utils/ticketEmbedUpdater");
const { getCategoriesForGuild } = require("../../../utils/categoryResolver");

const MAX_NOTES_PER_TICKET = 20; // Límite máximo de notas por ticket

function isStaff(member, s) {
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  if (s?.support_role && member.roles.cache.has(s.support_role)) return true;
  if (s?.admin_role && member.roles.cache.has(s.admin_role)) return true;
  return false;
}

async function getTicket(channel) {
  return await tickets.get(channel.id);
}

async function recordTicketEventSafe(data) {
  try {
    await ticketEvents.add(data);
  } catch {}
}

// ════════════════════════════════════════════════════════════════════════════════
//   COMANDO MAESTRO: /ticket
// ════════════════════════════════════════════════════════════════════════════════

module.exports = {
  data: playbookActions.register(new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket operations and support actions")
    .addSubcommand(sub => sub
      .setName("open")
      .setDescription("Open a support ticket")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: close
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("close")
      .setDescription("Close the current ticket")
      .addStringOption(o => o
        .setName("reason")
        .setDescription("Closing reason")
        .setRequired(false)
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: reopen
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("reopen")
      .setDescription("Reopen a closed ticket")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: claim
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("claim")
      .setDescription("Claim this ticket")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: unclaim
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("unclaim")
      .setDescription("Release this ticket claim")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: assign
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("assign")
      .setDescription("Assign the ticket to a staff member")
      .addUserOption(o => o
        .setName("staff")
        .setDescription("Staff member")
        .setRequired(true)
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: add
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("add")
      .setDescription("Add a user to the ticket")
      .addUserOption(o => o
        .setName("user")
        .setDescription("User to add")
        .setRequired(true)
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: remove
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("remove")
      .setDescription("Remove a user from the ticket")
      .addUserOption(o => o
        .setName("user")
        .setDescription("User to remove")
        .setRequired(true)
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: rename
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("rename")
      .setDescription("Rename the ticket channel")
      .addStringOption(o => o
        .setName("name")
        .setDescription("New channel name")
        .setRequired(true)
        .setMaxLength(32)
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: priority
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("priority")
      .setDescription("Change the ticket priority")
      .addStringOption(o => o
        .setName("level")
        .setDescription("Priority level")
        .setRequired(true)
        .addChoices(
          { name: "Low", value: "low" },
          { name: "Normal", value: "normal" },
          { name: "High", value: "high" },
          { name: "Urgent", value: "urgent" }
        )
      )
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: move
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("move")
      .setDescription("Move the ticket to another category")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: transcript
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("transcript")
      .setDescription("Generate a ticket transcript")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: brief
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("brief")
      .setDescription("View the operational case brief")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: info
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("info")
      .setDescription("View details about the current ticket")
    )
    
    // ──────────────────────────────────────────────────────────────────────────
    //   SUBCOMANDO: history
    // ──────────────────────────────────────────────────────────────────────────
    .addSubcommand(sub => sub
      .setName("history")
      .setDescription("View a user's ticket history")
      .addUserOption(o => o
        .setName("user")
        .setDescription("User to inspect")
        .setRequired(false)
      )
    )
    
    // ══════════════════════════════════════════════════════════════════════════
    //   GRUPO DE SUBCOMANDOS: note
    // ══════════════════════════════════════════════════════════════════════════
    .addSubcommandGroup(group => group
      .setName("note")
      .setDescription("Internal staff notes for the ticket")
      
      // ────────────────────────────────────────────────────────────────────────
      //   note add
      // ────────────────────────────────────────────────────────────────────────
      .addSubcommand(sub => sub
        .setName("add")
        .setDescription("Add an internal note")
        .addStringOption(o => o
          .setName("note")
          .setDescription("Note content")
          .setRequired(true)
          .setMaxLength(500)
        )
      )
      
      // ────────────────────────────────────────────────────────────────────────
      //   note list
      // ────────────────────────────────────────────────────────────────────────
      .addSubcommand(sub => sub
        .setName("list")
        .setDescription("List every note on the ticket")
      )
      
      // ────────────────────────────────────────────────────────────────────────
      //   note clear
      // ────────────────────────────────────────────────────────────────────────
      .addSubcommand(sub => sub
        .setName("clear")
        .setDescription("Clear every note (admins only)")
      )
    )),

  // ════════════════════════════════════════════════════════════════════════════
  //   FUNCIÓN EXECUTE - ENRUTADOR DE SUBCOMANDOS
  // ════════════════════════════════════════════════════════════════════════════
  async execute(interaction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    // ══════════════════════════════════════════════════════════════════════════
    //   GRUPO: note
    // ══════════════════════════════════════════════════════════════════════════
    if (subcommandGroup === "note") {
      return await handleNoteCommands(interaction, subcommand);
    }

    if (subcommandGroup === "playbook") {
      return await playbookActions.execute(interaction, subcommand);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //   ENRUTADOR DE SUBCOMANDOS PRINCIPALES
    // ══════════════════════════════════════════════════════════════════════════
    switch (subcommand) {
      case "open":
        return await handleOpen(interaction);

      case "close":
        return await handleClose(interaction);
      
      case "reopen":
        return await handleReopen(interaction);
      
      case "claim":
        return await handleClaim(interaction);
      
      case "unclaim":
        return await handleUnclaim(interaction);
      
      case "assign":
        return await handleAssign(interaction);
      
      case "add":
        return await handleAdd(interaction);
      
      case "remove":
        return await handleRemove(interaction);
      
      case "rename":
        return await handleRename(interaction);
      
      case "priority":
        return await handlePriority(interaction);
      
      case "move":
        return await handleMove(interaction);
      
      case "transcript":
        return await handleTranscript(interaction);
      
      case "brief":
        return await handleBrief(interaction);
      
      case "info":
        return await handleInfo(interaction);
      
      case "history":
        return await handleHistory(interaction);
      
      default:
        return interaction.reply({
          embeds: [E.errorEmbed("Unknown ticket subcommand.")],
          flags: 64
        });
    }
  },
};

// ════════════════════════════════════════════════════════════════════════════════
//   HANDLERS DE SUBCOMANDOS
// ════════════════════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────────────────
//   CLOSE
// ──────────────────────────────────────────────────────────────────────────────
async function handleOpen(interaction) {
  return createTicketButton.execute(interaction, interaction.client);
}

async function handleClose(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can close tickets.")],
      flags: 64
    });
  }

  return TH.closeTicket(interaction, interaction.options.getString("reason") || interaction.options.getString("razon"));
}

// ──────────────────────────────────────────────────────────────────────────────
//   REOPEN
// ──────────────────────────────────────────────────────────────────────────────
async function handleReopen(interaction) {
  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can reopen tickets.")],
      flags: 64
    });
  }

  return TH.reopenTicket(interaction);
}

// ──────────────────────────────────────────────────────────────────────────────
//   CLAIM
// ──────────────────────────────────────────────────────────────────────────────
async function handleClaim(interaction) {
  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can claim tickets.")],
      flags: 64
    });
  }

  return TH.claimTicket(interaction);
}

// ──────────────────────────────────────────────────────────────────────────────
//   UNCLAIM
// ──────────────────────────────────────────────────────────────────────────────
async function handleUnclaim(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s) && interaction.user.id !== t.claimed_by) {
    return interaction.reply({
      embeds: [E.errorEmbed("You do not have permission to release this ticket.")],
      flags: 64
    });
  }

  return TH.unclaimTicket(interaction);
}

// ──────────────────────────────────────────────────────────────────────────────
//   ASSIGN
// ──────────────────────────────────────────────────────────────────────────────
async function handleAssign(interaction) {
  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can assign tickets.")],
      flags: 64
    });
  }

  const staffUser = interaction.options.getUser("staff");
  return TH.assignTicket(interaction, staffUser);
}

// ──────────────────────────────────────────────────────────────────────────────
//   ADD
// ──────────────────────────────────────────────────────────────────────────────
async function handleAdd(interaction) {
  if (!await getTicket(interaction.channel)) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can add users to the ticket.")],
      flags: 64
    });
  }

  return TH.addUser(interaction, interaction.options.getUser("user") || interaction.options.getUser("usuario"));
}

// ──────────────────────────────────────────────────────────────────────────────
//   REMOVE
// ──────────────────────────────────────────────────────────────────────────────
async function handleRemove(interaction) {
  if (!await getTicket(interaction.channel)) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can remove users from the ticket.")],
      flags: 64
    });
  }

  return TH.removeUser(interaction, interaction.options.getUser("user") || interaction.options.getUser("usuario"));
}

// ──────────────────────────────────────────────────────────────────────────────
//   RENAME
// ──────────────────────────────────────────────────────────────────────────────
async function handleRename(interaction) {
  const ticket = await getTicket(interaction.channel);
  if (!ticket) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can rename tickets.")],
      flags: 64
    });
  }

  const rawName = interaction.options.getString("name") || interaction.options.getString("nombre") || "";
  const name = rawName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 32);

  if (!name) {
    return interaction.reply({
      embeds: [E.errorEmbed("Provide a valid channel name.")],
      flags: 64,
    });
  }

  await interaction.channel.setName(name);
  await recordTicketEventSafe({
    guild_id: interaction.guild.id,
    ticket_id: ticket.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_renamed",
    visibility: "internal",
    title: "Channel renamed",
    description: `${interaction.user.tag} renamed ticket #${ticket.ticket_id} to ${name}.`,
    metadata: {
      channelName: name,
    },
  });
  return interaction.reply({
    embeds: [E.successEmbed(`Channel renamed to **${name}**`)]
  });
}

// ──────────────────────────────────────────────────────────────────────────────
//   PRIORITY
// ──────────────────────────────────────────────────────────────────────────────
async function handlePriority(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }
  if (t.status === "closed") {
    return interaction.reply({
      embeds: [E.errorEmbed("You cannot change the priority of a closed ticket.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can change ticket priority.")],
      flags: 64
    });
  }

  const level = interaction.options.getString("level") || interaction.options.getString("nivel");
  const info = config.priorities[level];
  
  await tickets.update(interaction.channel.id, { priority: level });
  const updatedTicket = await tickets.get(interaction.channel.id);
  
  await updateTicketControlPanelEmbed(interaction.channel, updatedTicket);
  
  await recordTicketEventSafe({
    guild_id: interaction.guild.id,
    ticket_id: t.ticket_id,
    channel_id: interaction.channel.id,
    actor_id: interaction.user.id,
    actor_kind: "staff",
    actor_label: interaction.user.tag,
    event_type: "ticket_priority_changed",
    visibility: "internal",
    title: "Priority updated",
    description: `${interaction.user.tag} changed ticket #${t.ticket_id} priority to ${info.label}.`,
    metadata: {
      priority: level,
      priorityLabel: info.label,
    },
  });
  
  await TH.sendLog(
    interaction.guild,
    s,
    "priority",
    interaction.user,
    updatedTicket,
    { "Priority": info.label }
  );

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(info.color)
        .setDescription(`Priority updated to **${info.label}**`)
        .setTimestamp()
    ]
  });
}

// ──────────────────────────────────────────────────────────────────────────────
//   MOVE
// ──────────────────────────────────────────────────────────────────────────────
async function handleMove(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can move tickets.")],
      flags: 64
    });
  }

  const configuredCategories = await getCategoriesForGuild(interaction.guild.id);
  const options = configuredCategories
    .filter((category) => category.id !== t.category_id)
    .map(c => ({
      label: c.label,
      value: c.id,
      emoji: c.emoji
    }));

  if (!options.length) {
    return interaction.reply({
      embeds: [E.errorEmbed("No other categories are available.")],
      flags: 64
    });
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_move_select")
    .setPlaceholder("Select the new category...")
    .addOptions(options);

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.INFO)
        .setDescription("Select the category you want to move this ticket to:")
    ],
    components: [new ActionRowBuilder().addComponents(menu)],
    flags: 64
  });
}

// ──────────────────────────────────────────────────────────────────────────────
//   TRANSCRIPT
// ──────────────────────────────────────────────────────────────────────────────
async function handleTranscript(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can generate transcripts.")],
      flags: 64
    });
  }

  await interaction.deferReply({ flags: 64 });

  try {
    const transcriptResult = await generateTranscript(interaction.channel, t, interaction.guild);
    if (!transcriptResult?.success || !transcriptResult.attachment) {
      return interaction.editReply({
        embeds: [E.errorEmbed("Failed to generate the transcript.")],
      });
    }

    return interaction.editReply({
      embeds: [E.successEmbed("Transcript generated.")],
      files: [transcriptResult.attachment]
    });
  } catch {
    return interaction.editReply({
      embeds: [E.errorEmbed("Failed to generate the transcript.")]
    });
  }
}

// ──────────────────────────────────────────────────────────────────────────────
//   BRIEF
// ──────────────────────────────────────────────────────────────────────────────
async function handleBrief(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can view the case brief.")],
      flags: 64
    });
  }

  const caseBrief = await generateCaseBrief(t, s);
  
  return interaction.reply({
    embeds: [caseBrief],
    flags: 64
  });
}

// ──────────────────────────────────────────────────────────────────────────────
//   INFO
// ──────────────────────────────────────────────────────────────────────────────
async function handleInfo(interaction) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can view ticket details.")],
      flags: 64
    });
  }

  const caseBrief = await generateCaseBrief(t, s);
  
  return interaction.reply({
    embeds: [caseBrief, E.ticketInfo(t, interaction.client)],
    flags: 64
  });
}

// ──────────────────────────────────────────────────────────────────────────────
//   HISTORY
// ──────────────────────────────────────────────────────────────────────────────
async function handleHistory(interaction) {
  const s = await settings.get(interaction.guild.id);
  const user = interaction.options.getUser("user") || interaction.options.getUser("usuario") || interaction.user;

  if (user.id !== interaction.user.id && !isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can view another user's ticket history.")],
      flags: 64
    });
  }

  const all = await tickets.getAllByGuild(interaction.guild.id);
  const userTickets = all.filter(t => t.user_id === user.id);
  const open = userTickets.filter(t => t.status === "open");
  const closed = userTickets.filter(t => t.status === "closed");

  if (!userTickets.length) {
    return interaction.reply({
      embeds: [E.infoEmbed("Ticket history", `<@${user.id}> has no tickets in this server.`)],
      flags: 64
    });
  }

  const lastClosed = closed
    .slice(0, 8)
    .map(t => `▸ **#${t.ticket_id}** ${t.category} — ${E.duration(t.created_at)} — ${t.rating ? "⭐".repeat(t.rating) : "No rating"}`)
    .join("\n");

  const openList = open
    .map(t => `▸ **#${t.ticket_id}** <#${t.channel_id}> ${t.category}`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle(`Ticket history for ${user.username}`)
    .setColor(E.Colors.PRIMARY)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields({
      name: "Summary",
      value: `Total: **${userTickets.length}** | Open: **${open.length}** | Closed: **${closed.length}**`,
      inline: false
    });

  if (openList) {
    embed.addFields({ name: "Open now", value: openList });
  }
  if (lastClosed) {
    embed.addFields({ name: "Recently closed", value: lastClosed });
  }

  return interaction.reply({ embeds: [embed], flags: 64 });
}

// ══════════════════════════════════════════════════════════════════════════════
//   HANDLER DEL GRUPO: note
// ══════════════════════════════════════════════════════════════════════════════
async function handleNoteCommands(interaction, subcommand) {
  const t = await getTicket(interaction.channel);
  if (!t) {
    return interaction.reply({
      embeds: [E.errorEmbed("This is not a ticket channel.")],
      flags: 64
    });
  }

  const s = await settings.get(interaction.guild.id);
  if (!isStaff(interaction.member, s)) {
    return interaction.reply({
      embeds: [E.errorEmbed("Only staff can view or add notes.")],
      flags: 64
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  //   note clear
  // ────────────────────────────────────────────────────────────────────────────
  if (subcommand === "clear") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [E.errorEmbed("Only administrators can clear all ticket notes.")],
        flags: 64
      });
    }

    await notes.clear(t.ticket_id, interaction.guild.id);
    await recordTicketEventSafe({
      guild_id: interaction.guild.id,
      ticket_id: t.ticket_id,
      channel_id: interaction.channel.id,
      actor_id: interaction.user.id,
      actor_kind: "staff",
      actor_label: interaction.user.tag,
      event_type: "ticket_notes_cleared",
      visibility: "internal",
      title: "Notes cleared",
      description: `${interaction.user.tag} cleared the internal notes for ticket #${t.ticket_id}.`,
      metadata: {},
    });
    return interaction.reply({
      embeds: [E.successEmbed("All ticket notes were cleared.")],
      flags: 64
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  //   note add
  // ────────────────────────────────────────────────────────────────────────────
  if (subcommand === "add") {
    // Verificar límite de notas
    const existingNotes = await notes.get(t.ticket_id, interaction.guild.id);
    if (existingNotes.length >= MAX_NOTES_PER_TICKET) {
      return interaction.reply({
        embeds: [E.errorEmbed(
          `Ticket note limit reached (**${MAX_NOTES_PER_TICKET}** notes max per ticket). ` +
          `Use \`/ticket note clear\` if you need to clean them up.`
        )],
        flags: 64
      });
    }

    const nota = interaction.options.getString("note") || interaction.options.getString("nota");
    await notes.add(t.ticket_id, interaction.user.id, nota, interaction.guild.id);
    await recordTicketEventSafe({
      guild_id: interaction.guild.id,
      ticket_id: t.ticket_id,
      channel_id: interaction.channel.id,
      actor_id: interaction.user.id,
      actor_kind: "staff",
      actor_label: interaction.user.tag,
      event_type: "ticket_note_added",
      visibility: "internal",
      title: "Internal note added",
      description: `${interaction.user.tag} added an internal note to ticket #${t.ticket_id}.`,
      metadata: {
        notePreview: String(nota || "").slice(0, 160),
      },
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle("Internal note added")
          .setDescription(nota)
          .setFooter({
            text: `By ${interaction.user.tag} · ${existingNotes.length + 1}/${MAX_NOTES_PER_TICKET}`
          })
          .setTimestamp()
      ],
      flags: 64
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  //   note list
  // ────────────────────────────────────────────────────────────────────────────
  if (subcommand === "list") {
    const nl = await notes.get(t.ticket_id, interaction.guild.id);
    if (!nl.length) {
      return interaction.reply({
        embeds: [E.infoEmbed("Ticket notes", "There are no notes on this ticket yet.")],
        flags: 64
      });
    }

    const txt = nl.map((n, i) => `**${i + 1}.** <@${n.staff_id}>: ${n.note}`).join("\n");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(E.Colors.WARNING)
          .setTitle(`Ticket notes — #${t.ticket_id} (${nl.length}/${MAX_NOTES_PER_TICKET})`)
          .setDescription(txt)
          .setTimestamp()
      ],
      flags: 64
    });
  }
}
