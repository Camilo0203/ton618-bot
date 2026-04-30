module.exports = {
  profile: {
    embed: {
      coins_format: "{{amount}} monedas",
      field_bank: "Banco",
      field_level: "Nivel",
      field_rank: "Rango",
      field_total: "Total Neto",
      field_total_xp: "XP Total",
      field_wallet: "Cartera",
      level_format: "Nivel {{level}}",
      no_data: "Sin participantes aún.",
      page_format: "Página {{current}} de {{total}}",
      title: "Perfil de {{username}}",
      top_economy: "💰 Miembros más Ricos",
      top_levels: "📊 Top Niveles",
      top_title: "🏆 Tabla de Clasificación",
      user_fallback: "Usuario #{{id}}"
    },
    slash: {
      description: "Perfil simple: nivel + economía",
      options: {
        user: "Usuario objetivo a inspeccionar"
      },
      subcommands: {
        top: {
          description: "Ver tabla de clasificación"
        },
        view: {
          description: "Ver un perfil"
        }
      }
    }
  }
};
