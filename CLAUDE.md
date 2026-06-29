# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server (demo app at localhost:4200)
npm start

# Build demo app
npm run build

# Build library for publishing (ng-packagr)
ng build ngx-dock-layout

# Run tests
npm test

# Build for GitHub Pages
npm run github-build
```

There is no lint script configured; TypeScript type-checking is the primary safety net.

## Repository structure

This is an Angular workspace with two projects:

- **`projects/ngx-dock-layout/`** — the publishable library (`ng-packagr`)
- **`src/`** — demo application that imports the library directly from source

The library source lives in `projects/ngx-dock-layout/src/lib/`:
- `core/` — data model, `NdlLayoutManager`, utilities, DI token, directives
- `components/` — UI components (`pane`, `header`, `item`, `icon`, `drag-preview`)
- `ndl-layout.component.ts` — root component, hosts global CSS variables / themes
- `ndl-layout.service.ts` — singleton service for drag state and tab component registry

## Architecture

### Data model (two layers)

`public-type.ts` exposes the **consumer-facing types** (`Layout`, `Row`, `Column`, `Pane`, `Header`, `Tab`) where all `id` fields are optional and internal flags are absent.

`model.ts` defines the **internal strict types** (`StrictLayout`, `StrictRow`, …, `StrictTab`) where every `id` is required and all defaults are resolved. `NdlLayoutManager` converts public types → strict types on `init()` and `setConfig()`.

Key per-pane and per-tab flags resolved by `to-strict.utils.ts`:
- `StrictPane`: `isSplittable`, `canAddTab`, `isClosable` — default from `settings.headers.panes.*`
- `StrictTab`: `isClosable`, `isDraggable` — default from `settings.headers.panes.tabs.*`

### NdlLayoutManager

`NdlLayoutManager` (in `core/ndl-layout-manager.ts`) is the single source of truth. It holds a `WritableSignal<StrictLayout>` exposed as `config`. Mutations (`activeTab`, `addTab`, `closeTab`, `closePane`, `split`, `setSizes`, etc.) all go through `dispatch(action)`, which commits the action via `#history` and calls `this.config.set()`.

Consumers create it with `NdlLayoutManager.init({ layout, components })` and pass it to `<ngx-dock-layout [manager]="layoutManager" />`.

### DI tokens

`NdlLayoutComponent` provides `MANAGER` (an `InjectionToken<Signal<NdlLayoutManager>>`) so that child components (`PaneComponent`, `HeaderComponent`, etc.) can inject the manager without prop-drilling. The token holds a `Signal<NdlLayoutManager>`, so components call `this.layoutManager()` to get the instance.

`NDL_LABELS` (in `core/token.ts`) is a root-level `InjectionToken<NdlLabels>` with a factory returning `defaultNdlLabels`. It provides all user-visible strings (tooltips, button labels, dialog titles) so consumers can inject their own translations. `NdlLabels` (interface) and `defaultNdlLabels` (const) are both exported from the public API.

### Component tree

```
NdlLayoutComponent
  └── ItemComponent          (recursive: renders Row/Column/Pane via angular-split)
        └── PaneComponent
              ├── HeaderComponent
              │     └── TabComponent (×n)
              └── ContentComponent   (lazy-loads tab component via ViewContainerRef)
```

`ItemComponent` uses `angular-split` (`as-split` / `as-split-area`) to render resizable rows/columns.

### Action system

`Action` (in `core/action.ts`) is a builder — construct with `new Action({ action, strictLayout })` (or via `layoutManager.createAction(name)`), chain `.operation(fn)` calls (each receives the cumulative `StrictLayout` from the previous step), optionally set a `.rollback(fn)`, then call `.commit()` to get the resulting layout (idempotent, memoised after first call).

`ActionHistory` (in `core/action-history.ts`) is internal. It stores actions keyed by UUID, maintains a `currentActionId` cursor for undo/redo, and caps the stack at `maxSize` (default 50, configurable via `InitConfig.maxHistorySize`). `NdlLayoutManager` wraps it and exposes:
- `dispatch(action)` — commit and record
- `backConfig()` / `nextConfig()` — undo/redo
- `actions` / `currentActionId` — readonly signals for external consumers (e.g. history widget)

