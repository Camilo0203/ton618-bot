module.exports = {
  staff: {
    away_off: "You are now marked as active and available for ticket assignments.",
    away_on_description: "You are now marked as away.{{reasonText}}",
    away_on_footer: "You will not receive new ticket assignments while away.",
    away_on_title: "Away Status Set",
    moderation_required: "You do not have sufficient permissions to manage member warnings.",
    my_tickets_empty: "You have no open tickets assigned or claimed.",
    my_tickets_title: "My Tickets ({{count}})",
    only_staff: "This command is restricted to staff members.",
    ownership_assigned: "Assigned",
    ownership_claimed: "Claimed",
    ownership_watching: "Watching",
    slash: {
      description: "Staff-exclusive management and moderation utilities",
      options: {
        reason: "Note explaining your away status",
        user: "The member to inspect or warn",
        warn_reason: "Description of the infraction",
        warning_id: "The 6-character warning ID"
      },
      subcommands: {
        away_off: {
          description: "Clear your away status and become active again"
        },
        away_on: {
          description: "Mark yourself as away with an optional reason"
        },
        my_tickets: {
          description: "Review your currently claimed and assigned tickets"
        },
        warn_add: {
          description: "Apply a formal warning to a member"
        },
        warn_check: {
          description: "Review a member's warning history"
        },
        warn_remove: {
          description: "Remove a specific warning by its unique ID"
        }
      }
    },
    staff_no_data_description: "No statistics found for <@{{userId}}>.",
    staff_no_data_title: "No Staff Data"
  },
  "staff.away_off": "Away status cleared. You are active again.",
  "staff.away_on_description": "You are now marked as away.{{reasonText}}",
  "staff.away_on_footer": "Remember to disable away mode when you return.",
  "staff.away_on_title": "Away status enabled",
  "staff.my_tickets_empty": "You do not have any claimed or assigned tickets right now.",
  "staff.my_tickets_title": "Your Tickets ({{count}})",
  "staff.only_staff": "Only staff members can use this command.",
  "staff.ownership_assigned": "Assigned to you",
  "staff.ownership_claimed": "Claimed by you",
  "staff.ownership_watching": "Watching"
};
