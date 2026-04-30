module.exports = {
  embed: {
    announcement_prefix: "📢 ",
    errors: {
      channel_not_found: "Canal de destino no encontrado.",
      form_expired: "La sesión del formulario caducó. Por favor, reinicia el comando.",
      invalid_color: "Formato de color HEX inválido.",
      invalid_image_url: "La URL de la imagen debe comenzar con http/https.",
      invalid_thumbnail_url: "La URL de la miniatura debe comenzar con http/https.",
      message_not_found: "Mensaje no encontrado en este canal.",
      no_embeds: "Ese mensaje no contiene ningún embed.",
      not_bot_message: "Ese mensaje no fue enviado por el bot.",
      pro_required: "✨ Las plantillas de embed requieren **TON618 Pro**. ¡Mejora para guardar y reutilizar diseños!",
      template_exists: "Ya existe una plantilla con el nombre `{{name}}`.",
      template_not_found: "Plantilla `{{name}}` no encontrada."
    },
    footer: {
      announcement: "Anuncio Oficial de {{guildName}}",
      sent_by: "Enviado por {{username}}"
    },
    modal: {
      create_title: "✨ Crear Embed",
      edit_title: "✏️ Editar Embed",
      field_color_label: "Color HEX sin #",
      field_description_label: "Descripción",
      field_description_placeholder: "Escribe el contenido del embed aquí...",
      field_extra_fallback_name: "Campo",
      field_extra_label: "Campos extra (nombre|valor|inline)",
      field_extra_placeholder: "Nombre del Campo|Valor del Campo|true\nOtro Campo|Otro valor|false",
      field_title_label: "Título (dejar en blanco para ninguno)"
    },
    slash: {
      description: "✨ Constructor de embeds personalizados",
      options: {
        author: "Nombre del autor",
        author_icon: "URL del icono del autor",
        channel: "Canal de destino",
        color: "Color HEX",
        description: "Descripción",
        footer: "Texto del pie de página",
        image: "URL de la imagen",
        mention: "Mención al enviar",
        message_id: "ID del mensaje",
        template_name: "Nombre de la plantilla",
        text: "Contenido del anuncio",
        thumbnail: "URL de la miniatura",
        timestamp: "Mostrar fecha/hora",
        title: "Título"
      },
      subcommands: {
        announcement: {
          description: "Plantilla de anuncio profesional"
        },
        create: {
          description: "Crear y enviar un embed"
        },
        edit: {
          description: "Editar un embed existente"
        },
        quick: {
          description: "Enviar un embed rápido simple"
        },
        template: {
          delete: {
            description: "Eliminar una plantilla existente"
          },
          description: "✨ Gestionar plantillas de embed (Pro)",
          list: {
            description: "Listar todas las plantillas del servidor"
          },
          load: {
            description: "Cargar y enviar una plantilla"
          },
          save: {
            description: "Guardar la configuración actual como plantilla"
          }
        }
      }
    },
    success: {
      announcement_sent: "📢 Anuncio emitido en {{channel}}.",
      edited: "✅ Embed editado exitosamente.",
      sent: "✅ Embed enviado a {{channel}}.",
      template_deleted: "✅ Plantilla **{{name}}** eliminada.",
      template_saved: "✅ Plantilla **{{name}}** guardada exitosamente."
    },
    templates: {
      footer: "Total: {{count}}/50 plantillas",
      list_title: "Plantillas de Embed - {{guildName}}",
      no_templates: "No hay plantillas guardadas en este servidor. Usa `/embed template save` para crear una."
    }
  }
};
