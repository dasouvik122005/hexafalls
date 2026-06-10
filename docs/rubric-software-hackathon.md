# HexaFalls - Software Hackathon Judging Rubric

HexaFalls is a 58-hour hackathon. Our judging is built around one principle:
the most valuable software is the kind anyone can read, run, and build upon.
Projects are evaluated on **what they ship in the open**, not only on the demo.
We value every participant - completing and submitting a project matters,
regardless of final placement.

---

## Submission Requirements (Eligibility)

A project must meet **all** of the following to be eligible for scoring. These
are pass/fail gates, not scored criteria.

| # | Requirement | Rationale |
|---|---|---|
| 1 | **Public source repository** (GitHub/GitLab) with the link submitted on Devfolio. | Open source must be open to read. |
| 2 | An **OSI-approved license** file in the repository root (e.g. `MIT`, `Apache-2.0`, `GPL-3.0`). | Code without a license is not legally reusable. |
| 3 | A **README** describing *what the project is*, *how to run it*, and *how to contribute*. | Software no one can set up cannot be evaluated or reused. |
| 4 | **Commit history created during the event window** (no fully pre-built submissions). | The work produced during the event is what is judged. |
| 5 | A **working demo** - deployed link, recorded video, or live walkthrough. | Functionality must be demonstrable. |

> Building on a pre-existing project is allowed, but only work done **during the
> event** is judged, and the starting point must be declared in the README.

---

## Scoring Criteria (100 points)

Open-source quality is intentionally the heaviest weight. A polished demo on a
closed or undocumented repository will not place highly.

| Criterion | Weight | What we look for |
|---|---:|---|
| **1. Open-Source Quality** | **30** | Public, properly licensed repository. A clear README and setup steps that reproduce the project. Readable, coherent commit history. Code structured so an outsider could open an issue or submit a pull request (modular, sensibly named; `CONTRIBUTING`, issues, and labels are a plus). Reusable beyond the original team. |
| **2. Technical Execution & Completeness** | **25** | The project works. Sound architecture and code quality. The intended scope is meaningfully complete, not a hollow prototype. Appropriate technology choices. |
| **3. Innovation & Originality** | **15** | A fresh idea, a novel approach, or a clever take on a known problem. |
| **4. Impact & Usefulness** | **15** | Solves a real problem for real users. Clear beneficiaries and rationale. Potential to remain useful after the event. |
| **5. Design & Experience** | **10** | Thoughtful UX/UI, accessibility, and overall craft. Easy and pleasant to use. |
| **6. Demonstration & Communication** | **5** | A clear, honest presentation that explains *what*, *why*, and *how*, including trade-offs and known limitations. |
| **Total** | **100** | |

### Scoring scale (applied per criterion)

| Score | Band | Meaning |
|---:|---|---|
| 0 | Absent | Not attempted / not present. |
| 1–2 | Emerging | Started, but thin or not functional. |
| 3 | Solid | Meets expectations; works as intended. |
| 4 | Strong | Clearly above expectations; polished. |
| 5 | Exceptional | Reference quality. |

Each criterion is scored 0–5, then scaled to its weight:
**criterion points = (score ÷ 5) × weight.**

---

## Bonus Points (up to +8, additive)

Awarded on top of the 100 and capped, so bonuses reward openness without
replacing the core criteria.

| Item | Bonus | Awarded for |
|---|---:|---|
| Automated tests | +2 | Meaningful test coverage. |
| Continuous integration | +2 | Working CI (build/test on push). |
| Accessibility | +2 | Genuine a11y effort (keyboard, contrast, semantics, ARIA). |
| Contributor readiness | +1 | `CONTRIBUTING.md`, "good first issue" labels, or a code of conduct. |
| Reusability | +1 | Published as a package, component, or template others can adopt. |

---

## Penalties

| Issue | Penalty |
|---|---|
| Private repository or missing license at judging time | **Not scored** (eligibility failure). |
| Plagiarism / passing off others' work as your own | **Disqualification.** |
| Demo materially misrepresents what the code does | −10 |
| Hard-coded secrets / committed credentials | −3 and a notice to the team. |

---

## Tie-breakers

When totals are equal, in order:
1. Higher **Open-Source Quality** (Criterion 1) score.
2. Higher **Impact & Usefulness** (Criterion 4) score.
3. Stronger **commit-history quality** during the event window.
4. Judges' deliberation.

---

## Participant Recognition & Inclusion

Awards are limited; respect is for everyone.

- **Every team that submits** receives written judge feedback, not only a rank.
- A separate **Participant Recognition** may be given to teams that best
  embodied open-source practices, helped others, or showed the most growth -
  independent of placement.
- First-time participants, solo builders, and ambitious-but-incomplete projects
  are welcomed and encouraged, not penalized for attempting more.
- Every team that takes part is acknowledged.

---

*HexaFalls · GDG on Campus · JIS University*
