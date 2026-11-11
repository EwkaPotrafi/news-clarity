# News Clarity

A prompt-first project for getting a fair, pragmatic read on news events:
facts separated from claims and spin, each side's strongest case, and a
sober conclusion with an honest confidence level.

Built first for one reader (my father), and usable by anyone.

## Structure
| Path | What it is |
|------|------------|
| `CLAUDE.md` | The core instructions: purpose, method, output format, rules |
| `.claude/commands/check.md` | `/check <link or text>` command for Claude Code |
| `evals/cases.md` | Test cases to run whenever the instructions change |
| `evals/rubric.md` | Scoring checklist, including the left/right symmetry test |
| `evals/results/` | Saved outputs, so versions can be compared over time |
| `for-dad/setup-claude-project.md` | No-code setup as a Claude Project |
| `for-dad/chrome-extension.md` | Polish one-page guide to the Chrome extension |
| `extension/` | Chrome extension: one-click check of the page being read (see `extension/README.md`) |

## How to work on it
1. Change `CLAUDE.md`.
2. Run the cases in `evals/cases.md` with `/check`.
3. Score them with `evals/rubric.md`. Above all, check that cases A and B read
   with equal tone and scepticism.
4. Rebuild the Chrome extension (`cd extension && npm run build`) so it picks
   up the new instructions.
5. Commit the instructions, results and `extension/dist/` together.

## Principle
Fair isn't the midpoint. Balance applies to values and interpretations,
never to established facts.
