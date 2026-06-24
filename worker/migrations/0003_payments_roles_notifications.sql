-- HexaFalls registration: payments, join-requests, notifications, roles.
--
-- Apply locally:   wrangler d1 execute hexafalls --local  --file=worker/migrations/0003_payments_roles_notifications.sql
-- Apply remote:    wrangler d1 execute hexafalls --remote --file=worker/migrations/0003_payments_roles_notifications.sql
-- npm scripts:     `npm run db:migrate` / `npm run db:migrate:prod`

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- SQUAD STATUS MACHINE (no column rename — SQLite makes that painful).
-- Canonical lifecycle going forward:
--   registered  -> under_review -> fees_settled -> approved   (+ rejected)
-- Back-compat: existing rows use forming|submitted|approved|rejected|locked.
--   forming   == registered     (leader still inviting)
--   submitted == under_review    (submitted for review)
--   fees_settled is NEW          (all members paid; paid events only)
--   approved / rejected unchanged. Free events skip fees_settled.
-- App code treats the pairs as synonyms; new writes use the canonical names.
-- ---------------------------------------------------------------------------
ALTER TABLE squads ADD COLUMN fees_settled_at TEXT;   -- set when every member has paid
ALTER TABLE squads ADD COLUMN paid            INTEGER NOT NULL DEFAULT 0;  -- 0/1 cache: all members paid

-- ---------------------------------------------------------------------------
-- PAYMENTS — one row per member per paid event, rolled up to a squad.
-- Mirrors Elixpo Pay entitlements (see docs/payments_elixpo.md).
--   status: pending | paid | failed | refunded
-- idempotency_key guards against duplicate checkout/webhook processing.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id               TEXT PRIMARY KEY,             -- PAY-… (app-minted)
  user_id          TEXT NOT NULL,
  squad_id         TEXT,                          -- NULL for solo paid events (none today)
  event            TEXT NOT NULL,                 -- registration event key
  amount           INTEGER NOT NULL,              -- minor units (paise)
  currency         TEXT NOT NULL DEFAULT 'INR',
  status           TEXT NOT NULL DEFAULT 'pending',  -- pending|paid|failed|refunded
  elixpo_order_id  TEXT,                          -- Elixpo Pay order/checkout id
  entitlement_id   TEXT,                          -- granted entitlement id
  idempotency_key  TEXT UNIQUE,                   -- dedup checkout + webhook
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, event),                          -- one fee per user per event
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_payments_squad  ON payments(squad_id);
CREATE INDEX IF NOT EXISTS idx_payments_user   ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ---------------------------------------------------------------------------
-- JOIN REQUESTS — a user asks to join a squad; the leader approves/denies.
--   status: pending | approved | denied
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS join_requests (
  id          TEXT PRIMARY KEY,                  -- JR-… (app-minted)
  squad_id    TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  message     TEXT,                               -- optional note from the requester
  status      TEXT NOT NULL DEFAULT 'pending',   -- pending|approved|denied
  decided_by  TEXT,                               -- leader user.id
  decided_at  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(squad_id, user_id),                       -- one open request per user per squad
  FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_join_requests_squad  ON join_requests(squad_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user   ON join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS — in-profile feed. Everything that is NOT a "big event"
-- (team creation / approval / deletion / full payment → email) lands here.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY,                  -- NOTE-… (app-minted)
  user_id     TEXT NOT NULL,
  kind        TEXT NOT NULL,                      -- join_request|member_removed|review|payment|system…
  title       TEXT NOT NULL,
  body        TEXT,
  link        TEXT,                               -- optional in-app deep link
  read        INTEGER NOT NULL DEFAULT 0,         -- 0/1
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- ---------------------------------------------------------------------------
-- USER ROLES — multi-role per user (the users.role column stays as the
-- primary role). Fixed roles (hexafalls_*) are granted manually by admins;
-- dynamic roles (team_*) are granted when a user registers for an event.
--   source: fixed | dynamic
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  user_id     TEXT NOT NULL,
  role        TEXT NOT NULL,                      -- hexafalls_* | team_*
  source      TEXT NOT NULL DEFAULT 'dynamic',   -- fixed|dynamic
  granted_by  TEXT,                               -- admin user.id for fixed roles
  granted_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, role),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
