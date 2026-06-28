#!/usr/bin/env bash
set -euo pipefail

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HexaFalls Deploy
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Next.js app shipped as a Cloudflare Worker via @opennextjs/cloudflare.
# The Worker is named `hexafalls` (see wrangler.toml) and is backed by a
# D1 database (binding DB, database `hexafalls`).
#
# Usage: ./deploy.sh [command ...]
#
# Commands:
#   migrate   Apply D1 migrations to the remote `hexafalls` database
#   build     Build the OpenNext worker bundle (.open-next)
#   deploy    Build, then deploy the worker to Cloudflare
#   secrets   Upload runtime secrets (allowlist) to the `hexafalls` worker
#   catalog   Push the payment catalog to Elixpo Pay (scripts/sync-catalog.mjs)
#   all       migrate -> build -> deploy -> secrets   (default)
#
# Auth + secrets come from the SOPS-encrypted .env (decrypted at runtime).
# Cloudflare auth (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID) is read by
# wrangler/opennext from the environment — load_env exports it if present.
#
# Examples:
#   ./deploy.sh                 # migrate + build + deploy + secrets
#   ./deploy.sh deploy          # build + deploy the worker
#   ./deploy.sh secrets         # (re)upload runtime secrets only
#   ./deploy.sh catalog         # push payment catalog (run when prices change)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Runtime secrets pushed to the worker via `wrangler secret put`.
# EXPLICIT allowlist — do NOT loop over every .env key, or you'd shadow the
# prod [vars] in wrangler.toml (e.g. ELIXPO_REDIRECT_URI differs dev vs prod).
SECRET_KEYS=(
  ELIXPO_CLIENT_ID
  ELIXPO_CLIENT_SECRET
  SESSION_SECRET
  ELIXPO_PAY_API_KEY
  ELIXPO_PAY_APP_ID
  ELIXPO_PAY_WEBHOOK_SECRET
  ELIXPO_MAILS_PRODUCT_SECRET
  ELIXPO_MAILS_ENDPOINT_KEY
  ELIXPO_MAILS_WEBHOOK_TEAM_CREATED
  ELIXPO_MAILS_WEBHOOK_TEAM_APPROVED
  ELIXPO_MAILS_WEBHOOK_TEAM_DELETED
  ELIXPO_MAILS_WEBHOOK_PAYMENT_COMPLETE
  ELIXPO_MAILS_WEBHOOK_PAYMENT_RECEIVED
  CRON_SECRET
)

# ── Helpers ──────────────────────────────────────────────────

load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env not found at $ENV_FILE"
    exit 1
  fi
  # The committed .env is SOPS-encrypted — decrypt before exporting, else every
  # value comes through as ENC[...] and API calls fail.
  local _env_content
  if grep -q 'ENC\[' "$ENV_FILE" 2>/dev/null || grep -q '^sops' "$ENV_FILE" 2>/dev/null; then
    if [ -z "${SOPS_AGE_KEY:-}" ]; then
      for _age_key in "$HOME/.config/sops/age/keys.txt" "$HOME/.sops/elixpo-age-key.txt"; do
        if [ -f "$_age_key" ]; then
          export SOPS_AGE_KEY="$(grep 'AGE-SECRET-KEY' "$_age_key" | head -1)"
          break
        fi
      done
    fi
    _env_content="$(sops -d "$ENV_FILE")" || { echo "Error: failed to decrypt $ENV_FILE (set SOPS_AGE_KEY or create ~/.config/sops/age/keys.txt)"; exit 1; }
  else
    _env_content="$(cat "$ENV_FILE")"
  fi
  while IFS= read -r line || [ -n "$line" ]; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    # SOPS structural metadata rows (e.g. `sops_age__list_0__map_enc=
    # -----BEGIN AGE ENCRYPTED FILE-----`) carry unquoted whitespace
    # that `export` can't parse — they'd silently fall through the
    # `2>/dev/null` below, but skipping explicitly is cleaner.
    [[ "$line" =~ ^sops_ ]] && continue
    export "$line" 2>/dev/null || true
  done <<< "$_env_content"
}

# ── Commands ─────────────────────────────────────────────────

secrets() {
  echo "==> Uploading runtime secrets to worker 'hexafalls'..."
  load_env

  for K in "${SECRET_KEYS[@]}"; do
    local VALUE="${!K:-}"
    if [ -z "$VALUE" ]; then
      echo "  [warn] $K not set, skipping"
      continue
    fi
    echo "  -> $K"
    # --env="" explicitly targets the TOP-LEVEL environment (the production
    # `hexafalls` worker). Required because wrangler.toml also defines
    # [env.preview]; without it wrangler only warns and still uses top-level,
    # but being explicit avoids ever writing secrets to the wrong env.
    printf '%s' "$VALUE" | npx wrangler secret put "$K" --env="" \
      || echo "    [warn] secret put failed for $K"
  done

  echo "==> Secrets uploaded."
}

migrate() {
  echo "==> Applying D1 migrations to remote 'hexafalls'..."
  npx wrangler d1 migrations apply hexafalls --remote --env=""
  echo "==> Migrations applied."
}

build() {
  echo "==> Building OpenNext worker bundle..."
  npx opennextjs-cloudflare build
  echo "==> Build complete (.open-next)."
}

deploy() {
  # Always build before deploy — cheap relative to a stale-bundle deploy.
  build
  echo "==> Deploying worker 'hexafalls' to Cloudflare..."
  npx opennextjs-cloudflare deploy
  echo "==> Deploy complete."
}

catalog() {
  echo "==> Syncing payment catalog to Elixpo Pay..."
  load_env  # ELIXPO_PAY_API_KEY must be in the environment
  node "$SCRIPT_DIR/scripts/sync-catalog.mjs"
  echo "==> Catalog sync complete."
}

all() {
  # Order matters: migrate the DB, build + deploy so the worker exists,
  # then push secrets to it. `catalog` is intentionally NOT auto-run —
  # the operator runs it explicitly when prices change.
  migrate
  build
  deploy
  secrets
}

# ── Usage ────────────────────────────────────────────────────

usage() {
  echo "Usage: ./deploy.sh [command ...]"
  echo ""
  echo "Commands:"
  echo "  migrate   Apply D1 migrations to the remote 'hexafalls' database"
  echo "  build     Build the OpenNext worker bundle (.open-next)"
  echo "  deploy    Build, then deploy the worker to Cloudflare"
  echo "  secrets   Upload runtime secrets (allowlist) to the 'hexafalls' worker"
  echo "  catalog   Push the payment catalog to Elixpo Pay"
  echo "  all       migrate -> build -> deploy -> secrets   (default)"
  echo ""
  echo "Run with no arguments to execute 'all'."
}

# ── Entrypoint ───────────────────────────────────────────────

run_command() {
  case "$1" in
    migrate) migrate ;;
    build)   build ;;
    deploy)  deploy ;;
    secrets) secrets ;;
    catalog) catalog ;;
    all)     all ;;
    -h|--help|help) usage ;;
    *)
      echo "Unknown command: $1"
      usage
      exit 1
      ;;
  esac
}

if [ $# -eq 0 ]; then
  all
else
  for cmd in "$@"; do
    run_command "$cmd"
  done
fi
