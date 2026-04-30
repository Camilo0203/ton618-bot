module.exports = {
  warn: {
    fields: {
      list: "Advertencias",
      moderator: "Moderador",
      reason: "Motivo",
      total: "Advertencias totales",
      user: "Usuario"
    },
    options: {
      warn_add_reason_reason: "Razón de la advertencia",
      warn_add_user_user: "Miembro a advertir",
      warn_check_user_user: "Miembro cuyas advertencias deseas inspeccionar",
      warn_remove_id_id: "ID de la advertencia"
    },
    responses: {
      add_description: "Se registró una advertencia para {{user}}.",
      add_title: "Advertencia agregada",
      auto_kick_failed: "La acción automática falló: no pude expulsar al miembro al llegar a 5 advertencias.",
      auto_kick_success: "Acción automática: el miembro fue expulsado al llegar a 5 advertencias.",
      auto_timeout_failed: "La acción automática falló: no pude silenciar al miembro al llegar a 3 advertencias.",
      auto_timeout_success: "Acción automática: el miembro fue silenciado durante 1 hora al llegar a 3 advertencias.",
      footer_id: "ID de advertencia: {{id}}",
      list_description: "Advertencias almacenadas: **{{count}}**.",
      list_entry: "**{{index}}.** `{{id}}`\nMotivo: {{reason}}\nModerador: <@{{moderatorId}}>\nFecha: <t:{{timestamp}}:R>",
      list_footer: "Usa `/warn remove` con el ID de la advertencia para eliminar un registro.",
      list_title: "Advertencias de {{user}}",
      none_description: "{{user}} no tiene advertencias en este servidor.",
      none_title: "Sin advertencias",
      not_found_description: "No encontré una advertencia con ID `{{id}}`.",
      not_found_title: "Advertencia no encontrada",
      remove_description: "La advertencia `{{id}}` fue eliminada correctamente.",
      remove_title: "Advertencia eliminada"
    },
    slash: {
      description: "Gestiona advertencias de miembros",
      options: {
        id: "ID de la advertencia",
        reason: "Motivo de la advertencia",
        user_inspect: "Miembro cuyas advertencias quieres revisar",
        user_warn: "Miembro al que advertir"
      },
      subcommands: {
        add: {
          description: "Agrega una advertencia a un miembro"
        },
        check: {
          description: "Muestra las advertencias de un miembro"
        },
        remove: {
          description: "Elimina una advertencia por ID"
        }
      }
    }
  }
};
