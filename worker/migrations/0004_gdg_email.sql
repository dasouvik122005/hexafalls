-- HexaFalls: GDG community email on the user profile.
--
-- Verification is no longer a separate "I joined the chapter" checkbox gate.
-- Instead a user is gdg_verified once their PROFILE is complete — all required
-- details filled, INCLUDING the email associated with their GDG on Campus ·
-- JIS University membership. Portfolio stays optional.
--
-- Apply locally:   wrangler d1 migrations apply hexafalls --local
-- Apply remote:    wrangler d1 migrations apply hexafalls --remote

ALTER TABLE users ADD COLUMN gdg_email TEXT;  -- email used to join GDG on Campus · JIS University