Custom actions use `createAction()` + `operation()` + `dispatch()` with the utility functions from `layout.utils` (`mapItem`, `insertTab`, etc.). `StrictLayout` and related types are exported from the public API and are also inferred from the callback parameters by TypeScript.

```typescript
// Single operation — rename a tab
layoutManager.dispatch(
  layoutManager
    .createAction(LayoutActionType.RenameTab)
    .operation((layout) => ({
      ...layout,
      root: editTab(layout.root, headerId, tabId, { title: 'New title' }),
    })),
);

// Chained operations — atomically remove a tab then close its pane
layoutManager.dispatch(
  layoutManager
    .createAction('removeTabAndClosePane')
    .operation((layout) => ({
      ...layout,
      root: removeTab(layout.root, headerId, tabId),
    }))
    .operation((layout) => ({
      ...layout,
      root: removePane(layout.root, paneId),
    })),
);

// Custom rollback — revert to a specific snapshot instead of the auto-captured one
const snapshot = layoutManager.config();
layoutManager.dispatch(
  layoutManager
    .createAction('riskyOp')
    .operation((layout) => { /* … */ })
    .rollback(() => snapshot),
);
```

### Drag & drop

`NdlLayoutService` holds `currentDragData: WritableSignal<DragTabData | undefined>` — the single drag state shared across all components.

- **Within the layout**: `TabComponent` emits `dragStart`; `HeaderComponent` handles `dragover`/`drop` and calls `layoutManager().addTab()` / `layoutManager().closeTab()`.
- **From outside the layout**: Use `[ndlDraggableElement]` directive (`NdlDraggableElementDirective`) with `NdlDragPreviewContainerComponent` + `NdlDragPreviewComponent` for the ghost image. `NdlDraggableElementDirective` sets `currentDragData` on `dragstart`; `PaneComponent` accepts the drop.
- **Tab component preservation**: `NdlLayoutService` tracks live `ComponentRef`s keyed by tab id. On drag-drop, `detachTabComponent()` / `attachTabComponent()` move the view between `ViewContainerRef`s so the component instance is preserved.

### CSS variable system (two levels)

Global tokens are declared on `:host` inside `NdlLayoutComponent`. Each sub-component re-declares **local** tokens in its own `:host` that reference the globals (e.g. `--ndl-tab-min-width: var(--ndl-tab-min-width, 100px)`). Consumers can override either level.

Themes (light/dark/abyss) are implemented as class selectors on an ancestor element:
```css
.dark ngx-dock-layout  { --ndl-color-primary: ...; }
.abyss ngx-dock-layout { --ndl-color-primary: ...; }
```

### IconComponent

`IconComponent` (`components/icon/icon.component.ts`) maintains a local `icons` const-object of SVG path data. The `icon` input is typed as `keyof typeof icons` — adding a new icon requires adding an entry to that object.

## Conventions

- All components use `ChangeDetectionStrategy.OnPush` and Angular signals; avoid imperative `markForCheck()`.
- **Prefer declarative and readable code**: use `computed()`, `linkedSignal()`, and Angular's `@if`/`@for`/`@let` control flow rather than imperative DOM manipulation or manual subscriptions. Favor clarity over cleverness — if a declarative approach becomes significantly more complex than an imperative one, the imperative approach is acceptable.
- **Immutable bindings + early returns**: prefer `const` with multiple `return` statements over `let` with reassignment. Each branch should produce its own `const` value and return it, rather than mutating a single variable toward a final return.
- CSS follows BEM: `ndl-block__element--modifier`.
- Internal strict types are in `model.ts`; public/consumer types are in `public-type.ts`. `StrictX` types are intentionally exported in `public-api.ts` because consumers need them to type event handlers (`(addTab)`, `(addHeader)`, `(editTab)`), template contexts (`emptyPaneTemplate`, `dragPreviewTemplate`), and custom action operations. Import them from `public-api.ts`, never directly from `model.ts`.
- `public-api.ts` controls what the library exports — keep it minimal.
