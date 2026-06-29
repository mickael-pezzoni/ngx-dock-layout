---
name: build-lib
description: Build the ngx-dock-layout library with ng-packagr — use before npm link, publishing, or to check for compilation errors after code changes.
---

Build the `ngx-dock-layout` library using ng-packagr. Output lands in `dist/ngx-dock-layout/`.

## Build

```bash
ng build ngx-dock-layout
```

Typical output (~1.2s):

```
Built Angular Package
- from: projects/ngx-dock-layout
- to:   dist/ngx-dock-layout
```

## After a successful build

To test locally with npm link:

```bash
cd dist/ngx-dock-layout
npm link
```

Then in the consumer project:

```bash
npm link /path/to/dist/ngx-dock-layout
```

## What to check

- Exit code 0 = no TypeScript or template errors
- If there are errors, they appear as `TS####:` lines with file and line number
- The build is incremental-safe: re-running always produces a clean dist

## Gotchas

- `ng build ngx-dock-layout` builds the **library**, not the demo app. Use `npm run build` for the demo app.
- After changing `public-api.ts` exports, always rebuild before running `npm link` tests — stale dist causes confusing type errors in the consumer.
- The consumer project and the library must use the **same Angular major version** at runtime (peerDependencies are `^19.0.0`); mismatched versions produce brand-type errors even if the build itself succeeds.
