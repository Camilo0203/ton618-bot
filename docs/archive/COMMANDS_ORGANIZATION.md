# Command Organization

This project now follows a simple rule:

- `1 command = 1 file`

## Folder model

- `src/commands/public/*` for user commands
- `src/commands/staff/*` for staff workflows
- `src/commands/admin/*` for server configuration and admin tools
- `src/commands/developer/*` for owner/debug tools

## Metadata model

At load time (`index.js`), each command receives `meta` automatically from its path:

- `meta.scope`: first folder (`public`, `staff`, `admin`, `developer`)
- `meta.category`: second folder (`utility`, `economy`, `config`, etc.)
- `meta.file`: relative source file

You can override or extend with command-local metadata:

```js
module.exports = {
  data: ...,
  meta: {
    hidden: true,
  },
  async execute(interaction) { ... }
}
```

## Help system

`/help` is dynamic and reads from `client.commands`:

- Groups by category
- Filters by role/scope visibility
- Supports command lookup with autocomplete

No hardcoded command list is required anymore.

## Conventions for new commands

1. Add one file per slash command in the proper scope/category folder.
2. Export `data` and `execute` directly from that file.
3. Keep shared logic in helper files prefixed with `_` (example: `_staffAccess.js`).
4. Use `meta.hidden = true` only for internal commands.
