# ngx-dock-layout

[Read the documentation in English](https://github.com/mickael-pezzoni/ngx-dock-layout/blob/main/projects/ngx-dock-layout/README.md)

**ngx-dock-layout** est une librairie Angular pour créer des interfaces à panneaux redimensionnables, à la manière d'un IDE.

Elle permet d'organiser vos composants dans un arbre de lignes, colonnes et onglets que l'utilisateur peut réorganiser par glisser-déposer, diviser ou fermer à la volée. Conçue pour Angular 21 avec les signals et OnPush, elle s'intègre sans configuration complexe.

- [ngx-dock-layout](#ngx-dock-layout)
  - [Fonctionnalités](#fonctionnalités)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Démarrage rapide](#démarrage-rapide)
    - [Initialiser le layout](#initialiser-le-layout)
  - [Structure du layout](#structure-du-layout)
    - [Row / Column](#row--column)
    - [Pane](#pane)
    - [Header](#header)
    - [Tab](#tab)
  - [Paramètres globaux](#paramètres-globaux)
  - [Passer des inputs aux composants de tab](#passer-des-inputs-aux-composants-de-tab)
  - [Persistance d'état](#persistance-détat)
  - [Personnaliser le contenu vide d'un Pane](#personnaliser-le-contenu-vide-dun-pane)
  - [Éléments glissables depuis l'extérieur](#éléments-glissables-depuis-lextérieur)
  - [Personnaliser la prévisualisation du drag \& drop de la librairie](#personnaliser-la-prévisualisation-du-drag--drop-de-la-librairie)
  - [Personnalisation des labels](#personnalisation-des-labels)
    - [Surcharge statique](#surcharge-statique)
    - [Avec `@angular/localize`](#avec-angularlocalize)
    - [Labels disponibles](#labels-disponibles)
  - [Thèmes \& variables CSS](#thèmes--variables-css)
    - [Tokens globaux](#tokens-globaux)
    - [Thème sombre intégré](#thème-sombre-intégré)
    - [Tokens de composant](#tokens-de-composant)
      - [`ndl-header`](#ndl-header)
      - [`ndl-tab`](#ndl-tab)
      - [`ndl-pane`](#ndl-pane)
      - [`ndl-drag-preview`](#ndl-drag-preview)
    - [Exemples](#exemples)
  - [Référence API](#référence-api)
  - [Licence](#licence)

## Fonctionnalités

- **Layout imbriqué** Arbre de Row / Column / Pane composable à l'infini
- **Onglets multiples** Chaque pane peut accueillir plusieurs tabs avec un header
- **Drag & drop** Déplacer un tab entre panes, ou diviser une pane en le déposant sur son bord
- **Drag depuis l'extérieur** Directive [ndlDraggableElement] pour glisser n'importe quel élément externe dans le layout
- **Lazy-loading** Les composants des tabs sont chargés à la première activation via import dynamique
- **Panes redimensionnables** Basé sur angular-split, les séparateurs sont glissables
- **Persistance d'état** config est un signal → persiste facilement en localStorage via effect()
- **Undo/Redo** ActionHistory avec backConfig() / nextConfig(), pile configurable
- **Thèmes** Light / Dark / Abyss via classes CSS sur un ancêtre, surchargeables par CSS variables
- **Labels i18n** Token NDL_LABELS injectable, compatible @angular/localize

## Prérequis

- Angular 19.0+
- `angular-split` 20+

## Installation

```bash
npm install ngx-dock-layout
```

## Démarrage rapide

### Initialiser le layout

C'est la classe `NdlLayoutManager` qui permet d'interagir avec le layout. Elle doit être instanciée avec la méthode `init` qui prend en paramètres la liste de vos composants Angular qui seront lazy-loadés, ainsi que la configuration du layout. Ensuite, il suffit de passer l'instance en input au composant `ngx-dock-layout`.

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
> Tout ce qui est présent dans l'objet layout représente ce qui sera sauvegardé

Importez le fichier de thèmes dans votre CSS global :

```css
@import 'ngx-dock-layout/themes.css';
```

Et assurez-vous que `ngx-dock-layout` occupe l'espace nécessaire :

```css
ngx-dock-layout {
  display: block;
  height: 100vh;
}
```

## Structure du layout

Un layout est un arbre qui doit commencer par `Row` ou `Column`. Celles-ci peuvent ensuite en contenir d'autres avant de terminer par un `Pane` pour afficher vos composants.

```
Layout
└── root: Row | Column
    ├── Row / Column   (imbriquable)
    └── Pane
        └── Header
            └── Tab[]
```

### Row / Column

```typescript
type Row = {
  type: 'row';
  id?: string; // généré automatiquement si absent
  size?: number; // taille en pourcentage dans le split parent
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
  isSplittable?: boolean; // surcharge settings.panes.isSplittable
  canAddTab?: boolean; // surcharge settings.panes.canAddTab
  isClosable?: boolean; // surcharge settings.panes.isClosable
};
```

### Header

```typescript
type Header = {
  type: 'header';
  id?: string;
  isVisible?: boolean; // surcharge settings.panes.headers.isVisible
  tabs: Tab[];
};
```

### Tab

```typescript
type Tab = {
  type: 'tab';
  id?: string;
  title: string;
  isActive?: boolean; // le premier tab est actif par défaut
  isClosable?: boolean; // surcharge settings.panes.headers.tabs.isClosable
  isDraggable?: boolean; // surcharge settings.panes.headers.tabs.isDraggable
  isEditable?: boolean; // surcharge settings.panes.headers.tabs.isEditable
  component?: {
    id: string; // clé dans votre map de composants
    inputs?: Record<string, unknown>; // passés en tant qu'inputs du composant
  };
};
```

## Paramètres globaux

Des paramètres globaux peuvent être définis dans l'objet `layout.settings` :

```typescript
const layout: Layout = {
  root: {
    /* ... */
  },
  settings: {
    panes: {
      isSplittable: true, // afficher les boutons de division sur les panes vides (défaut : true)
      canAddTab: true, // afficher le bouton d'ajout de tab sur les panes vides (défaut : false)
      isClosable: true, // afficher le bouton de fermeture sur les panes vides (défaut : true)
      headers: {
        isVisible: true, // afficher/masquer tous les headers (défaut : true)
        canAddTab: true, // afficher le bouton d'ajout de tab dans les headers (défaut : false)
        tabs: {
          isClosable: true, // afficher le bouton de fermeture sur tous les tabs (défaut : true)
          isDraggable: true, // autoriser le déplacement des tabs (défaut : true)
          isEditable: false, // afficher le bouton d'édition sur tous les tabs (défaut : false)
        },
      },
    },
  },
};
```

Les headers, panes et tabs individuels peuvent surcharger ces valeurs par défaut via leurs propres propriétés `isVisible` / `isSplittable` / `canAddTab` / `isClosable` / `isDraggable`.

## Passer des inputs aux composants de tab

Utilisez le champ `inputs` sur `component` pour passer des données aux composants lazy-loadés :

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

Le composant reçoit ces valeurs en tant que bindings `@Input()` Angular standards.

## Persistance d'état

La classe `NdlLayoutManager` expose un signal `config` qui représente la configuration du layout à chaque instant. Vous pouvez écouter ses changements et sauvegarder l'objet obtenu en JSON.

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

Passez ensuite `getInitialLayout()` à `NdlLayoutManager.init()`.

## Personnaliser le contenu vide d'un Pane

Par défaut, quand un pane est vide et que les paramètres `Pane.isSplittable` et `Pane.isClosable` ne sont pas désactivés, leurs boutons respectifs apparaissent. Il est possible de surcharger cet affichage en créant son propre template.

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

## Éléments glissables depuis l'extérieur

Il est possible d'ajouter vos composants en les faisant glisser depuis un élément HTML. Pour cela, utilisez la directive `NdlDraggableElementDirective`. Vous pouvez également réutiliser la prévisualisation de la librairie via `NdlDragPreviewComponent`, à placer dans `NdlDragPreviewContainerComponent`.

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
      Faites-moi glisser dans le layout

      <ndl-drag-preview-container>
        <!-- image fantôme affichée pendant le glissement -->
        <ndl-drag-preview [tab]="myTab" />
      </ndl-drag-preview-container>
    </div>
  `,
})
```

`NdlDragPreviewComponent` est le composant de prévisualisation intégré à la librairie. Vous pouvez le remplacer par le vôtre à condition de le placer à l'intérieur de `NdlDragPreviewContainerComponent`.

`tab` accepte n'importe quel objet `NewTab` — aucune conversion nécessaire. La directive `[ndlDraggableElement]` accepte également un input optionnel `isDraggable` (défaut : `true`) pour désactiver conditionnellement le glissement :

```html
<div [ndlDraggableElement]="{ manager: layoutManager, tab: myTab }" [isDraggable]="canDrag">
  ...
</div>
```

## Personnaliser la prévisualisation du drag & drop de la librairie

Par défaut, c'est `NdlDragPreviewComponent` qui est utilisé comme image fantôme. Il est possible de le surcharger en créant son propre template et en le passant via l'input `dragPreviewTemplate`.

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

Vous pouvez également accéder aux variables `let-parent="parent"` et `let-pane="pane"` dans votre template

## Personnalisation des labels

Toutes les chaînes visibles par l'utilisateur (infobulles, labels de boutons, textes par défaut) peuvent être surchargées en fournissant le token d'injection `NDL_LABELS`. Importez `NDL_LABELS`, `defaultNdlLabels` et `NdlLabels` depuis `ngx-dock-layout` :

```typescript
import { NDL_LABELS, defaultNdlLabels, NdlLabels } from 'ngx-dock-layout';
```

### Surcharge statique

Fournissez vos labels directement comme valeur (surcharge partielle avec spread, ou remplacement complet) :

```typescript
providers: [
  {
    provide: NDL_LABELS,
    useValue: {
      ...defaultNdlLabels,
      newTabDefaultTitle: 'Nouvel onglet',
      closePaneTooltip: 'Fermer',
    } satisfies NdlLabels,
  },
];
```

### Avec `@angular/localize`

`$localize` est un tagged template literal qui retourne une `string` simple ; il fonctionne donc directement avec `useValue` :

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

Les IDs `@@ndl.*` permettent à `ng extract-i18n` de collecter ces chaînes automatiquement avec le reste de votre application.

### Labels disponibles

| Clé                  | Défaut           | Description                                             |
| -------------------- | ---------------- | ------------------------------------------------------- |
| `allTabsTooltip`     | `"All tabs"`     | Infobulle du bouton de débordement                      |
| `newTabTooltip`      | `"New tab"`      | Infobulle du bouton d'ajout de tab                      |
| `newTabDefaultTitle` | `"New Tab"`      | Titre par défaut lors de l'ajout d'un tab par programme |
| `editTabTooltip`     | `"Edit Tab"`     | Infobulle du bouton d'édition de tab                    |
| `splitColumnTooltip` | `"Split Column"` | Infobulle du bouton de division en colonne (pane vide)  |
| `splitRowTooltip`    | `"Split Row"`    | Infobulle du bouton de division en ligne (pane vide)    |
| `closePaneTooltip`   | `"Close Pane"`   | Infobulle du bouton de fermeture de pane (pane vide)    |
| `closeTabTooltip`    | `"Close tab"`    | Infobulle du bouton de fermeture de chaque tab          |

## Thèmes & variables CSS

La librairie utilise un **système de variables CSS à deux niveaux** :

- **Tokens globaux** — définis sur `ngx-dock-layout`, ils se propagent à tous les composants enfants. Surchargez-les pour re-thématiser l'ensemble du layout.
- **Tokens de composant** — définis dans le `:host` de chaque composant, référençant les tokens globaux par défaut. Surchargez-les pour cibler un seul composant.

```
ngx-dock-layout          ← surcharger les tokens globaux ici
  └── ndl-tab                ← ou les tokens de composant ici
```

### Tokens globaux

```css
ngx-dock-layout {
  /* Couleurs */
  --ndl-color-base: #d4d4d4;
  --ndl-color-surface: #f7f7f7;
  --ndl-color-surface-alt: #e6e6e6;
  --ndl-color-border: #e5e7eb;
  --ndl-color-text: #111827;

  /* Espacements */
  --ndl-spacing-xs: 2px;
  --ndl-spacing-sm: 4px;
  --ndl-spacing-md: 8px;

  /* Tailles */
  --ndl-radius-sm: 4px;
  --ndl-splitter-size: 6px;
  --ndl-tab-height: 30px;

  /* Icônes */
  --ndl-icon-xs: 12px;
  --ndl-icon-sm: 16px;
  --ndl-icon-md: 20px;
  --ndl-icon-lg: 24px;
}
```

### Thème sombre intégré

Appliquez la classe `.dark` sur un élément parent pour activer le thème sombre :

```html
<body class="dark">
  <ngx-dock-layout [manager]="manager" />
</body>
```

Pour surcharger des variables **uniquement en mode sombre**, ciblez `.dark ngx-dock-layout` :

```css
ngx-dock-layout {
  --ndl-color-base: #007acc;
}

.dark ngx-dock-layout {
  --ndl-color-base: #1f6feb;
}
```

### Tokens de composant

Chaque composant expose ses propres tokens pour des surcharges granulaires.

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

### Exemples

**Changer la couleur d'accentuation globalement :**

```css
ngx-dock-layout {
  --ndl-color-base: #007acc;
}
```

**Changer la largeur des tabs uniquement :**

```css
ndl-tab {
  --ndl-tab-min-width: 80px;
  --ndl-tab-max-width: 200px;
}
```

**Thème sombre Catppuccin Mocha :**

```css
.dark ngx-dock-layout {
  --ndl-color-base: #1e1e2e;
  --ndl-color-surface: #181825;
  --ndl-color-surface-alt: #1e1e2e;
  --ndl-color-border: #313244;
  --ndl-color-text: #cdd6f4;
}
```

## Référence API

Pour l'API complète de `NdlLayoutManager`, le système d'actions, les utilitaires de layout et la référence des tokens DI, voir [API.md](API.md).

## Licence

MIT
