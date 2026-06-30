# ngx-dock-layout

[Lire la documentation en français](https://github.com/mickael-pezzoni/ngx-dock-layout/blob/main/projects/ngx-dock-layout/README.fr.md)

**ngx-dock-layout** is an Angular library for building resizable panel interfaces, in the style of an IDE. It lets you organize your components in a tree of rows, columns, and tabs that users can reorganize by drag and drop, split, or close on the fly. Designed for Angular 21 with signals and OnPush, it integrates without complex configuration.

- [ngx-dock-layout](#ngx-dock-layout)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
    - [Initialize the layout](#initialize-the-layout)
  - [Layout Structure](#layout-structure)
    - [Row / Column](#row--column)
    - [Pane](#pane)
    - [Header](#header)
    - [Tab](#tab)
  - [Global Settings](#global-settings)
  - [Passing Inputs to Tab Components](#passing-inputs-to-tab-components)
  - [State Persistence](#state-persistence)
  - [Customizing the Empty Pane Content](#customizing-the-empty-pane-content)
  - [External Draggable Elements](#external-draggable-elements)
  - [Customizing the Drag \& Drop Preview](#customizing-the-drag--drop-preview)
  - [Label Customization](#label-customization)
    - [Static override](#static-override)
    - [With `@angular/localize`](#with-angularlocalize)
    - [Available labels](#available-labels)
  - [Theming \& CSS Variables](#theming--css-variables)
    - [Global tokens](#global-tokens)
    - [Built-in dark theme](#built-in-dark-theme)
    - [Component tokens](#component-tokens)
      - [`ndl-header`](#ndl-header)
      - [`ndl-tab`](#ndl-tab)
      - [`ndl-pane`](#ndl-pane)
      - [`ndl-drag-preview`](#ndl-drag-preview)
    - [Examples](#examples)
  - [API Reference](#api-reference)
  - [License](#license)

## Features

- **Nested layout** Infinitely composable tree of Row / Column / Pane
- **Multiple tabs** Each pane can hold several tabs with a header
- **Drag & drop** Move a tab between panes, or split a pane by dropping it on its edge
- **Drag from outside** [ndlDraggableElement] directive to drag any external element into the layout
- **Lazy-loading** Tab components are loaded on first activation via dynamic import
- **Resizable panes** Based on angular-split, gutters are draggable
- **State persistence** config is a signal → easily persist to localStorage via effect()
- **Undo/Redo** ActionHistory with backConfig() / nextConfig(), configurable stack
- **Themes** Light / Dark / Abyss via CSS classes on an ancestor, overridable via CSS variables
- **i18n labels** Injectable NDL_LABELS token, compatible with @angular/localize

## Requirements

- Angular 21.2+
- `angular-split` 20+

## Installation

```bash
npm install ngx-dock-layout
```

## Quick Start

### Initialize the layout

The `NdlLayoutManager` class is what you use to interact with the layout. It must be instantiated with the `init` method, which takes your lazy-loaded Angular components and the layout configuration as parameters. Then simply pass the instance as an input to the `ngx-dock-layout` component.

```typescript
// app.component.ts
import { NdlLayoutManager, NdlLayoutComponent, provideNdlLayout } from 'ngx-dock-layout';

@Component({
  selector: 'app-root',
  imports: [NdlLayoutComponent],
  providers: [provideNdlLayout()],
  template: `<ngx-dock-layout [manager]="layoutManager" />`,
})
export class AppComponent {
  readonly layoutManager = NdlLayoutManager.init({
    components: {
      editor: () => import('./editor.component').then((m) => m.EditorComponent),
      terminal: () => import('./terminal.component').then((m) => m.TerminalComponent),
    },
    layout: {
      root: {
        type: 'row',
        children: [
          {
            type: 'pane',
            header: {
              type: 'header',
              tabs: [{ type: 'tab', title: 'Editor', component: { id: 'editor' } }],
            },
          },
          {
            type: 'pane',
            header: {
              type: 'header',
              tabs: [{ type: 'tab', title: 'Terminal', component: { id: 'terminal' } }],
            },
          },
        ],
      },
    },
  });
}
```

> [!NOTE]
> Everything present in the layout object represents what will be saved

Import the themes file in your global CSS:

```css
@import 'ngx-dock-layout/themes.css';
```

And make sure `ngx-dock-layout` takes up the necessary space:

```css
ngx-dock-layout {
  display: block;
  height: 100vh;
}
```

## Layout Structure

A layout is a tree that must start with `Row` or `Column`. These can then contain others before ending with a `Pane` to display your components.

```
Layout
└── root: Row | Column
    ├── Row / Column   (nestable)
    └── Pane
        └── Header
            └── Tab[]
```

### Row / Column

```typescript
type Row = {
  type: 'row';
  id?: string; // auto-generated if absent
  size?: number; // percentage size within the parent split
  children: (Row | Column | Pane)[];
};

type Column = {
  type: 'column';
  id?: string;
  size?: number;
  children: (Row | Column | Pane)[];
};
```

### Pane

```typescript
type Pane = {
  type: 'pane';
  id?: string;
  size?: number;
  header?: Header;
  isSplittable?: boolean; // overrides settings.panes.isSplittable
  canAddTab?: boolean; // overrides settings.panes.canAddTab
  isClosable?: boolean; // overrides settings.panes.isClosable
};
```

### Header

```typescript
type Header = {
  type: 'header';
  id?: string;
  isVisible?: boolean; // overrides settings.panes.headers.isVisible
  tabs: Tab[];
};
```

### Tab

```typescript
type Tab = {
  type: 'tab';
  id?: string;
  title: string;
  isActive?: boolean; // first tab is active by default
  isClosable?: boolean; // overrides settings.panes.headers.tabs.isClosable
  isDraggable?: boolean; // overrides settings.panes.headers.tabs.isDraggable
  isEditable?: boolean; // overrides settings.panes.headers.tabs.isEditable
  component?: {
    id: string; // key in your components map
    inputs?: Record<string, unknown>; // passed as component inputs
  };
};
```

## Global Settings

Global settings can be defined in the `layout.settings` object:

```typescript
const layout: Layout = {
  root: {
    /* ... */
  },
  settings: {
    panes: {
      isSplittable: true, // show split buttons on empty panes (default: true)
      canAddTab: true, // show add-tab button on empty panes (default: false)
      isClosable: true, // show close button on empty panes (default: true)
      headers: {
        isVisible: true, // show/hide all headers (default: true)
        canAddTab: true, // show add-tab button in headers (default: false)
        tabs: {
          isClosable: true, // show close button on all tabs (default: true)
          isDraggable: true, // allow tabs to be dragged (default: true)
          isEditable: false, // show edit button on all tabs (default: false)
        },
      },
    },
  },
};
```

Individual headers, panes, and tabs can override these defaults using their own `isVisible` / `isSplittable` / `canAddTab` / `isClosable` / `isDraggable` properties.

## Passing Inputs to Tab Components

Use the `inputs` field on `component` to pass data to lazy-loaded components:

```typescript
{
  type: 'tab',
  title: 'Editor',
  component: {
    id: 'editor',
    inputs: {
      filePath: '/src/app/app.component.ts',
      readOnly: false,
    },
  },
}
```

The component receives these values as standard Angular `@Input()` bindings.

## State Persistence

The `NdlLayoutManager` class exposes a `config` signal that represents the layout configuration at any given moment. You can listen to its changes and save the resulting object as JSON.

```typescript
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    localStorage.setItem('layout', JSON.stringify(this.layoutManager.config()));
  });
}

getInitialLayout(): Layout {
  const saved = localStorage.getItem('layout');
  return saved ? JSON.parse(saved) : defaultLayout;
}
```

Then pass `getInitialLayout()` to `NdlLayoutManager.init()`.

## Customizing the Empty Pane Content

By default, when a pane is empty and `Pane.isSplittable` / `Pane.isClosable` are not disabled, their respective buttons appear. You can override this display by providing your own template.

```html
<ngx-dock-layout
  class="layout"
  [manager]="layoutManager"
  [emptyPaneTemplate]="emptyPaneTemplate"
  (addTab)="pendingAddTabHeader.set($event)"
  (addHeader)="pendingAddHeaderPane.set($event)"
/>

<ng-template
  #emptyPaneTemplate
  let-layoutManager="layoutManager"
  let-pane="pane"
  let-parent="parent"
>
  <app-empty-pane-picker
    [items]="panelItems"
    [manager]="layoutManager"
    [paneId]="pane.id"
    [parentId]="parent.id"
    [isSplittable]="pane.isSplittable"
    [isClosable]="pane.isClosable"
  />
</ng-template>
```

## External Draggable Elements

You can add your components by dragging them from an HTML element. Use the `NdlDraggableElementDirective` directive. You can also reuse the library's built-in preview via `NdlDragPreviewComponent`, placed inside `NdlDragPreviewContainerComponent`.

```typescript
import {
  NdlDraggableElementDirective,
  NdlDragPreviewContainerComponent,
  NdlDragPreviewComponent,
} from 'ngx-dock-layout';
```

```typescript
@Component({
  imports: [NdlDraggableElementDirective, NdlDragPreviewContainerComponent, NdlDragPreviewComponent],
  template: `
    <div [ndlDraggableElement]="{ manager: layoutManager, tab: myTab }">
      Drag me into the layout

      <ndl-drag-preview-container>
        <!-- ghost image shown while dragging -->
        <ndl-drag-preview [tab]="myTab" />
      </ndl-drag-preview-container>
    </div>
  `,
})
```

`NdlDragPreviewComponent` is the library's built-in preview component. You can replace it with your own, as long as it is placed inside `NdlDragPreviewContainerComponent`.

`tab` accepts any `NewTab` object — no conversion needed. The `[ndlDraggableElement]` directive also accepts an optional `isDraggable` input (default: `true`) to conditionally disable dragging:

```html
<div [ndlDraggableElement]="{ manager: layoutManager, tab: myTab }" [isDraggable]="canDrag">
  ...
</div>
```

## Customizing the Drag & Drop Preview

By default, `NdlDragPreviewComponent` is used as the ghost image. You can override it by creating your own template and passing it via the `dragPreviewTemplate` input.

```html
<ngx-dock-layout
  class="layout"
  [manager]="layoutManager"
  [emptyPaneTemplate]="emptyPaneTemplate"
  [dragPreviewTemplate]="customDragPreviewTemplate"
  (addTab)="pendingAddTabHeader.set($event)"
  (addHeader)="pendingAddHeaderPane.set($event)"
/>

<ng-template #customDragPreviewTemplate let-tab="tab">
  <div class="app-drag-preview">
    @let item = getPanelItem(tab);
    <div class="app-drag-preview__header">
      <span class="app-drag-preview__icon" [style.background]="item?.color"
        >{{ item?.initials }}</span
      >
      <span class="app-drag-preview__title">{{ tab.title }}</span>
    </div>
    <div class="app-drag-preview__body"></div>
  </div>
</ng-template>
```

You can also access `let-parent="parent"` and `let-pane="pane"` variables in your template.

## Label Customization

All user-visible strings (tooltips, button labels, default text) can be overridden by providing the `NDL_LABELS` injection token. Import `NDL_LABELS`, `defaultNdlLabels`, and `NdlLabels` from `ngx-dock-layout`:

```typescript
import { NDL_LABELS, defaultNdlLabels, NdlLabels } from 'ngx-dock-layout';
```

### Static override

Provide your labels directly as a value (partial override with spread, or full replacement):

```typescript
providers: [
  {
    provide: NDL_LABELS,
    useValue: {
      ...defaultNdlLabels,
      newTabDefaultTitle: 'New tab',
      closePaneTooltip: 'Close',
    } satisfies NdlLabels,
  },
];
```

### With `@angular/localize`

`$localize` is a tagged template literal that returns a plain `string`; it therefore works directly with `useValue`:

```typescript
import { NDL_LABELS, NdlLabels } from 'ngx-dock-layout';

providers: [
  {
    provide: NDL_LABELS,
    useValue: {
      allTabsTooltip: $localize`:@@ndl.allTabsTooltip:All tabs`,
      newTabTooltip: $localize`:@@ndl.newTabTooltip:New tab`,
      newTabDefaultTitle: $localize`:@@ndl.newTabDefaultTitle:New Tab`,
      editTabTooltip: $localize`:@@ndl.editTabTooltip:Edit Tab`,
      splitColumnTooltip: $localize`:@@ndl.splitColumnTooltip:Split Column`,
      splitRowTooltip: $localize`:@@ndl.splitRowTooltip:Split Row`,
      closePaneTooltip: $localize`:@@ndl.closePaneTooltip:Close Pane`,
      closeTabTooltip: $localize`:@@ndl.closeTabTooltip:Close tab`,
    } satisfies NdlLabels,
  },
];
```

The `@@ndl.*` IDs let `ng extract-i18n` pick up these strings automatically alongside the rest of your app.

### Available labels

| Key                  | Default          | Description                                      |
| -------------------- | ---------------- | ------------------------------------------------ |
| `allTabsTooltip`     | `"All tabs"`     | Tooltip on the overflow dropdown button          |
| `newTabTooltip`      | `"New tab"`      | Tooltip on the add-tab button                    |
| `newTabDefaultTitle` | `"New Tab"`      | Default title when adding a tab programmatically |
| `editTabTooltip`     | `"Edit Tab"`     | Tooltip on the edit-tab button                   |
| `splitColumnTooltip` | `"Split Column"` | Tooltip on the split-column button (empty pane)  |
| `splitRowTooltip`    | `"Split Row"`    | Tooltip on the split-row button (empty pane)     |
| `closePaneTooltip`   | `"Close Pane"`   | Tooltip on the close-pane button (empty pane)    |
| `closeTabTooltip`    | `"Close tab"`    | Tooltip on the close button of each tab          |

## Theming & CSS Variables

The library uses a **two-level CSS variable system**:

- **Global tokens** — defined on `ngx-dock-layout`, they cascade to all child components. Override these to re-theme the entire layout.
- **Component tokens** — defined in each component's `:host`, referencing global tokens by default. Override these to target a single component.

```
ngx-dock-layout          ← override global tokens here
  └── ndl-tab                ← or component tokens here
```

### Global tokens

```css
ngx-dock-layout {
  /* Colors */
  --ndl-color-base: #d4d4d4;
  --ndl-color-surface: #f7f7f7;
  --ndl-color-surface-alt: #e6e6e6;
  --ndl-color-border: #e5e7eb;
  --ndl-color-text: #111827;

  /* Spacing */
  --ndl-spacing-xs: 2px;
  --ndl-spacing-sm: 4px;
  --ndl-spacing-md: 8px;

  /* Sizes */
  --ndl-radius-sm: 4px;
  --ndl-splitter-size: 6px;
  --ndl-tab-height: 30px;

  /* Icons */
  --ndl-icon-xs: 12px;
  --ndl-icon-sm: 16px;
  --ndl-icon-md: 20px;
  --ndl-icon-lg: 24px;
}
```

### Built-in dark theme

Apply the `.dark` class on a parent element to activate the dark theme:

```html
<body class="dark">
  <ngx-dock-layout [manager]="manager" />
</body>
```

To override variables **only in dark mode**, target `.dark ngx-dock-layout`:

```css
ngx-dock-layout {
  --ndl-color-base: #007acc;
}

.dark ngx-dock-layout {
  --ndl-color-base: #1f6feb;
}
```

### Component tokens

Each component exposes its own tokens for granular overrides.

#### `ndl-header`

```css
ndl-header {
  --ndl-header-color: var(--ndl-color-text);
  --ndl-header-add-size: 25px;
  --ndl-header-tab-min-width: 100px;
  --ndl-header-tab-max-width: 150px;
  --ndl-header-preview-color: var(--ndl-color-text);
}
```

#### `ndl-tab`

```css
ndl-tab {
  --ndl-tab-bg: var(--ndl-color-surface);
  --ndl-tab-bg-active: var(--ndl-color-base);
  --ndl-tab-color: var(--ndl-color-text);
  --ndl-tab-radius: var(--ndl-radius-sm);
  --ndl-tab-min-width: 100px;
  --ndl-tab-max-width: 150px;
}
```

#### `ndl-pane`

```css
ndl-pane {
  --ndl-pane-content-bg: var(--ndl-color-surface);
  --ndl-pane-action-bg: var(--ndl-color-base);
  --ndl-pane-button-sm: 25px;
  --ndl-pane-button-md: 30px;
  --ndl-pane-preview-color: var(--ndl-color-text);
}
```

#### `ndl-drag-preview`

```css
ndl-drag-preview {
  --ndl-drag-preview-width: 200px;
  --ndl-drag-preview-height: 120px;
  --ndl-drag-preview-titlebar-height: 32px;
  --ndl-drag-preview-font-size: 12px;
  --ndl-drag-preview-opacity: 0.93;
  --ndl-drag-preview-z-index: 9999;
}
```

### Examples

**Change accent color globally:**

```css
ngx-dock-layout {
  --ndl-color-base: #007acc;
}
```

**Change tab width only:**

```css
ndl-tab {
  --ndl-tab-min-width: 80px;
  --ndl-tab-max-width: 200px;
}
```

**Catppuccin Mocha dark theme:**

```css
.dark ngx-dock-layout {
  --ndl-color-base: #1e1e2e;
  --ndl-color-surface: #181825;
  --ndl-color-surface-alt: #1e1e2e;
  --ndl-color-border: #313244;
  --ndl-color-text: #cdd6f4;
}
```

## API Reference

For the full `NdlLayoutManager` API, action system, layout utilities, and DI token reference, see [API.md](https://github.com/mickael-pezzoni/ngx-dock-layout/blob/main/projects/ngx-dock-layout/API.md).

## License

MIT
