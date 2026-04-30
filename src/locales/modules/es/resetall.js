module.exports = {
  resetall: {
    collections_cleared: "📁 Colecciones a limpiar: {{count}}",
    collections_cleared_count: "📁 Colecciones limpiadas: {{count}}",
    confirmation_code: "🔑 Código de Confirmación",
    confirmation_value: "Para ejecutar, usa `/resetall execute` con el código: `{{code}}`",
    documents_deleted: "📄 Documentos estimados: {{count}}",
    documents_deleted_count: "🗑️ Total de documentos eliminados: {{count}}",
    errors: "❌ Errores: {{count}}",
    executing_desc: "Eliminando todas las configuraciones de guilds...",
    executing_title: "🗑️ Ejecutando Restablecimiento Masivo...",
    guilds_affected: "🏠 Guilds afectados: {{count}}",
    invalid_code: "❌ Código de confirmación inválido. Obtén el código correcto de `/resetall preview`.",
    no_code: "❌ Este comando requiere un código de confirmación de `/resetall preview`.",
    owner_only: "🔒 Este comando está restringido al dueño del bot.",
    preview_description: "Esto eliminará los siguientes datos de TODOS los guilds:",
    preview_title: "🗑️ Vista Previa de Restablecimiento Masivo",
    slash: {
      description: "Restablecer TODAS las configuraciones de guilds (Solo owner)",
      options: {
        confirm_code: "Código de confirmación (se proporcionará)"
      },
      subcommands: {
        execute: {
          description: "Ejecutar el restablecimiento completo con código de confirmación"
        },
        preview: {
          description: "Vista previa de lo que se eliminará sin ejecutar"
        }
      }
    },
    success_description: "Todas las configuraciones de guilds han sido restablecidas.",
    success_title: "✅ Restablecimiento Masivo Completo",
    warning: "⚠️ ADVERTENCIA",
    warning_value: "Esta acción es DESTRUCTIVA y NO PUEDE deshacerse. Todas las configuraciones de guilds serán eliminadas permanentemente."
  }
};
