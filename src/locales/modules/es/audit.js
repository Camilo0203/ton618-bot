module.exports = {
  audit: {
    all: "Todos",
    category_label: "Categoría",
    empty: "No se encontraron tickets con esos filtros.",
    export_title: "📊 Exportación de Auditoría Generada",
    from_label: "Desde",
    invalid_from: "Fecha 'desde' inválida. Use AAAA-MM-DD.",
    invalid_range: "La fecha 'desde' debe ser anterior a 'hasta'.",
    invalid_to: "Fecha 'hasta' inválida. Use AAAA-MM-DD.",
    none: "Ninguno",
    options: {
      category: "Filtrar por categoría",
      from: "Fecha de inicio en AAAA-MM-DD",
      limit: "Cantidad máxima de filas (1-500)",
      priority: "Filtrar por prioridad",
      status: "Filtrar por estado del ticket",
      to: "Fecha de fin en AAAA-MM-DD"
    },
    priority_label: "Prioridad",
    rows: "Filas totales",
    slash: {
      description: "Auditorías administrativas y exportaciones",
      subcommands: {
        tickets: {
          description: "Exportar tickets a CSV con filtros"
        }
      }
    },
    status_label: "Estado",
    title: "Exportación de Auditoría",
    to_label: "Hasta",
    unsupported_subcommand: "Subcomando no soportado."
  }
};
