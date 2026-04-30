module.exports = {
  giveaway: {
    choices: {
      requirement_account_age: "Antigüedad de cuenta",
      requirement_level: "Nivel",
      requirement_none: "Ninguno",
      requirement_role: "Rol"
    },
    embed: {
      click_participant: "¡Haz clic en el botón de abajo para participar!",
      ends: "Finaliza",
      hosted_by: "Organizado por",
      participate_label: "Participar",
      prize: "Premio",
      requirements: "Requisitos",
      reroll_announcement: "¡Nuevo(s) ganador(es): {{winners}}! Ganaste **{{prize}}**!",
      status_cancelled: "Cancelado",
      status_ended: "Estado",
      status_no_participants: "Finalizado (Sin participantes)",
      title: "🎉 Sorteo",
      winners: "Ganadores",
      winners_announcement: "¡Felicidades {{winners}}! Ganaste **{{prize}}**!"
    },
    errors: {
      already_ended: "Este sorteo ya ha finalizado.",
      cancel_failed: "Error al cancelar el sorteo.",
      create_failed: "Error al crear el sorteo.",
      end_failed: "Error al finalizar el sorteo.",
      no_active: "No active",
      no_participants: "No se encontraron participantes válidos para este sorteo.",
      not_found: "Sorteo no encontrado.",
      reroll_failed: "Error al re-sortear los ganadores."
    },
    requirements: {
      account_age: "La cuenta debe tener al menos {{days}} días",
      level: "Debe ser al menos nivel: {{level}}",
      role: "Debe tener el rol: {{role}}"
    },
    slash: {
      description: "Gestionar sorteos en el servidor",
      options: {
        bonus_role: "Rol para oportunidades extra (Pro)",
        bonus_weight: "Peso para el rol de bono (Pro)",
        channel: "Canal donde publicar el sorteo",
        description: "Detalles adicionales del sorteo",
        duration: "Duración (ej: 30s, 5m, 2h, 1d, 1w)",
        emoji: "Emoji personalizado para reaccionar",
        message_id: "ID del mensaje del sorteo",
        min_account_age: "Antigüedad mínima de la cuenta en días (Pro)",
        prize: "El premio a sortear",
        required_role_2: "Requisito de rol adicional (Pro)",
        requirement_type: "Tipo de requisito para entrar",
        requirement_value: "Valor para el requisito",
        winners: "Número de ganadores (1-20)"
      },
      subcommands: {
        cancel: {
          description: "Cancelar un sorteo activo sin ganadores"
        },
        create: {
          description: "Crear un nuevo sorteo"
        },
        end: {
          description: "Finalizar un sorteo activo antes de tiempo"
        },
        list: {
          description: "Listar todos los sorteos activos"
        },
        reroll: {
          description: "Elegir nuevos ganadores para un sorteo finalizado"
        }
      }
    },
    success: {
      cancelled: "✅ El sorteo ha sido cancelado.",
      created: "✅ ¡Sorteo creado en {{channel}}! [[Ir al Mensaje]]({{url}})",
      ended: "✅ Sorteo finalizado. Ganadores: {{winners}}",
      requirement_bonus: "[PRO] Oportunidades extra para <@&{{roleId}}> (x{{weight}})",
      requirement_role_2: "También debe tener: <@&{{roleId}}>",
      rerolled: "✅ ¡Re-sorteado! Nuevos ganadores: {{winners}}"
    }
  },
  "giveaway.embed.click_participant": "¡Haz clic en el botón de abajo para participar!",
  "giveaway.embed.ends": "Finaliza",
  "giveaway.embed.hosted_by": "Organizado por",
  "giveaway.embed.participate_label": "Participar",
  "giveaway.embed.prize": "Premio",
  "giveaway.embed.reroll_announcement": "¡Nuevos ganadores: {{winners}}! Felicidades, ganaron **{{prize}}**!",
  "giveaway.embed.status_cancelled": "Sorteo cancelado.",
  "giveaway.embed.status_ended": "Sorteo Finalizado",
  "giveaway.embed.status_no_participants": "No hubo participantes válidos.",
  "giveaway.embed.winners": "Ganadores",
  "giveaway.embed.winners_announcement": "¡Felicidades {{winners}}! Ganaste **{{prize}}**!",
  "giveaway.errors.already_ended": "Este sorteo ya ha finalizado.",
  "giveaway.errors.cancel_failed": "Error al cancelar el sorteo.",
  "giveaway.errors.create_failed": "Error al crear el sorteo.",
  "giveaway.errors.end_failed": "Error al finalizar el sorteo.",
  "giveaway.errors.no_active": "No hay sorteos activos.",
  "giveaway.errors.no_participants": "No se unieron participantes al sorteo.",
  "giveaway.errors.not_found": "Sorteo no encontrado.",
  "giveaway.errors.reroll_failed": "Error al realizar el reroll.",
  "giveaway.requirements.account_age": "Antigüedad mínima: {{days}} días",
  "giveaway.requirements.level": "Nivel Requerido: {{level}}",
  "giveaway.requirements.role": "Rol Requerido: {{role}}",
  "giveaway.success.cancelled": "Sorteo cancelado correctamente.",
  "giveaway.success.created": "¡Sorteo creado en {{channel}}! [Ir al mensaje]({{url}})",
  "giveaway.success.ended": "¡Sorteo finalizado! Ganadores: {{winners}}",
  "giveaway.success.rerolled": "¡Reroll completado! Nuevos ganadores: {{winners}}"
};
