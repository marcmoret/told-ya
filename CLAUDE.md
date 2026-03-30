# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First:** Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `tasks/todo.md`
6. **Capture Lessons:** Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First:** Make every change as simple as possible. Impact minimal code.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.

## Build & Dev Commands

- `npm start` — Dev server at localhost:4200
- `ng build` — Production build (output: `dist/angular-ci-firebase`)
- `ng build --watch --configuration development` — Watch mode
- `ng test` — Unit tests (Karma + Jasmine)
- `ng lint` — Lint via TSLint
- `firebase deploy` — Deploy hosting + functions
- `cd functions && npm run build` — Compile Cloud Functions
- `cd functions && npm run serve` — Serve functions locally

## Architecture

**Standalone Angular 20 app** with Firebase backend (Firestore + Cloud Functions). No NgModules — uses `bootstrapApplication()` with `provideRouter()`.

### Frontend

- **Bootstrap:** `src/main.ts` — initializes Angular, Firebase providers, and routing
- **Routes:** `src/app/app.routes.ts` — `/` (landing), `/argument` (create vote), `/argument/:argumentId/:voterId` (vote page)
- **Service layer:** `src/api/argument.service.ts` — all Firebase interactions (Firestore reads via `.valueChanges()`, Cloud Function calls via `AngularFireFunctions`)
- **Models:** `src/app/shared/models/argument.ts` — `Argument` interface with dynamic voter keys (`voter0`, `voter1`, etc.), helper functions like `getVoterKey()`, `getTotalVotes()`, `isValidVoterId()`

### Backend (Cloud Functions)

- `functions/src/index.ts` — Two callable functions:
  - `createArgument` — validates, saves to Firestore, sends SMS via Twilio
  - `castVote` — validates voter, uses Firestore transactions for atomic vote updates

### Key Patterns

- **Standalone components** with explicit imports, `OnPush` change detection
- **Angular Signals** for component state (`signal()`, `viewChild()`)
- **`inject()` function** for DI (not constructor injection)
- **RxJS** with `takeUntilDestroyed()` for auto-unsubscribe
- **Reactive Forms** with custom validators (phone number format, duplicate detection)

## Styling

- SCSS with component-scoped styles
- Global CSS variables in `src/styles.scss`: `--color-ink`, `--color-brand`, `--color-surface`, `--radius-lg`, `--font-body` (Manrope), `--font-display` (Newsreader)
- No utility CSS framework — custom design system

## Environments

- `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod)
- Angular.json handles file replacement for production builds
- Firebase project: `told-ya` (hosted at toldya.ca)

## Linting Rules (TSLint)

- Single quotes, semicolons required
- Max line length: 140
- Component selectors: `app-` prefix, kebab-case
- Directive selectors: `app-` prefix, camelCase
- `prefer-const`, `triple-equals`, `no-console` (except debug/info/time/trace)

## tsconfig Notes

- Target: ES2022, module resolution: `bundler`
- `skipLibCheck: true`
- Path alias `@pretext` maps to `src/lib/pretext` (pre-bundled CJS + hand-written `.d.ts`)

## @chenglou/pretext Integration

- The npm package ships raw `.ts` sources with `.ts` extension imports — incompatible with Angular's build pipeline
- Workaround: pre-bundled via `npx esbuild node_modules/@chenglou/pretext/src/layout.ts --bundle --format=cjs --outfile=src/lib/pretext.js`
- Types in `src/lib/pretext.d.ts` (manually written, not auto-generated)
- If updating the package version, re-run the esbuild command and verify the `.d.ts` still matches
