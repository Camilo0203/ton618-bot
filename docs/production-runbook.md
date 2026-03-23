# TON618 Production Runbook

## Service model

- `ton618-web`: Netlify or equivalent static host
- `Supabase`: auth, dashboard data, mutation queue
- `ton618-bot`: persistent Node host with restart policy
- `MongoDB`: primary operational datastore for bot state

## Required production checks

- `npm run env:check -- --file=.env.production.example` passes
- `npm test` passes before deploy
- web CI passes: typecheck, lint, unit tests, build
- bot CI passes: syntax check and tests
- build fingerprint is visible from `/health`
- Supabase bridge env vars are present
- Mongo backups are scheduled

## Bot host expectations

- Node 20+
- process supervisor such as PM2, systemd or Docker restart policy
- external health check hitting `/health`
- log collection with rotation
- write access for configured error log directory if file logging is enabled

## Deploy flow

1. Merge validated changes.
2. Run web CI and bot CI.
3. Run `npm run build:fingerprint` and keep the expected value.
4. Deploy slash commands with the safe rollback script.
5. Restart the bot host.
6. Run `npm run smoke:health <health-url>`.
7. Verify `/health` reports the new fingerprint.
8. Open the dashboard and confirm:
   - guild sync status
   - inbox data
   - playbook data
   - mutation queue health

## Smoke checks

- `/health`
- `/debug status`
- open dashboard overview
- open inbox
- confirm a ticket action from dashboard
- confirm a playbook recommendation from dashboard

## Rollback triggers

- OAuth callback breaks
- snapshot no longer loads for manageable guilds
- ticket actions stay pending without bot processing
- playbook sync starts deleting valid rows
- bot health endpoint fails or fingerprint does not change after deploy

## Rollback actions

1. Stop new deploys.
2. Restore previous bot release.
3. Verify slash commands using the last good snapshot.
4. Restore Mongo backup if state corruption occurred.
5. Review Supabase mutation queue and failed sync rows.
6. Re-open the dashboard and confirm guild visibility and inbox health.

## Daily operating routine

- Review `guild_sync_status`
- Review failed mutations
- Review new SLA breaches
- Review playbook confirmation vs dismissal rate
- Confirm latest backup age
