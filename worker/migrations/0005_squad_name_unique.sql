-- HexaFalls: enforce unique squad names (case-insensitive).
--
-- Every squad must have a distinct name across the whole event. We add a
-- case-insensitive UNIQUE index so "Phoenix" and "phoenix" can't co-exist.
-- The app also checks this before insert and returns a friendly `name_taken`.
--
-- Apply locally:   wrangler d1 migrations apply hexafalls --local
-- Apply remote:    wrangler d1 migrations apply hexafalls --remote

CREATE UNIQUE INDEX IF NOT EXISTS idx_squads_name_unique
  ON squads (name COLLATE NOCASE);
