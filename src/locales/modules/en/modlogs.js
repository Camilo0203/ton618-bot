module.exports = {
  modlogs: {
    events: {
      bans: "Bans",
      joins: "Member joins",
      kicks: "Kicks",
      leaves: "Member leaves",
      message_delete: "Deleted messages",
      message_edit: "Edited messages",
      nickname: "Nickname changes",
      role_add: "Added roles",
      role_remove: "Removed roles",
      unbans: "Unbans"
    },
    fields: {
      channel: "Channel",
      status: "Status"
    },
    options: {
      modlogs_channel_channel_channel: "Text channel for moderation logs",
      modlogs_config_enabled_enabled: "Whether that event type should be logged",
      modlogs_config_event_event: "Event type to configure",
      modlogs_enabled_enabled_enabled: "Whether the feature stays enabled",
      modlogs_setup_channel_channel: "Text channel for moderation logs"
    },
    responses: {
      channel_required: "Set a modlog channel before enabling the system.",
      channel_updated: "Modlog channel updated to {{channel}}.",
      enabled_state: "Modlogs are now **{{state}}**.",
      event_state: "{{event}} logging is now **{{state}}**.",
      info_title: "Modlog configuration",
      setup_description: "Moderation logs are now active in {{channel}}.",
      setup_title: "Modlogs configured"
    },
    slash: {
      choices: {
        bans: "Bans",
        joins: "Member joins",
        kicks: "Kicks",
        leaves: "Member leaves",
        message_delete: "Deleted messages",
        message_edit: "Edited messages",
        nickname: "Nickname changes",
        role_add: "Added roles",
        role_remove: "Removed roles",
        unbans: "Unbans"
      },
      description: "Configure moderation logs",
      options: {
        channel: "Text channel for moderation logs",
        enabled: "Whether the feature stays enabled",
        event: "Event type to configure",
        event_enabled: "Whether that event type should be logged"
      },
      subcommands: {
        channel: {
          description: "Change the modlog channel"
        },
        config: {
          description: "Enable or disable one logged event type"
        },
        enabled: {
          description: "Enable or disable the modlog system"
        },
        info: {
          description: "View the current modlog configuration"
        },
        setup: {
          description: "Enable modlogs and set the main log channel"
        }
      }
    }
  }
};
