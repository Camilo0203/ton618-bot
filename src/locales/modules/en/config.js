module.exports = {
  config: {
    category: {
      add_description: "Initialize a new ticket category",
      edit_description: "Update settings for an existing category",
      group_description: "Manage ticket categories and triage rules",
      list_description: "List all active ticket categories",
      option_description: "Detailed category description",
      option_discord_category: "Target Discord category ID",
      option_discord_category_edit: "New Discord category ID",
      option_emoji: "Category emoji",
      option_id: "Category identifier",
      option_id_edit: "ID of the category to modify",
      option_id_remove: "ID of the category to remove",
      option_id_toggle: "ID of the category to toggle status",
      option_label: "User-visible label",
      option_ping_roles: "Roles to notify (IDs separated by commas)",
      option_priority: "Default ticket priority",
      option_welcome_message: "Custom welcome message",
      remove_description: "Permanently delete a category from the server",
      toggle_description: "Enable or disable a category"
    },
    slash: {
      description: "Premium administration and server configuration console",
      subcommands: {
        center: {
          description: "Open the interactive configuration center"
        },
        status: {
          description: "View general system and commercial status"
        },
        tickets: {
          description: "Review operational health of the ticket system"
        }
      }
    }
  },
  "config.category.add_success_description": "Created category `{{categoryId}}` as **{{label}}**. {{verification}}",
  "config.category.add_title": "Category Created",
  "config.category.add_verification_failed": "Verification checks need attention.",
  "config.category.add_verification_success": "Verification checks passed.",
  "config.category.admin_only": "Only administrators can manage ticket categories.",
  "config.category.edit_discord_line": "Discord category: {{discordCategory}}",
  "config.category.edit_emoji_line": "Emoji: {{emoji}}",
  "config.category.edit_ping_line": "Ping roles: {{count}}",
  "config.category.edit_success_message": "Updated **{{label}}**.\nStatus: {{status}}\n{{emojiLine}}{{discordCategoryLine}}{{pingRolesLine}}{{welcomeLine}}",
  "config.category.edit_title": "Category Updated",
  "config.category.edit_welcome_line": "Custom welcome message enabled",
  "config.category.error_generic": "Something went wrong while updating categories. {{message}}",
  "config.category.error_no_category": "Category `{{categoryId}}` does not exist.",
  "config.category.error_no_fields": "Provide at least one field to update.",
  "config.category.error_not_found": "Category `{{categoryId}}` was not found.",
  "config.category.error_remove_failed": "Failed to remove the selected category.",
  "config.category.footer": "TON618 Category Controls",
  "config.category.footer_free": "TON618 Community Edition",
  "config.category.list_description_empty": "No ticket categories are configured yet.",
  "config.category.list_description_empty_free": "No ticket categories are configured yet. Pro unlocks advanced category routing.",
  "config.category.list_extras_discord": "Linked Discord category",
  "config.category.list_extras_ping_roles": "{{count}} ping role(s)",
  "config.category.list_extras_welcome": "Custom welcome message",
  "config.category.list_pro_note": "Upgrade to Pro for advanced routing, priorities and category rules.",
  "config.category.list_status_disabled": "Disabled",
  "config.category.list_status_enabled": "Enabled",
  "config.category.list_title": "Configured Categories: {{count}}",
  "config.category.list_title_empty": "No Categories Configured",
  "config.category.remove_success_message": "Removed category `{{categoryId}}` (**{{label}}**).",
  "config.category.remove_title": "Category Removed",
  "config.category.toggle_description_disabled": "**{{label}}** is now disabled.",
  "config.category.toggle_description_enabled": "**{{label}}** is now enabled.",
  "config.category.toggle_title_disabled": "Category Disabled",
  "config.category.toggle_title_enabled": "Category Enabled"
};
