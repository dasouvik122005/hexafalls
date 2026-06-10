# HexaFalls - Competitive Programming (CP) Scoring Rubric

Competitive Programming at HexaFalls is decided objectively by an automated
judge, not by subjective review. Scoring is transparent and rule-based. We
value every participant - taking part and solving problems is an achievement in
itself, regardless of final rank.

---

## Format at a glance

- **Style:** ICPC-style timed contest, run **on-site in a computer lab** on an
  offline judge.
- **Environment:** held in a supervised lab and invigilated in person.
  General internet access is disabled - only the offline contest judge is
  reachable from the contest machines.
- **Duration:** announced at the start of the round (e.g. 2–3 hours).
- **Problem set:** 3–4 problems, ordered roughly easy to medium.
- **Participation:** individual or team, as announced for the round; one shared
  submission queue per contestant/team.
- **Languages:** C, C++, Java, and Python only.

---

## How scoring works

### 1.1 Primary score - problems solved
Ranking is driven first by the **number of problems Accepted (AC)**. Solving
more problems is always better, regardless of penalty time.

### 1.2 Tie-break - penalty time
When two contestants solve the **same number** of problems, the one with the
**lower total penalty time** ranks higher.

Penalty time is the sum, over **solved** problems only, of:

```
penalty(problem) = (minutes from contest start to first AC of that problem)
                 + (20 × number of rejected submissions before that AC)
```

- A **rejected** submission is Wrong Answer, TLE, MLE, or Runtime Error.
- **Compilation errors do not add penalty.**
- Problems that are **never solved add zero penalty.** Attempt freely - only
  wrong submissions on problems you eventually solve add time.

### Partial scoring (only if declared for the round)
Most rounds are all-or-nothing per problem. If a round uses **subtask/partial
scoring**, this is stated in advance, and the leaderboard ranks by **total
points** first, then by **time of the last score improvement**.

---

## Ranking order (decisive, top to bottom)

| # | Criterion | Direction |
|---|---|---|
| 1 | Problems solved (or total points, in partial-scoring rounds) | **higher wins** |
| 2 | Total penalty time | **lower wins** |
| 3 | Time of the **last** Accepted submission | **earlier wins** |
| 4 | Fewer total rejected submissions | **fewer wins** |
| 5 | Judges' decision | - |

---

## Fair-play rules

Contest integrity is non-negotiable. Violations are reviewed by the judges and
may result in a zeroed problem, removal from the leaderboard, or
disqualification.

**Permitted**
- Your own pre-written templates or personal code library, if the round allows.
- Offline language and standard-library documentation, if provided on the
  contest machines.

**Not permitted**
- Sharing code, solutions, or hints with anyone outside your team.
- Copying from another contestant or any external solution source. General
  internet access and AI assistants are disabled in the lab; attempting to
  bypass these restrictions is a violation.
- Bringing in unauthorized devices, storage media, or phones to the contest
  machines.
- Multiple accounts, substitute participants, or impersonation.
- Attacking, overloading, or attempting to exploit the judge system.

> Submissions may be checked for similarity (e.g. MOSS) and unusual patterns.
> If unsure whether something is allowed, ask contest staff **before** acting.

---

## Submissions & verdicts

| Verdict | Meaning | Penalty (on a later-solved problem) |
|---|---|---|
| **AC** - Accepted | Correct on all tests | stops the clock for that problem |
| **WA** - Wrong Answer | Incorrect output | +20 min |
| **TLE** - Time Limit Exceeded | Too slow | +20 min |
| **MLE** - Memory Limit Exceeded | Too much memory | +20 min |
| **RE** - Runtime Error | Crashed during execution | +20 min |
| **CE** - Compilation Error | Did not compile | **no penalty** |

- Only the **best** result per problem counts.
- The leaderboard may be **frozen** in the final stretch (e.g. last 30 minutes);
  final standings are revealed after the contest ends.

---

## Participant Recognition & Inclusion

The leaderboard ranks a few; participation is valued for all.

- **Solving even one problem is a genuine achievement** and is recognized.
- A **Most Improved / Best Newcomer** recognition may be awarded to standout
  first-time or most-improved contestants.
- Editorials and solutions are shared after the contest so every participant
  leaves having learned, not only ranked.
- Beginners are welcome and encouraged to take part.

---


*HexaFalls · GDG on Campus · JIS University*
