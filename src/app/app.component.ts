import { Component, effect, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  defaultNdlLabels,
  Layout,
  NdlDragPreviewComponent,
  NdlDragPreviewContainerComponent,
  NdlDraggableElementDirective,
  NdlLayoutComponent,
  NdlLayoutManager,
  NdlLabels,
  NDL_LABELS,
  provideNdlLayout,
  StrictHeader,
  StrictPane,
} from '../../projects/ngx-dock-layout/src/public-api';
import { ActionHistoryComponent } from './action-history.component';
import { EmptyPanePickerComponent, PanelItem } from './empty-pane-picker.component';
import { CommonModule } from '@angular/common';

// eslint-disable-next-line unused-imports/no-unused-vars
const builtinThemes = ['light', 'dark', 'abyss'] as const;
type Theme = (typeof builtinThemes)[number];

@Component({
  selector: 'app-root',
  imports: [
    NdlLayoutComponent,
    NdlDraggableElementDirective,
    NdlDragPreviewComponent,
    ActionHistoryComponent,
    EmptyPanePickerComponent,
    NdlDragPreviewContainerComponent,
    CommonModule,
  ],
  providers: [
    provideNdlLayout(),
    {
      provide: NDL_LABELS,
      useValue: {
        ...defaultNdlLabels,
        closeTabTooltip: 'Fermer',
      } satisfies NdlLabels,
    },
  ],
  templateUrl: './app.component.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly defaultLayout: Layout = {
    root: {
      type: 'row',
      children: [
        {
          type: 'pane',
          size: 50,
          header: {
            type: 'header',
            tabs: [
              {
                type: 'tab',
                title: 'Counter',
                isActive: true,
                component: { id: 'counter' },
              },
            ],
          },
        },
        {
          type: 'pane',
          size: 50,
          header: {
            type: 'header',
            tabs: [
              {
                type: 'tab',
                title: 'Notes',
                isActive: true,
                component: { id: 'notes' },
              },
              {
                type: 'tab',
                title: 'Context',
                component: { id: 'context' },
              },
            ],
          },
        },
      ],
    },
  };

  readonly layoutManager = NdlLayoutManager.init({
    layout: this.getStorageConfig(this.defaultLayout),
    components: {
      counter: () => import('./panes/counter.component').then((m) => m.CounterComponent),
      notes: () => import('./panes/notes.component').then((m) => m.NotesComponent),
      context: () => import('./panes/context.component').then((m) => m.ContextComponent),
    },
  });

  readonly theme = signal<'light' | 'dark' | 'abyss' | 'custom'>(
    (localStorage.getItem('theme') as Theme | undefined) ?? 'light',
  );
  readonly builtinThemes = ['light', 'dark', 'abyss'] as const;
  readonly useCustomDragPreview = signal(false);
  readonly pendingAddTabHeader = signal<StrictHeader | undefined>(undefined);
  readonly pendingAddHeaderPane = signal<StrictPane | undefined>(undefined);

  readonly panelItems: PanelItem[] = [
    {
      id: 'di-counter',
      label: 'Counter',
      color: '#007acc',
      initials: 'C',
      tab: { title: 'Counter', component: { id: 'counter' } },
    },
    {
      id: 'di-notes',
      label: 'Notes',
      color: '#4ec9b0',
      initials: 'N',
      tab: { title: 'Notes', component: { id: 'notes' } },
    },
    {
      id: 'di-context',
      label: 'Context',
      color: '#c586c0',
      initials: 'Ctx',
      tab: { title: 'Context', component: { id: 'context' } },
    },
  ];

  constructor() {
    effect(() => {
      const theme = this.theme();
      localStorage.setItem('theme', theme);
      document.body.classList.remove('dark', 'abyss', 'custom');
      if (theme !== 'light') document.body.classList.add(theme);
    });
    effect(() => {
      const config = this.layoutManager.config();
      localStorage.setItem('ndl-layout', JSON.stringify(config));
    });
  }

  @HostListener('window:keyup', ['$event']) onKeyEvent(event: KeyboardEvent): void {
    const isCtrl = event.ctrlKey;
    if (isCtrl && event.key === 'z') this.layoutManager.backConfig();
    if (isCtrl && event.key === 'y') this.layoutManager.nextConfig();
  }

  getStorageConfig(defaultConfig: Layout): Layout {
    const raw = localStorage.getItem('ndl-layout');
    return raw ? JSON.parse(raw) : defaultConfig;
  }

  onReset(): void {
    this.layoutManager.setConfig(this.defaultLayout);
    localStorage.removeItem('ndl-layout');
  }

  setTheme(t: 'light' | 'dark' | 'abyss' | 'custom'): void {
    this.theme.set(t);
  }

  onPickHeader(item: PanelItem): void {
    const pane = this.pendingAddHeaderPane();
    if (!pane) return;
    this.layoutManager.addHeader(pane.id, { tabs: [item.tab] });
    this.pendingAddHeaderPane.set(undefined);
  }

  onPickTab(item: PanelItem): void {
    const header = this.pendingAddTabHeader();
    if (!header) return;
    this.layoutManager.addTab(header.id, item.tab);
    this.pendingAddTabHeader.set(undefined);
  }

  getPanelItem(tab: { component?: { id: string } }): PanelItem | undefined {
    return this.panelItems.find((item) => item.tab.component?.id === tab.component?.id);
  }
}
