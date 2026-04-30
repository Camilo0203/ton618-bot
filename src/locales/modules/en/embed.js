module.exports = {
  embed: {
    announcement_prefix: "📢 ",
    errors: {
      channel_not_found: "Target channel not found.",
      form_expired: "Form session expired.",
      invalid_color: "Invalid HEX color format.",
      invalid_image_url: "Image URL must start with http/https.",
      invalid_thumbnail_url: "Thumbnail URL must start with http/https.",
      message_not_found: "Message not found.",
      no_embeds: "That message has no embeds.",
      not_bot_message: "That message was not sent by the bot.",
      pro_required: "✨ Embed templates require **TON618 Pro**.",
      template_exists: "Template `{{name}}` already exists.",
      template_not_found: "Template `{{name}}` not found."
    },
    footer: {
      announcement: "Official Announcement from {{guildName}}",
      sent_by: "Sent by {{username}}"
    },
    modal: {
      create_title: "✨ Create Embed",
      edit_title: "✏️ Edit Embed",
      field_color_label: "HEX Color without #",
      field_description_label: "Description",
      field_description_placeholder: "Write embed content here...",
      field_extra_fallback_name: "Field",
      field_extra_label: "Extra fields (name|value|inline)",
      field_extra_placeholder: "Field Name|Field Value|true\nOther Field|Value|false",
      field_title_label: "Title (leave blank for none)"
    },
    slash: {
      description: "✨ Custom embed builder",
      options: {
        author: "Author name",
        author_icon: "Author icon URL",
        channel: "Target channel",
        color: "HEX Color",
        description: "Description",
        footer: "Footer text",
        image: "Image URL",
        mention: "Mention when sending",
        message_id: "Message ID",
        template_name: "Template name",
        text: "Announcement content",
        thumbnail: "Thumbnail URL",
        timestamp: "Show timestamp",
        title: "Title"
      },
      subcommands: {
        announcement: {
          description: "Professional announcement template"
        },
        create: {
          description: "Create and send an embed"
        },
        edit: {
          description: "Edit an existing embed"
        },
        quick: {
          description: "Send a simple quick embed"
        },
        template: {
          delete: {
            description: "Delete a template"
          },
          description: "✨ Manage embed templates (Pro)",
          list: {
            description: "List all server templates"
          },
          load: {
            description: "Load and send a template"
          },
          save: {
            description: "Save current config as template"
          }
        }
      }
    },
    success: {
      announcement_sent: "📢 Announcement broadcast in {{channel}}.",
      edited: "✅ Embed edited successfully.",
      sent: "✅ Embed sent to {{channel}}.",
      template_deleted: "✅ Template **{{name}}** deleted.",
      template_saved: "✅ Template **{{name}}** saved successfully."
    },
    templates: {
      footer: "Total: {{count}}/50 templates",
      list_title: "Embed Templates - {{guildName}}",
      no_templates: "No saved templates. Use `/embed template save`."
    }
  }
};
