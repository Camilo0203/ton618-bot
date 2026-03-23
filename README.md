# TON618

Discord bot focused on tickets, moderation, utility commands, music, suggestions and server configuration.

## Requirements

- Node.js 20 or newer
- MongoDB
- A valid `.env` file with the bot credentials

## Main commands

```bash
npm start
npm run deploy:compact
npm run deploy:full
npm run cleanup:commands
npm run migrate:dates
npm run db:indexes
npm run test:concurrency:votes
npm test
```

## Project layout

- `index.js`: main bot entrypoint
- `config.js`: ticket categories and owner-level config
- `src/`: commands, events, handlers and utilities
- `scripts/`: operational and maintenance scripts
- `docs/archive/`: old planning notes and archived docs

## Deploy

Use `deploy.sh` on Linux hosts or run the equivalent manually:

```bash
npm ci
npm run deploy:compact
npm start
```

## Notes

- Copy `.env.example` to `.env` and fill required values before first run.
- `cleanup:commands` removes slash commands from Discord. Set `CLEANUP_GUILD_ID` or `GUILD_ID` if you want to target a specific guild in addition to global commands.
- `migrate:dates` converts legacy string date fields in MongoDB into real `Date` values.
- `db:indexes` ensures MongoDB indexes on demand. Boot no longer needs to create indexes unless `MONGO_AUTO_INDEXES=true`.
- `/health` and `/debug status` now expose a deployment fingerprint (version + commit, plus optional `DEPLOY_TAG`) so you can verify whether a host actually pulled the latest code.
- Global command flags can be controlled with env vars:
  - `COMMANDS_DISABLED_FILES=admin/config/setup.js,public/utility/ping.js`
  - `COMMANDS_ENABLED_FILES=public/utility/ping.js` (reenables defaults)
- Privileged intents can be toggled with env vars (default: enabled):
  - `MESSAGE_CONTENT_ENABLED=true|false` (also accepts `1/0`, `yes/no`, `on/off`)
  - `GUILD_PRESENCES_ENABLED=true|false` (also accepts `1/0`, `yes/no`, `on/off`)
- Auto-assignment avoids full guild member fetches by default. Set `AUTO_ASSIGN_ALLOW_FULL_MEMBER_FETCH=true` only if you explicitly need the old fallback.
- File error logging can be tuned with:
  - `ERROR_LOG_TO_FILE=true|false`
  - `ERROR_LOG_DIR=/absolute/or/relative/path`
- Dashboard bridge with Supabase:
  - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` enable the bot-to-dashboard bridge.
  - The bot now keeps `bot_guilds` and `guild_metrics_daily` updated, seeds missing `guild_configs`, and imports dashboard config back into Mongo settings.
  - Optional tuning: `DASHBOARD_BRIDGE_INTERVAL_MS` (or legacy alias `SUPABASE_DASHBOARD_SYNC_INTERVAL_MS`) and `DASHBOARD_HTTP_TIMEOUT_MS`.
- Per-guild command flags are stored in settings as `disabled_commands` (command names like `["ping","music"]`).
- Manage per-guild command flags with `/setup comandos deshabilitar`, `/setup comandos habilitar`, `/setup comandos estado`, `/setup comandos reset`, and `/setup comandos listar` (with autocomplete for command names).
- Interactive command management is also available at `/setup comandos panel` (select menus for disable/enable/status/list/reset).
- Config Center (`/config centro` > `Sistema`) now keeps versioned config backups, supports backup list, and includes rollback to the latest snapshot.
- SLA management can now be configured from `/setup tickets sla` (including escalation role/channel and escalation threshold).
- Operational SLA visibility is available in `/stats sla`.

## Release workflow

- New GitHub Actions workflow: `.github/workflows/release.yml` (manual dispatch).
- Stages: `validate` -> `deploy_staging` -> `deploy_production`.
- `deploy_production` uses the `production` environment, so manual approval can be enforced from GitHub Environment protection rules.
- Required secrets:
  - `DISCORD_TOKEN`
  - `MONGO_URI`
  - `OWNER_ID` (recommended)
  - `STAGING_GUILD_ID` (for staging deploy)
  - `PRODUCTION_GUILD_ID` (optional; if omitted, deploy script uses global commands)
