#!/usr/bin/env bash
# Tiny SOPS+age helper for the project's encrypted dotenv.
#
#   ./scripts/secrets.sh init        # one-time: generate age key, print public key
#   ./scripts/secrets.sh encrypt     # .env.local -> .env  (commit the encrypted .env)
#   ./scripts/secrets.sh decrypt     # .env -> .env.local  (do NOT commit; gitignored)
#   ./scripts/secrets.sh edit        # in-place edit (sops opens $EDITOR with decrypted view)
#   ./scripts/secrets.sh print-key   # print the age PRIVATE key (paste into the SOPS_AGE_KEY repo secret)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLAIN="${ROOT}/.env.local"
ENC="${ROOT}/.env"

# age private key location. Override with SOPS_AGE_KEY_FILE if needed.
KEY_FILE="${SOPS_AGE_KEY_FILE:-${HOME}/.sops/elixpo-age-key.txt}"
export SOPS_AGE_KEY_FILE="$KEY_FILE"

require() { command -v "$1" >/dev/null 2>&1 || { echo "✗ $1 not installed. https://github.com/getsops/sops + https://github.com/FiloSottile/age"; exit 1; }; }
require sops
require age-keygen

cmd="${1:-help}"

case "$cmd" in
  init)
    if [ -f "$KEY_FILE" ]; then
      echo "✓ key already exists at $KEY_FILE"
    else
      mkdir -p "$(dirname "$KEY_FILE")"
      age-keygen -o "$KEY_FILE"
      chmod 600 "$KEY_FILE"
    fi
    PUB=$(grep -m1 'public key:' "$KEY_FILE" | awk '{print $NF}')
    echo
    echo "Your age PUBLIC key (paste into .sops.yaml):"
    echo "  $PUB"
    echo
    echo "Your age PRIVATE key lives at $KEY_FILE — keep it offline."
    echo "If you want CI to also decrypt (not currently the case), paste its"
    echo "contents into the GitHub repo as the secret  SOPS_AGE_KEY."
    ;;
  encrypt)
    [ -f "$PLAIN" ] || { echo "✗ $PLAIN missing. Copy .env.example -> .env.local first."; exit 1; }
    sops -e --input-type dotenv --output-type dotenv "$PLAIN" > "$ENC"
    echo "✓ encrypted -> $ENC  (safe to commit)"
    ;;
  decrypt)
    [ -f "$ENC" ] || { echo "✗ $ENC missing."; exit 1; }
    sops -d --input-type dotenv --output-type dotenv "$ENC" > "$PLAIN"
    chmod 600 "$PLAIN"
    echo "✓ decrypted -> $PLAIN  (DO NOT commit; .gitignore covers it)"
    ;;
  edit)
    [ -f "$ENC" ] || { echo "✗ $ENC missing."; exit 1; }
    sops --input-type dotenv --output-type dotenv "$ENC"
    ;;
  print-key)
    [ -f "$KEY_FILE" ] || { echo "✗ no key at $KEY_FILE"; exit 1; }
    cat "$KEY_FILE"
    ;;
  *)
    cat <<USAGE
usage: $0 {init|encrypt|decrypt|edit|print-key}

  init       Generate an age keypair at $KEY_FILE (one-time) and print the public key.
  encrypt    .env.local  ->  .env             (commit the encrypted .env)
  decrypt    .env        ->  .env.local       (local only, gitignored)
  edit       Open .env in \$EDITOR via sops (decrypts on open, re-encrypts on save)
  print-key  Print the age private key (for sharing across machines, or repo secret)

age key file: $KEY_FILE
  override:   SOPS_AGE_KEY_FILE=/path/to/key.txt $0 <cmd>
USAGE
    exit 1
    ;;
esac
