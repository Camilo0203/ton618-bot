module.exports = {
  giveaway: {
    choices: {
      requirement_account_age: "Account Age",
      requirement_level: "Level",
      requirement_none: "None",
      requirement_role: "Role"
    },
    embed: {
      click_participant: "Click the button below to join!",
      ends: "Ends",
      hosted_by: "Hosted by",
      participate_label: "Join",
      prize: "Prize",
      requirements: "Requirements",
      reroll_announcement: "New winner(s): {{winners}}! You won **{{prize}}**!",
      status_cancelled: "Cancelled",
      status_ended: "Ended",
      status_no_participants: "Ended (No participants)",
      title: "🎉 Giveaway",
      winners: "Winners",
      winners_announcement: "Congratulations {{winners}}! You won **{{prize}}**!"
    },
    errors: {
      already_ended: "This giveaway has already ended.",
      cancel_failed: "Failed to cancel giveaway.",
      create_failed: "Failed to create giveaway.",
      end_failed: "Failed to end giveaway.",
      no_active: "No active",
      no_participants: "No valid participants found.",
      not_found: "Giveaway not found.",
      reroll_failed: "Failed to reroll giveaway."
    },
    requirements: {
      account_age: "Account must be at least {{days}} days old",
      level: "Must be at least level: {{level}}",
      role: "Must have role: {{role}}"
    },
    slash: {
      description: "Manage giveaways in the server",
      options: {
        bonus_role: "Role for extra entries (Pro)",
        bonus_weight: "Weight for bonus role (Pro)",
        channel: "Target channel",
        description: "Additional giveaway details",
        duration: "Duration (e.g., 30s, 5m, 2h, 1d, 1w)",
        emoji: "Custom emoji to react",
        message_id: "Giveaway message ID",
        min_account_age: "Minimum account age in days (Pro)",
        prize: "The prize to give away",
        required_role_2: "Additional role requirement (Pro)",
        requirement_type: "Requirement type to enter",
        requirement_value: "Requirement value",
        winners: "Number of winners (1-20)"
      },
      subcommands: {
        cancel: {
          description: "Cancel an active giveaway without winners"
        },
        create: {
          description: "Create a new giveaway"
        },
        end: {
          description: "End an active giveaway early"
        },
        list: {
          description: "List all active giveaways"
        },
        reroll: {
          description: "Pick new winners for an ended giveaway"
        }
      }
    },
    success: {
      cancelled: "✅ Giveaway has been cancelled.",
      created: "✅ Giveaway created in {{channel}}! [[Jump to Message]]({{url}})",
      ended: "✅ Giveaway ended. Winners: {{winners}}",
      requirement_bonus: "[PRO] Extra entries for <@&{{roleId}}> (x{{weight}})",
      requirement_role_2: "Must also have: <@&{{roleId}}>",
      rerolled: "✅ Rerolled! New winners: {{winners}}"
    }
  }
};
