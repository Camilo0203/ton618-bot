module.exports = {
  modlogs: {
    events: {
      bans: "Baneos",
      joins: "Entradas de miembros",
      kicks: "Expulsiones",
      leaves: "Salidas de miembros",
      message_delete: "Mensajes eliminados",
      message_edit: "Mensajes editados",
      nickname: "Cambios de apodo",
      role_add: "Roles agregados",
      role_remove: "Roles quitados",
      unbans: "Desbaneos"
    },
    fields: {
      channel: "Canal",
      status: "Estado"
    },
    options: {
      modlogs_channel_channel_channel: "Canal de texto para registros de moderación",
      modlogs_config_enabled_enabled: "Si ese tipo de evento debe registrarse",
      modlogs_config_event_event: "Tipo de evento a configurar",
      modlogs_enabled_enabled_enabled: "Si la función permanece habilitada",
      modlogs_setup_channel_channel: "Canal de texto para registros de moderación"
    },
    responses: {
      channel_required: "Define primero un canal de modlogs antes de activar el sistema.",
      channel_updated: "Canal de modlogs actualizado a {{channel}}.",
      enabled_state: "Los modlogs ahora están **{{state}}**.",
      event_state: "El registro de **{{event}}** ahora está **{{state}}**.",
      info_title: "Configuración de modlogs",
      setup_description: "Los logs de moderación ahora se enviarán a {{channel}}.",
      setup_title: "Modlogs configurados"
    },
    slash: {
      choices: {
        bans: "Baneos",
        joins: "Entradas de miembros",
        kicks: "Expulsiones",
        leaves: "Salidas de miembros",
        message_delete: "Mensajes eliminados",
        message_edit: "Mensajes editados",
        nickname: "Cambios de apodo",
        role_add: "Roles agregados",
        role_remove: "Roles quitados",
        unbans: "Desbaneos"
      },
      description: "Configura los logs de moderación",
      options: {
        channel: "Canal de texto para logs de moderación",
        enabled: "Si la función debe quedar activa",
        event: "Tipo de evento que quieres configurar",
        event_enabled: "Si ese tipo de evento debe registrarse"
      },
      subcommands: {
        channel: {
          description: "Cambia el canal de modlogs"
        },
        config: {
          description: "Activa o desactiva un tipo de evento registrado"
        },
        enabled: {
          description: "Activa o desactiva el sistema de modlogs"
        },
        info: {
          description: "Muestra la configuración actual de modlogs"
        },
        setup: {
          description: "Activa los modlogs y define el canal principal"
        }
      }
    }
  }
};
