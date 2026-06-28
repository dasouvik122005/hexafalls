-- HexaFalls registration: initial schema for D1.
--
-- Apply locally:   wrangler d1 execute hexafalls --local  --file=worker/migrations/0001_init.sql
-- Apply remote:    wrangler d1 execute hexafalls --remote --file=worker/migrations/0001_init.sql
-- npm scripts:     `npm run db:migrate` (local) / `npm run db:migrate:prod` (remote)

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Users — every authenticated identity, regardless of role.
-- elixpo_id is the upstream SSO subject; (id, username) are issued by us.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,             -- e.g. PART-A4F9XQ, CORE-7K2NM
  elixpo_id     TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL,
  display_name  TEXT,
  username      TEXT UNIQUE,                  -- chosen on first profile setup
  role          TEXT NOT NULL DEFAULT 'participant',  -- participant|core|volunteer|evangelist|admin|organizer
  gdg_verified  INTEGER NOT NULL DEFAULT 0,   -- 0/1, set when user confirms GDG membership
  email_verified INTEGER NOT NULL DEFAULT 0,
  access_token  TEXT,                          -- last OAuth access token (short-lived)
  refresh_token TEXT,                          -- last OAuth refresh token (rotating)
  token_expires_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ---------------------------------------------------------------------------
-- Squads — registration teams (hackathon + hardware exhibition).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS squads (
  id            TEXT PRIMARY KEY,             -- HACK-T-XXXXXX or HW-X-T-XXXXXX
  event         TEXT NOT NULL,                -- 'hackathon' | 'hardware-exhibition'
  name          TEXT NOT NULL,
  tagline       TEXT,                          -- one-liner shown on the public squad profile
  description   TEXT,                          -- longer bio, markdown
  leader_id     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'forming',  -- forming|locked|confirmed
  invite_token  TEXT NOT NULL UNIQUE,
  min_members   INTEGER NOT NULL,
  max_members   INTEGER NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_squads_event  ON squads(event);
CREATE INDEX IF NOT EXISTS idx_squads_status ON squads(status);

-- ---------------------------------------------------------------------------
-- Squad membership.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS squad_members (
  squad_id  TEXT NOT NULL,
  user_id   TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'member',  -- leader|member
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (squad_id, user_id),
  FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_squad_members_user ON squad_members(user_id);

-- ---------------------------------------------------------------------------
-- Solo registrations (CP / gaming / hardware-competition).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solo_registrations (
  id           TEXT PRIMARY KEY,              -- REG-XXXXXX
  user_id      TEXT NOT NULL,
  event        TEXT NOT NULL,                 -- 'cp' | 'gaming' | 'hardware-competition'
  details_json TEXT,                           -- event-specific payload (game tag, language, etc.)
  status       TEXT NOT NULL DEFAULT 'submitted',  -- submitted|confirmed
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, event),                      -- one solo entry per user per event
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_solo_event ON solo_registrations(event);

-- ---------------------------------------------------------------------------
-- OAuth state — short-lived rows guarding CSRF on /api/auth/callback.
-- Rows are deleted on successful exchange; sweep stale rows on a cron.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS oauth_states (
  state       TEXT PRIMARY KEY,
  return_to   TEXT NOT NULL DEFAULT '/register',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
