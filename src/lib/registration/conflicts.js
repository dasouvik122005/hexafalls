// Cross-event registration rules.
//
// Hardware has two tracks — Competition (squad) and Exhibition (solo) — and a
// user may register for ONLY ONE of them, never both. This checks whether a user
// already holds the OTHER hardware track (as a squad member OR a solo entry).

const OTHER_HARDWARE = {
  "hardware-competition": "hardware-exhibition",
  "hardware-exhibition": "hardware-competition",
};

// Returns true if registering `userId` for `eventKey` would conflict with an
// existing registration in the paired hardware track.
export async function hasHardwareConflict(db, userId, eventKey) {
  const other = OTHER_HARDWARE[eventKey];
  if (!other) return false;

  const inSquad = await db
    .prepare(
      `SELECT 1 FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(userId, other)
    .first();
  if (inSquad) return true;

  const inSolo = await db
    .prepare(`SELECT 1 FROM solo_registrations WHERE user_id = ? AND event = ? LIMIT 1`)
    .bind(userId, other)
    .first();
  return !!inSolo;
}
