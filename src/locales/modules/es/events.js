module.exports = {
  events: {
    guildMemberAdd: {
      anti_raid: {
        action_alert: "Solo alertar",
        action_kick: "Expulsar automáticamente",
        description: "Se detectaron **{{recentJoins}} entradas** en **{{seconds}}s**.\nÚltima entrada: **{{memberTag}}**",
        fields: {
          action: "Acción",
          threshold: "Umbral"
        },
        title: "Anti-raid activado"
      },
      dm: {
        fields: {
          verification_required: "Verificación requerida",
          verification_value: "Ve a {{channel}} para verificarte y acceder al servidor."
        },
        title: "Bienvenido a {{guild}}"
      },
      modlog: {
        fields: {
          account_created: "Cuenta creada",
          member_count: "Miembro #",
          user: "Usuario"
        },
        footer: "ID: {{id}}",
        title: "Miembro entró"
      },
      welcome: {
        default_title: "¡Bienvenido!",
        fields: {
          member_count: "Miembro #",
          user: "Usuario"
        }
      }
    },
    guildMemberRemove: {
      goodbye: {
        default_message: "Lamentamos ver partir a **{user}**. Esperamos verte pronto otra vez.",
        default_title: "¡Adiós!",
        fields: {
          remaining_members: "Miembros restantes",
          user: "Usuario"
        },
        remaining_members_value: "{{count}} miembros"
      },
      modlog: {
        fields: {
          joined_at: "Se unió",
          remaining_members: "Miembros restantes",
          roles: "Roles",
          user: "Usuario"
        },
        footer: "ID: {{id}}",
        no_roles: "Ninguno",
        title: "Miembro salió",
        unknown_join: "Desconocido"
      }
    },
    guildMemberUpdate: {
      footer: "ID: {{id}}",
      nickname: {
        fields: {
          after: "Después",
          before: "Antes",
          executor: "Ejecutado por",
          user: "Usuario"
        },
        title: "Apodo actualizado"
      },
      roles: {
        fields: {
          added: "Roles agregados",
          executor: "Ejecutado por",
          removed: "Roles quitados",
          user: "Usuario"
        },
        title: "Roles actualizados"
      },
      unknown_executor: "Desconocido"
    },
    messageDelete: {
      fields: {
        author: "Autor",
        channel: "Canal",
        content: "Contenido"
      },
      footer: "ID del mensaje: {{id}}",
      no_text: "*(sin texto)*",
      title: "Mensaje eliminado",
      unknown_author: "Desconocido"
    },
    modlog: {
      ban_title: "Ban título",
      edit_empty: "Edit vacío",
      edit_title: "Edit título",
      fields: {
        after: "Después",
        author: "Autor",
        before: "Antes",
        channel: "Canal",
        executor: "Executor",
        link: "Enlace",
        reason: "Razón",
        user: "Usuario"
      },
      goto_message: "Goto message",
      no_reason: "No reason",
      unban_title: "Unban título",
      unknown_executor: "Desconocido executor"
    }
  },
  "events.guildMemberAdd.anti_raid.action_alert": "Solo alertar",
  "events.guildMemberAdd.anti_raid.action_kick": "Expulsar automáticamente",
  "events.guildMemberAdd.anti_raid.description": "{{user}} entró mientras las protecciones anti-raid estaban activas.",
  "events.guildMemberAdd.anti_raid.fields.action": "Acción",
  "events.guildMemberAdd.anti_raid.fields.threshold": "Umbral",
  "events.guildMemberAdd.anti_raid.title": "Anti-raid activado",
  "events.guildMemberAdd.dm.fields.verification_required": "Verificación requerida",
  "events.guildMemberAdd.dm.fields.verification_value": "Completa la verificación para desbloquear el servidor.",
  "events.guildMemberAdd.dm.title": "Bienvenido a {{guild}}",
  "events.guildMemberAdd.modlog.fields.account_created": "Cuenta creada",
  "events.guildMemberAdd.modlog.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.modlog.fields.user": "Usuario",
  "events.guildMemberAdd.modlog.footer": "Evento de entrada registrado",
  "events.guildMemberAdd.modlog.title": "Miembro Unido",
  "events.guildMemberAdd.welcome.default_title": "¡Bienvenido, {{user}}!",
  "events.guildMemberAdd.welcome.fields.member_count": "Cantidad de miembros",
  "events.guildMemberAdd.welcome.fields.user": "Usuario",
  "events.guildMemberRemove.goodbye.default_message": "Esperamos verte nuevamente pronto.",
  "events.guildMemberRemove.goodbye.default_title": "Adiós, {{user}}",
  "events.guildMemberRemove.goodbye.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.goodbye.fields.user": "Usuario",
  "events.guildMemberRemove.goodbye.remaining_members_value": "{{count}} miembros restantes",
  "events.guildMemberRemove.modlog.fields.joined_at": "Se unió el",
  "events.guildMemberRemove.modlog.fields.remaining_members": "Miembros restantes",
  "events.guildMemberRemove.modlog.fields.roles": "Roles",
  "events.guildMemberRemove.modlog.fields.user": "Usuario",
  "events.guildMemberRemove.modlog.footer": "Evento de salida registrado",
  "events.guildMemberRemove.modlog.no_roles": "Sin roles",
  "events.guildMemberRemove.modlog.title": "Miembro Salió",
  "events.guildMemberRemove.modlog.unknown_join": "Fecha de entrada desconocida",
  "events.guildMemberUpdate.footer": "Actualización de miembro registrada",
  "events.guildMemberUpdate.nickname.fields.after": "Después",
  "events.guildMemberUpdate.nickname.fields.before": "Antes",
  "events.guildMemberUpdate.nickname.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.nickname.fields.user": "Usuario",
  "events.guildMemberUpdate.nickname.title": "Apodo Actualizado",
  "events.guildMemberUpdate.roles.fields.added": "Roles agregados",
  "events.guildMemberUpdate.roles.fields.executor": "Actualizado por",
  "events.guildMemberUpdate.roles.fields.removed": "Roles removidos",
  "events.guildMemberUpdate.roles.fields.user": "Usuario",
  "events.guildMemberUpdate.roles.title": "Roles Actualizados",
  "events.guildMemberUpdate.unknown_executor": "Ejecutor desconocido",
  "events.messageDelete.fields.author": "Autor",
  "events.messageDelete.fields.channel": "Canal",
  "events.messageDelete.fields.content": "Contenido",
  "events.messageDelete.footer": "ID del mensaje: {{id}}",
  "events.messageDelete.no_text": "Sin contenido de texto.",
  "events.messageDelete.title": "Mensaje Eliminado",
  "events.messageDelete.unknown_author": "Autor desconocido",
  "events.modlog.ban_title": "🔨 Usuario Baneado",
  "events.modlog.edit_empty": "(vacío)",
  "events.modlog.edit_title": "✏️ Mensaje Editado",
  "events.modlog.fields.after": "📝 Después",
  "events.modlog.fields.author": "👤 Autor",
  "events.modlog.fields.before": "📝 Antes",
  "events.modlog.fields.channel": "📍 Canal",
  "events.modlog.fields.executor": "🛡️ Ejecutado por",
  "events.modlog.fields.link": "🔗 Enlace",
  "events.modlog.fields.reason": "📋 Razón",
  "events.modlog.fields.user": "👤 Usuario",
  "events.modlog.goto_message": "Ir al mensaje",
  "events.modlog.no_reason": "Sin razón especificada",
  "events.modlog.unban_title": "✅ Usuario Desbaneado",
  "events.modlog.unknown_executor": "Desconocido"
};
