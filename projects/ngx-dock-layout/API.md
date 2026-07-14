# API Reference

- [API Reference](#api-reference)
  - [NdlLayoutManager](#ndllayoutmanager)
    - [Initialization](#initialization)
    - [Properties](#properties)
    - [Methods](#methods)
      - [`setConfig(layout: Layout): void`](#setconfiglayout-layout-void)
      - [`addTab(headerId: string, tab: NewTab, index?: number): void`](#addtabheaderid-string-tab-newtab-index-number-void)
      - [`closeTab(headerId: string, tabId: string): void`](#closetabheaderid-string-tabid-string-void)
      - [`editTab(headerId: string, tabId: string, update: Partial<StrictTab>): void`](#edittabheaderid-string-tabid-string-update-partialstricttab-void)
      - [`activeTab(headerId: string, tabId: string): void`](#activetabheaderid-string-tabid-string-void)
      - [`addHeader(paneId: string, header: NewHeader): void`](#addheaderpaneid-string-header-newheader-void)
      - [`closePane(paneId: string): void`](#closepanepaneid-string-void)
      - [`split(rowOrColumnId, paneId, splitType, position, pane?): void`](#splitroworcolumnid-paneid-splittype-position-pane-void)
      - [`setSizes(parentId: string, sizes: SplitAreaSize[]): void`](#setsizesparentid-string-sizes-splitareasize-void)
      - [`findItem(predicate): StrictItem | undefined`](#finditempredicate-strictitem--undefined)
      - [`findItemByIdOrFail(id): StrictItem`](#finditembyidorfailid-strictitem)
      - [`backConfig(): void`](#backconfig-void)
      - [`nextConfig(): void`](#nextconfig-void)
      - [`renameTab(headerId: string, tabId: string, title: string): void`](#renametabheaderid-string-tabid-string-title-string-void)
      - [`everyItem(predicate, item?): boolean`](#everyitempredicate-item-boolean)
      - [`moveTab(source, target): void`](#movetabsource-target-void)
      - [`dropTabToPane(source, target): void`](#droptabtopanesource-target-void)
      - [`maximizePane(paneId: string): void`](#maximizepanepaneid-string-void)
      - [`restorePane(paneId: string): void`](#restorepanepaneid-string-void)
      - [`toggleMaximizePane(paneId: string): void`](#togglemaximizepanepaneid-string-void)
  - [Action System](#action-system)
    - [`LayoutActionType` enum](#layoutactiontype-enum)
    - [Reading the history](#reading-the-history)
    - [Creating custom actions](#creating-custom-actions)
  - [Layout Utilities](#layout-utilities)
  - [DI Tokens](#di-tokens)
    - [`NDL_LAYOUT_MANAGER`](#ndl_layout_manager)
    - [`NDL_TAB_CONTEXT`](#ndl_tab_context)
    - [`NDL_LABELS`](#ndl_labels)

## NdlLayoutManager

`NdlLayoutManager` is the state engine. Create it with `NdlLayoutManager.init()` and pass it to `<ngx-dock-layout>`.

### Initialization

```typescript
NdlLayoutManager.init({
  layout,                // Layout — the initial layout tree
  components,            // Components<T> — lazy-loadable component map
  maxHistorySize?,       // number — max undo/redo entries (default: 50)
});
```

### Properties

| Property          | Type                                                                           | Description                                                                      |
| ----------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `config`          | `Signal<StrictLayout>`                                                         | Read-only signal of the current layout state                                     |
| `settings`        | `Signal<StrictSettings \| undefined>`                                          | Computed signal of global settings                                               |
| `components`      | `Components<T>`                                                                | The registered component map                                                     |
| `actions`         | `Signal<Record<string, Action>>`                                               | All recorded actions, keyed by UUID                                              |
| `currentActionId` | `Signal<string \| undefined>`                                                  | Cursor position in the history; `undefined` when at the tip                      |
| `maximizedPane`   | `Signal<{ pane: StrictPane; parent: StrictRow \| StrictColumn } \| undefined>` | The currently maximized pane (and its parent row/column), or `undefined` if none |

### Methods

#### `setConfig(layout: Layout): void`

Replace the entire layout with a new one.

```typescript
layoutManager.setConfig(newLayout);
```

#### `addTab(headerId: string, tab: NewTab, index?: number): void`

Add a tab to a header. Pass `index` to insert at a specific position (default: append).

```typescript
layoutManager.addTab('header-id', {
  type: 'tab',
  title: 'New File',
  isActive: true,
  component: { id: 'editor', inputs: { filePath: 'new-file.ts' } },
});
```

#### `closeTab(headerId: string, tabId: string): void`

Remove a tab from a header. The next tab is activated automatically.

```typescript
layoutManager.closeTab('header-id', 'tab-id');
```

#### `editTab(headerId: string, tabId: string, update: Partial<StrictTab>): void`

Update tab properties (e.g. title, isActive).

```typescript
layoutManager.editTab('header-id', 'tab-id', { title: 'Renamed' });
```

#### `activeTab(headerId: string, tabId: string): void`

Activate a tab programmatically.

```typescript
layoutManager.activeTab('header-id', 'tab-id');
```

#### `addHeader(paneId: string, header: NewHeader): void`

Add a header (and optional tabs) to an empty pane.

```typescript
layoutManager.addHeader('pane-id', {
  type: 'header',
  tabs: [{ type: 'tab', title: 'My Tab' }],
});
```

#### `closePane(paneId: string): void`

Remove a pane from the layout. Empty parent rows/columns are cleaned up automatically.

```typescript
layoutManager.closePane('pane-id');
```

#### `split(rowOrColumnId, paneId, splitType, position, pane?): void`

Split a pane into two. `position` is `0` (new pane first) or `1` (new pane second).

```typescript
layoutManager.split('row-id', 'pane-id', 'column', 1, {
  type: 'pane',
  header: {
    type: 'header',
    tabs: [{ type: 'tab', title: 'New Pane' }],
  },
});
```

#### `setSizes(parentId: string, sizes: SplitAreaSize[]): void`

Update the size of children within a row or column (called internally on gutter drag).

#### `findItem(predicate): StrictItem | undefined`

Find a node in the layout tree.

```typescript
const tab = layoutManager.findItem((item) => item.type === 'tab' && item.id === 'tab-1');
```

#### `findItemByIdOrFail(id): StrictItem`

Like `findItem` but throws if not found.

#### `backConfig(): void`

Undo the last action (moves the history cursor back one step).

```typescript
layoutManager.backConfig();
```

#### `nextConfig(): void`

Redo the previously undone action (moves the history cursor forward one step).

```typescript
layoutManager.nextConfig();
```

#### `renameTab(headerId: string, tabId: string, title: string): void`

Rename a tab. Shorthand for `editTab` with only a `title` change.

```typescript
layoutManager.renameTab('header-id', 'tab-id', 'New Title');
```

#### `everyItem(predicate, item?): boolean`

Returns `true` if the predicate holds on every node in the layout tree (defaults to the full tree).

```typescript
const allDraggable = layoutManager.everyItem((item) => item.type !== 'tab' || item.isDraggable);
```

#### `moveTab(source, target): void`

Move a tab from one header to another (or reorder within the same header). Used internally by drag-and-drop.

```typescript
layoutManager.moveTab(
  { tab: strictTab, headerId: 'source-header', paneId: 'source-pane' },
  { headerId: 'target-header', index: 2 },
);
```

#### `dropTabToPane(source, target): void`

Drop a tab onto a pane zone. Used internally when a tab is dragged over a pane edge or center. `zone` can be `'top' | 'left' | 'right' | 'bottom' | 'center'`. Non-center zones create a new split; `'center'` appends to the target header.

```typescript
layoutManager.dropTabToPane(
  { tab: strictTab, headerId: 'source-header', paneId: 'source-pane' },
  { paneId: 'target-pane', parentId: 'parent-row', zone: 'right' },
);
```

#### `maximizePane(paneId: string): void`

Maximize a pane so it visually takes over the whole layout. Only one pane can be maximized at a time; maximizing a different pane automatically restores the previous one.

```typescript
layoutManager.maximizePane('pane-id');
```

#### `restorePane(paneId: string): void`

Restore a previously maximized pane back to its normal position in the layout.

```typescript
layoutManager.restorePane('pane-id');
```

#### `toggleMaximizePane(paneId: string): void`

Maximizes the pane if it isn't currently maximized, restores it otherwise. Shorthand for checking `isMaximized` yourself before calling `maximizePane`/`restorePane`.

```typescript
layoutManager.toggleMaximizePane('pane-id');
```

---

## Action System

Every mutation performed by `NdlLayoutManager` is wrapped in an `Action` and recorded in an internal history. This enables undo/redo and gives you a typed audit trail of every change. The history is capped at `maxHistorySize` entries (default: 50, configurable via `NdlLayoutManager.init()`).

### `LayoutActionType` enum

All built-in mutations are identified by a value of `LayoutActionType`:

| Value           | Triggered by                                                         |
| --------------- | -------------------------------------------------------------------- |
| `Resize`        | `setSizes()`                                                         |
| `Split`         | `split()`                                                            |
| `ActiveTab`     | `activeTab()`                                                        |
| `AddTab`        | `addTab()`                                                           |
| `AddHeader`     | `addHeader()`                                                        |
| `EditTab`       | `editTab()`                                                          |
| `CloseTab`      | `closeTab()`                                                         |
| `ClosePane`     | `closePane()`                                                        |
| `RenameTab`     | `renameTab()`                                                        |
| `MoveTab`       | `moveTab()`                                                          |
| `DropTabToPane` | drop onto a pane zone                                                |
| `MaximizePane`  | `maximizePane()` (also via `toggleMaximizePane()` when it maximizes) |
| `RestorePane`   | `restorePane()` (also via `toggleMaximizePane()` when it restores)   |

### Reading the history

`NdlLayoutManager` exposes two readonly signals:

| Signal            | Type                             | Description                                                           |
| ----------------- | -------------------------------- | --------------------------------------------------------------------- |
| `actions`         | `Signal<Record<string, Action>>` | All recorded actions, keyed by UUID                                   |
| `currentActionId` | `Signal<string \| undefined>`    | The action that was most recently undone; `undefined` when at the tip |

```typescript
const history = computed(() => Object.values(layoutManager.actions()).map((a) => a.action));
```

### Creating custom actions

Use `createAction()` + `operation()` + `dispatch()` to build an action that participates in undo/redo exactly like a built-in one.

`operation()` receives the current `StrictLayout` and must return a new one — never mutate in place. Chain multiple calls for multi-step changes that commit atomically.

```typescript
import { mapItem } from 'ngx-dock-layout';

// Mark every tab in a specific header as non-closable
const action = layoutManager.createAction('lockTabs').operation((layout) => ({
  ...layout,
  root: mapItem(layout.root, {
    header: (header) =>
      header.id !== targetHeaderId
        ? header
        : {
            ...header,
            tabs: header.tabs.map((tab) => ({ ...tab, isClosable: false })),
          },
  }),
}));

layoutManager.dispatch(action);
```

**Custom rollback** — by default an action rolls back to the layout snapshot taken at construction time. Override this with `rollback()`:

```typescript
const action = layoutManager
  .createAction('myAction')
  .operation((layout) => {
    /* … */
  })
  .rollback(() => someSpecificLayout);

layoutManager.dispatch(action);
```

**Multi-step operations** — chain `operation()` calls to compose several tree transforms into one atomic history entry:

```typescript
const action = layoutManager
  .createAction('addAndActivate')
  .operation((layout) => ({
    ...layout,
    root: insertTab(layout.root, headerId, newTab),
  }))
  .operation((layout) => ({
    ...layout,
    root: activateTab(layout.root, headerId, newTab.id),
  }));

layoutManager.dispatch(action);
```

---

## Layout Utilities

All functions below are exported from `ngx-dock-layout` and operate immutably on the layout tree.

| Function                                            | Description                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| `mapItem(root, maps)`                               | Walk the tree, applying per-type callbacks                           |
| `findItem(predicate, root)`                         | Depth-first search, returns first match                              |
| `findItemByIdOrFail(id, root)`                      | Like `findItem` but throws if missing                                |
| `findParentItem(root, predicate)`                   | Returns the item that directly contains a child matching `predicate` |
| `everyItem(predicate, root)`                        | Returns `true` if predicate holds on every node                      |
| `insertTab(root, headerId, tab, index?)`            | Insert a tab into a header                                           |
| `removeTab(root, headerId, tabId)`                  | Remove a tab, normalises active state                                |
| `insertHeader(root, paneId, header)`                | Attach a header to an empty pane                                     |
| `activateTab(root, headerId, tabId)`                | Activate one tab, deactivate siblings                                |
| `editTab(root, headerId, tabId, changes)`           | Shallow-merge `changes` onto a tab                                   |
| `removePane(root, paneId)`                          | Remove a pane, prunes empty containers                               |
| `splitPane(root, rcId, paneId, type, pos, newPane)` | Split a pane into two                                                |
| `applySizes(root, parentId, sizes)`                 | Update child sizes in a row/column                                   |
| `insertTabToTabs(tabs, newTab, index)`              | Low-level tab array insertion                                        |
| `getActiveTab(header)`                              | Returns the active tab or `undefined`                                |
| `getTabById(header, tabId)`                         | Returns the tab matching `tabId` or `undefined`                      |
| `setActiveTab(tabs, activeTabId?)`                  | Normalise active-tab state on a tab array                            |
| `maximizePane(root, paneId)`                        | Sets `isMaximized` on `paneId` to `true`, all others to `false`      |
| `restorePane(root, paneId)`                         | Sets `isMaximized` on `paneId` back to `false`                       |
| `setMaximizedPanes(root)`                           | Normalises the tree so at most one pane has `isMaximized: true`      |

---

## DI Tokens

### `NDL_LAYOUT_MANAGER`

Inject the `NdlLayoutManager` instance deep in the component tree without prop-drilling.

```typescript
import { NDL_LAYOUT_MANAGER } from 'ngx-dock-layout';

// In a parent component:
providers: [{ provide: NDL_LAYOUT_MANAGER, useValue: this.layoutManager }]

// In a child component:
readonly manager = inject(NDL_LAYOUT_MANAGER);
```

### `NDL_TAB_CONTEXT`

Automatically provided to every tab content component. Inject it to know which pane, header, and tab the component is rendered in.

```typescript
import { NDL_TAB_CONTEXT, TabContext } from 'ngx-dock-layout';
import { inject, Signal } from '@angular/core';

// Inside a lazy-loaded tab component:
readonly context: Signal<TabContext> = inject(NDL_TAB_CONTEXT);
// context().tabId, context().headerId, context().paneId
```

### `NDL_LABELS`

Override all user-visible strings (tooltips, button labels). See the Label Customization section in README for the full list.
