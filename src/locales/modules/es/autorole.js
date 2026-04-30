module.exports = {
  autorole: {
    choices: {
      mode_replace: "Reemplazar - Remover roles de nivel anteriores",
      mode_stack: "Acumular - Mantener todos los roles de nivel anteriores"
    },
    errors: {
      add_failed: "❌ Error al agregar rol por reacción. Por favor intenta de nuevo.",
      join_remove_failed: "❌ Error al remover el rol de entrada. Por favor intenta de nuevo.",
      join_set_failed: "❌ Error al configurar el rol de entrada. Por favor intenta de nuevo.",
      level_add_failed: "❌ Error al agregar rol de nivel. Por favor intenta de nuevo.",
      level_remove_failed: "❌ Error al remover rol de nivel. Por favor intenta de nuevo.",
      list_failed: "❌ Error al listar auto-roles. Por favor intenta de nuevo.",
      message_not_found: "❌ Mensaje no encontrado en este canal. Asegúrate de que el ID del mensaje sea correcto.",
      no_autoroles: "📭 No hay auto-roles configurados aún.",
      no_level_roles: "📭 No hay roles de nivel configurados.",
      not_found: "❌ Rol por reacción no encontrado.",
      panel_failed: "❌ Error al crear el panel. Por favor intenta de nuevo.",
      remove_failed: "❌ Error al remover rol por reacción. Por favor intenta de nuevo.",
      role_hierarchy: "❌ No puedo asignar este rol porque es superior o igual a mi rol más alto."
    },
    list: {
      join_role: "👋 Rol de Entrada",
      join_role_value: "Rol: {{role}}\nRetraso: {{delay}}s\nExcluir bots: {{excludeBots}}",
      level_entry: "**Nivel {{level}}:** <@&{{roleId}}>",
      level_roles: "📊 Roles de Nivel ({{mode}})",
      message: "Mensaje",
      reaction_roles: "⚡ Roles por Reacción",
      title: "🎭 Configuración de Auto-Roles"
    },
    options: {
      autorole_join_set_delay_delay: "Retraso en segundos antes de asignar el rol",
      autorole_join_set_exclude_bots_exclude_bots: "Excluir bots de recibir el rol",
      autorole_join_set_role_role: "Rol a asignar cuando los usuarios se unan",
      autorole_level_add_level_level: "Nivel requerido para recibir el rol",
      autorole_level_add_role_role: "Rol a asignar en este nivel",
      autorole_level_mode_mode_mode: "Modo para roles de nivel (acumular o reemplazar)",
      autorole_level_remove_level_level: "Nivel del cual quitar el rol",
      autorole_reaction_add_emoji_emoji: "Emoji para reaccionar",
      autorole_reaction_add_message_id_message_id: "ID del mensaje para agregar rol por reacción",
      autorole_reaction_add_role_role: "Rol a asignar al reaccionar",
      autorole_reaction_panel_channel_channel: "Canal donde crear el panel (predeterminado: actual)",
      autorole_reaction_panel_description_description: "Descripción para el panel",
      autorole_reaction_panel_title_title: "Título para el panel",
      autorole_reaction_remove_emoji_emoji: "Emoji a quitar",
      autorole_reaction_remove_message_id_message_id: "ID del mensaje para quitar rol por reacción"
    },
    panel: {
      description: "¡Reacciona a este mensaje para obtener roles!\n\nHaz clic en las reacciones de abajo para alternar tus roles.",
      footer: "Reacciona para obtener roles • Remueve la reacción para remover el rol",
      title: "🎭 Selección de Roles"
    },
    slash: {
      description: "Configurar asignación automática de roles",
      groups: {
        join: "Gestionar roles de entrada",
        level: "Gestionar roles de nivel",
        reaction: "Gestionar roles por reacción"
      },
      subcommands: {
        join_remove: {
          description: "Quitar el rol de entrada"
        },
        join_set: {
          description: "Configurar un rol para dar cuando los usuarios se unan",
          options: {
            delay: "Retraso en segundos antes de asignar (predeterminado: 0)",
            exclude_bots: "Excluir bots de recibir el rol",
            role: "Rol a asignar al unirse"
          }
        },
        level_add: {
          description: "Añadir una recompensa de rol por nivel",
          options: {
            level: "Nivel requerido",
            role: "Rol a asignar"
          }
        },
        level_list: {
          description: "Listar todas las recompensas de rol por nivel"
        },
        level_mode: {
          description: "Configurar modo de roles de nivel",
          options: {
            mode: "Modo (acumular o reemplazar)"
          }
        },
        level_remove: {
          description: "Quitar una recompensa de rol por nivel",
          options: {
            level: "Nivel a quitar"
          }
        },
        list: {
          description: "Listar todas las configuraciones de auto-roles"
        },
        reaction_add: {
          description: "Agregar un rol por reacción a un mensaje",
          options: {
            emoji: "Emoji para reaccionar",
            message_id: "ID del mensaje",
            role: "Rol a asignar"
          }
        },
        reaction_panel: {
          description: "Crear un panel de roles por reacción",
          options: {
            channel: "Canal donde publicar el panel"
          }
        },
        reaction_remove: {
          description: "Quitar un rol por reacción de un mensaje",
          options: {
            emoji: "Emoji a quitar",
            message_id: "ID del mensaje"
          }
        }
      }
    },
    success: {
      join_removed: "✅ Rol de entrada removido.",
      join_set: "✅ ¡Rol de entrada configurado a {{role}}!\nRetraso: {{delay}} segundos\nExcluir bots: {{excludeBots}}",
      level_added: "✅ ¡Rol de nivel agregado! Los usuarios que alcancen el nivel {{level}} recibirán {{role}}.",
      level_removed: "✅ Rol de nivel removido para el nivel {{level}}.",
      mode_set: "✅ Modo de roles de nivel configurado a **{{mode}}**.",
      panel_created: "✅ ¡Panel de roles por reacción creado en {{channel}}!\n\nID del mensaje: `{{messageId}}`\n\nUsa `/autorole reaction add` para agregar roles a este panel.",
      reaction_added: "✅ ¡Rol por reacción agregado! Los usuarios que reaccionen con {{emoji}} recibirán {{role}}.",
      reaction_removed: "✅ Rol por reacción removido para {{emoji}}."
    }
  }
};
