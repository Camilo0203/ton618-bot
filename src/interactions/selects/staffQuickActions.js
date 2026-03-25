const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { settings, tickets } = require("../../utils/database");
const { checkStaff } = require("../../utils/commandUtils");
const E = require("../../utils/embeds");
const TH = require("../../handlers/ticketHandler");
const { updateTicketControlPanelEmbed } = require("../../utils/ticketEmbedUpdater");

module.exports = {
  customId: "staff_quick_actions",
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const guildSettings = await settings.get(interaction.guild.id);
      if (!checkStaff(interaction.member, guildSettings)) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Solo el staff puede utilizar estas acciones.")],
        });
      }

      const action = interaction.values[0];
      const channel = interaction.channel;
      const ticket = await tickets.get(channel.id);

      if (!ticket) {
        return interaction.editReply({
          embeds: [E.errorEmbed("No se encontró información del ticket.")],
        });
      }

      switch (action) {
        case "priority_low":
        case "priority_normal":
        case "priority_high":
        case "priority_urgent": {
          const newPriority = action.split("_")[1];
          await tickets.update(channel.id, { priority: newPriority });
          
          const updatedTicket = await tickets.get(channel.id);
          await updateTicketControlPanelEmbed(channel, updatedTicket);
          
          await interaction.editReply({
            embeds: [E.successEmbed(`Prioridad cambiada a **${E.priorityLabel(newPriority)}** por <@${interaction.user.id}>.`) ]
          });
          break;
        }
        case "status_wait":
        case "status_pending":
        case "status_review": {
          const statusEmojis = {
            status_wait: "<:orangedot:1486126959531528242>",
            status_pending: "<:greendot:1486126957526782002>",
            status_review: "<:bluedot:1486126956243193886>"
          };
          const statusTexts = {
            status_wait: "En Espera",
            status_pending: "Pendiente de Usuario",
            status_review: "En Revisión"
          };
          const statusLabels = {
            status_wait: `${statusEmojis.status_wait} ${statusTexts.status_wait}`,
            status_pending: `${statusEmojis.status_pending} ${statusTexts.status_pending}`,
            status_review: `${statusEmojis.status_review} ${statusTexts.status_review}`
          };
          const workflowStatusMap = {
            status_wait: "waiting_staff",
            status_pending: "waiting_user",
            status_review: "triage"
          };
          const newStatusLabel = statusLabels[action];
          const newWorkflowStatus = workflowStatusMap[action];
          
          await tickets.update(channel.id, { 
            workflow_status: newWorkflowStatus,
            status_label: newStatusLabel
          });
          
          try {
            const messages = await channel.messages.fetch({ limit: 15 });
            const controlPanel = messages.find(m => 
              m.author.bot && 
              m.embeds.length > 0 && 
              m.embeds[0].title?.includes("Panel de Control")
            );
            
            if (controlPanel) {
              const oldEmbed = controlPanel.embeds[0];
              let fields = [...(oldEmbed.fields || [])];
              
              const statusFieldIndex = fields.findIndex(f => 
                f.name.toLowerCase().includes("estado")
              );
              
              if (statusFieldIndex !== -1) {
                fields[statusFieldIndex] = { 
                  name: fields[statusFieldIndex].name, 
                  value: newStatusLabel, 
                  inline: fields[statusFieldIndex].inline 
                };
              } else {
                fields.push({ name: "Estado", value: newStatusLabel, inline: true });
              }
              
              const newEmbed = EmbedBuilder.from(oldEmbed).setFields(fields);
              await controlPanel.edit({ embeds: [newEmbed], components: controlPanel.components });
              console.log('[STATUS UPDATE] Campo Estado actualizado a:', newStatusLabel);
            }
          } catch (embedError) {
            console.error('[STATUS UPDATE ERROR]', embedError.message);
          }
          
          await interaction.editReply({
            embeds: [E.successEmbed(`Estado del ticket cambiado a **${newStatusLabel}** por <@${interaction.user.id}>.`)]
          });
          break;
        }
        case "add_staff": {
          return interaction.editReply({
            content: "Menciona al staff que deseas añadir a este ticket.",
          });
        }
        default:
          return interaction.editReply({ content: "Acción no reconocida." });
      }
    } catch (error) {
      console.error("[STAFF QUICK ACTIONS ERROR]", error);
      
      if (interaction.deferred) {
        return interaction.editReply({
          embeds: [E.errorEmbed("Ocurrió un error al procesar la acción.")],
        }).catch(() => {});
      }
      
      return interaction.reply({
        embeds: [E.errorEmbed("Ocurrió un error al procesar la acción.")],
        flags: 64
      }).catch(() => {});
    }
  }
};
