module.exports = {
  autorole: {
    choices: {
      mode_replace: "Replace - Remove previous level roles",
      mode_stack: "Stack - Keep all previous level roles"
    },
    errors: {
      add_failed: "Failed to add reaction role reward.",
      join_remove_failed: "Failed to disable join role.",
      join_set_failed: "Failed to configure join role.",
      level_add_failed: "Failed to add level reward.",
      level_remove_failed: "Failed to remove level reward.",
      list_failed: "Failed to fetch auto-role list.",
      message_not_found: "The specified message could not be found in this channel.",
      no_autoroles: "No auto-role configurations found for this server.",
      no_level_roles: "No level role rewards are configured.",
      not_found: "No reaction role reward found for this configuration.",
      panel_failed: "Failed to create reaction role panel.",
      remove_failed: "Failed to remove reaction role reward.",
      role_hierarchy: "I cannot assign this role because it is higher than my highest role."
    },
    list: {
      join_role: "📥 Join Role",
      join_role_value: "**Role:** {{role}}\n**Delay:** {{delay}}s\n**Exclude Bots:** {{excludeBots}}",
      level_entry: "**Level {{level}}:** <@&{{roleId}}>",
      level_roles: "📈 Level Rewards (Mode: {{mode}})",
      message: "Message",
      reaction_roles: "🔘 Reaction Roles",
      title: "✨ Auto-Role Configurations"
    },
    options: {
      autorole_join_set_delay_delay: "Delay in seconds antes de assign el rol",
      autorole_join_set_exclude_bots_exclude_bots: "Exclude bots from receiving role",
      autorole_join_set_role_role: "Rol a assign cuando los users se unan",
      autorole_level_add_level_level: "Level required to receive el rol",
      autorole_level_add_role_role: "Rol a assign at this level",
      autorole_level_mode_mode_mode: "Mode for level roles (stack or replace)",
      autorole_level_remove_level_level: "Nivel del cual quitar el rol",
      autorole_reaction_add_emoji_emoji: "Emoji to reaccionar",
      autorole_reaction_add_message_id_message_id: "Message ID to add reaction role",
      autorole_reaction_add_role_role: "Rol a assign when reacting",
      autorole_reaction_panel_channel_channel: "Channel to create the panel (default: current)",
      autorole_reaction_panel_description_description: "Description for the panel",
      autorole_reaction_panel_title_title: "Title for the panel",
      autorole_reaction_remove_emoji_emoji: "Emoji to remove",
      autorole_reaction_remove_message_id_message_id: "Message ID to remove reaction role"
    },
    panel: {
      description: "Select the roles you want by reacting below.",
      footer: "TON618 Reaction Roles",
      title: "Role Selection"
    },
    slash: {
      description: "Configure assignment automatic de roles",
      groups: {
        join: "Manage join roles",
        level: "Manage level roles",
        reaction: "Manage reaction roles"
      },
      subcommands: {
        join_remove: {
          description: "Remove the join role"
        },
        join_set: {
          description: "Set a role to give when users join",
          options: {
            delay: "Delay in seconds before assigning (default: 0)",
            exclude_bots: "Exclude bots from receiving role",
            role: "Role to assign on join"
          }
        },
        level_add: {
          description: "Add a level role reward",
          options: {
            level: "Level required",
            role: "Role to assign"
          }
        },
        level_list: {
          description: "List all level role rewards"
        },
        level_mode: {
          description: "Set level role mode",
          options: {
            mode: "Mode (stack or replace)"
          }
        },
        level_remove: {
          description: "Remove a level role reward",
          options: {
            level: "Level to remove"
          }
        },
        list: {
          description: "List all auto-role configurations"
        },
        reaction_add: {
          description: "Add a reaction role to a message",
          options: {
            emoji: "Emoji to react with",
            message_id: "Message ID",
            role: "Role to assign"
          }
        },
        reaction_panel: {
          description: "Create a reaction roles panel",
          options: {
            channel: "Channel to post the panel"
          }
        },
        reaction_remove: {
          description: "Remove a reaction role from a message",
          options: {
            emoji: "Emoji to remove",
            message_id: "Message ID"
          }
        }
      }
    },
    success: {
      join_removed: "✅ Join role has been disabled.",
      join_set: "✅ Join role set to {{role}} with {{delay}}s delay (Exclude Bots: {{excludeBots}})",
      level_added: "✅ Level {{level}} reward set to {{role}}.",
      level_removed: "✅ Level {{level}} reward removed.",
      mode_set: "✅ Level role mode set to **{{mode}}**.",
      panel_created: "✅ Reaction role panel created in {{channel}} (ID: {{messageId}})",
      reaction_added: "✅ Reaction role added: {{emoji}} → {{role}}",
      reaction_removed: "✅ Reaction role removed for emoji {{emoji}}"
    }
  }
};
