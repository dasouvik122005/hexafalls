-- HexaFalls registration: review workflow + per-user bio + per-event details.
--
-- Apply locally:   wrangler d1 execute hexafalls --local  --file=worker/migrations/0002_review_workflow.sql
-- Apply remote:    wrangler d1 execute hexafalls --remote --file=worker/migrations/0002_review_workflow.sql

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- USERS: extend with public profile fields. These are surfaced on
-- /register/u/[username] (hacker profile page).
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN bio          TEXT;
ALTER TABLE users ADD COLUMN avatar_url   TEXT;
ALTER TABLE users ADD COLUMN college      TEXT;
ALTER TABLE users ADD COLUMN year         INTEGER;     -- year of study (1..6)
ALTER TABLE users ADD COLUMN github       TEXT;        -- handle, no URL
ALTER TABLE users ADD COLUMN linkedin     TEXT;
ALTER TABLE users ADD COLUMN portfolio    TEXT;        -- full URL

-- ---------------------------------------------------------------------------
-- SQUADS: review workflow.
--   status: forming | submitted | approved | rejected | locked
--     forming   -- leader is still inviting members
--     submitted -- leader hit "submit for review" (>= min_members)
--     approved  -- an admin/organizer signed off → seat locked
--     rejected  -- an admin/organizer rejected → leader can edit + resubmit
--     locked    -- legacy/never used yet
-- ---------------------------------------------------------------------------
ALTER TABLE squads ADD COLUMN submitted_at    TEXT;
ALTER TABLE squads ADD COLUMN reviewed_at     TEXT;
ALTER TABLE squads ADD COLUMN reviewed_by     TEXT;   -- admin/organizer user.id
ALTER TABLE squads ADD COLUMN review_notes    TEXT;
ALTER TABLE squads ADD COLUMN details_json    TEXT;   -- event-specific payload
-- (the per-event payload — project idea, exhibit title, etc. — is JSON so
--  we don't have to migrate every time the event config changes.)

CREATE INDEX IF NOT EXISTS idx_squads_reviewer ON squads(reviewed_by);

-- ---------------------------------------------------------------------------
-- SOLO REGISTRATIONS: same review workflow + reviewer audit trail.
-- ---------------------------------------------------------------------------
ALTER TABLE solo_registrations ADD COLUMN submitted_at TEXT;
ALTER TABLE solo_registrations ADD COLUMN reviewed_at  TEXT;
ALTER TABLE solo_registrations ADD COLUMN reviewed_by  TEXT;
ALTER TABLE solo_registrations ADD COLUMN review_notes TEXT;
