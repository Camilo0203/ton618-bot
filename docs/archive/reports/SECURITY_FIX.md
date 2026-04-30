# Security Fix: Ticket Close Permissions

## Issue
Users could close their own tickets, which is a security/operational issue. Only staff should have permission to close tickets to maintain proper support workflow and prevent premature closures.

## Changes Made

### 1. `src/interactions/buttons/ticketClose.js`
**Before:**
```javascript
const isStaff = checkStaff(interaction.member, guildSettings);
const isCreator = interaction.user.id === ticket.user_id;

if (!isStaff && !isCreator) {
  // Allow both staff and ticket creator to close
}
```

**After:**
```javascript
const isStaff = checkStaff(interaction.member, guildSettings);

if (!isStaff) {
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle("Permiso denegado")
        .setDescription("Solo el staff puede cerrar tickets.")
    ],
    flags: 64,
  });
}
```

### 2. `src/interactions/modals/ticketCloseModal.js`
**Before:**
```javascript
const isStaff = checkStaff(interaction.member, guildSettings);
const isCreator = interaction.user.id === ticket.user_id;

if (!isStaff && !isCreator) {
  // Allow both staff and ticket creator to close
}
```

**After:**
```javascript
const isStaff = checkStaff(interaction.member, guildSettings);

if (!isStaff) {
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(E.Colors.ERROR)
        .setTitle("Permiso denegado")
        .setDescription("Solo el staff puede cerrar tickets.")
    ],
    flags: 64,
  });
}
```

## Impact

### Security
- ✅ Prevents users from closing tickets prematurely
- ✅ Ensures proper support workflow
- ✅ Maintains ticket lifecycle control with staff

### User Experience
- Users can no longer close their own tickets
- Users must wait for staff to close tickets after resolution
- Clear error message explains the permission requirement

### Staff Workflow
- Staff maintains full control over ticket lifecycle
- Prevents accidental or premature ticket closures
- Ensures proper documentation and resolution tracking

## Testing

To verify the fix:

1. **As a regular user:**
   - Open a ticket
   - Try to click the "Close Ticket" button
   - Should receive: "Solo el staff puede cerrar tickets."

2. **As staff:**
   - Open a ticket (or access any open ticket)
   - Click "Close Ticket" button
   - Should successfully open the close modal
   - Should be able to close the ticket

## Rollout

This is a **breaking change** for users who were previously able to close their own tickets.

**Recommended communication:**
- Announce the change to users
- Explain that staff will now handle all ticket closures
- Provide alternative: users can request closure in the ticket

**Example announcement:**
```
📢 Sistema de Tickets - Actualización

A partir de ahora, solo el staff puede cerrar tickets para garantizar que todos los problemas se resuelvan correctamente antes del cierre.

Si tu problema está resuelto, simplemente menciona en el ticket que puede cerrarse y el staff lo hará por ti.

Gracias por tu comprensión.
```

## Related Files

- `src/interactions/buttons/ticketClose.js` - Button handler for close action
- `src/interactions/modals/ticketCloseModal.js` - Modal handler for close confirmation
- `src/handlers/tickets/close.js` - Core close logic (no changes needed)

## Date
2026-03-24

## Priority
**HIGH** - Security/Operational issue
