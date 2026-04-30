module.exports = {
  resetall: {
    collections_cleared: "📁 Collections to clear: {{count}}",
    collections_cleared_count: "📁 Collections cleared: {{count}}",
    confirmation_code: "🔑 Confirmation Code",
    confirmation_value: "To execute, run `/resetall execute` with code: `{{code}}`",
    documents_deleted: "📄 Estimated documents: {{count}}",
    documents_deleted_count: "🗑️ Total documents deleted: {{count}}",
    errors: "❌ Errors: {{count}}",
    executing_desc: "Deleting all guild configurations...",
    executing_title: "🗑️ Executing Mass Reset...",
    guilds_affected: "🏠 Guilds affected: {{count}}",
    invalid_code: "❌ Invalid confirmation code. Get the correct code from `/resetall preview`.",
    no_code: "❌ This command requires a confirmation code from `/resetall preview`.",
    owner_only: "🔒 This command is restricted to the bot owner.",
    preview_description: "This will delete the following data from ALL guilds:",
    preview_title: "🗑️ Mass Reset Preview",
    slash: {
      description: "Reset ALL guild configurations (Owner only)",
      options: {
        confirm_code: "Confirmation code (will be provided)"
      },
      subcommands: {
        execute: {
          description: "Execute the full reset with confirmation code"
        },
        preview: {
          description: "Preview what will be deleted without executing"
        }
      }
    },
    success_description: "All guild configurations have been reset.",
    success_title: "✅ Mass Reset Complete",
    warning: "⚠️ WARNING",
    warning_value: "This action is DESTRUCTIVE and CANNOT be undone. All guild-specific configurations will be permanently deleted."
  }
};
