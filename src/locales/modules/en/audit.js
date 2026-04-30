module.exports = {
  audit: {
    all: "All",
    category_label: "Category",
    empty: "No tickets found matching those filters.",
    export_title: "📊 Audit Export Generated",
    from_label: "From",
    invalid_from: "Invalid 'from' date. Use YYYY-MM-DD.",
    invalid_range: "'from' date must be before 'to' date.",
    invalid_to: "Invalid 'to' date. Use YYYY-MM-DD.",
    none: "None",
    options: {
      category: "Filter by category",
      from: "Start date in YYYY-MM-DD",
      limit: "Maximum rows (1-500)",
      priority: "Filter by priority",
      status: "Filter by ticket status",
      to: "End date in YYYY-MM-DD"
    },
    priority_label: "Priority",
    rows: "Total rows",
    slash: {
      description: "Administrative audits and exports",
      subcommands: {
        tickets: {
          description: "Export tickets to CSV with filters"
        }
      }
    },
    status_label: "Status",
    title: "Audit Export",
    to_label: "To",
    unsupported_subcommand: "Unsupported subcommand."
  }
};
