# Lessons Learned

## 2026-03-28

### Don't add `noEmit: true` to Angular tsconfig
- **What happened:** Added `allowImportingTsExtensions: true` + `noEmit: true` to root tsconfig to support `@chenglou/pretext`'s raw `.ts` imports. This caused Angular to emit empty bundles (99-byte `main.js`), resulting in a blank page.
- **Root cause:** Angular's build pipeline needs to emit — `noEmit: true` silently breaks it without a build error.
- **Fix:** Pre-bundle incompatible packages with esbuild into a local `.js` file instead of fighting the tsconfig.
- **Rule:** Never add `noEmit: true` to an Angular project's tsconfig. If a dependency ships raw `.ts` with `.ts` extension imports, pre-bundle it externally.

### Verify the dev server actually renders before declaring success
- **What happened:** Build succeeded (`ng build` reported no errors), but the app served a blank page because the bundles were empty.
- **Rule:** Always check that the page actually renders in the browser (or via `curl`) — a passing build doesn't mean the app works.

### Don't assume which project the user is referring to
- **What happened:** User said "I installed a new package" — I assumed `told-ya` based on the open IDE file, which happened to be correct, but I should have confirmed or checked the working directory first.
- **Rule:** When the working directory contains multiple projects, confirm which one before making changes.
