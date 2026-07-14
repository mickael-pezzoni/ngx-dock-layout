import { computed, linkedSignal, signal, Signal, WritableSignal } from '@angular/core';
import { SplitAreaSize } from 'angular-split';
import { Components, InitConfig, Layout, NewHeader, NewTab, Pane } from './public-type';
import {
  StrictColumn,
  StrictHeader,
  StrictItem,
  StrictLayout,
  StrictPane,
  StrictRow,
  StrictSettings,
  StrictTab,
} from './model';
import {
  activateTab,
  applySizes,
  editTab,
  everyItem,
  findItem,
  findItemByIdOrFail,
  findParentItem,
  insertHeader,
  insertTab,
  maximizePane,
  removePane,
  removeTab,
  restorePane,
  splitPane,
} from './utils/layout.utils';
import {
  transformHeaderToStrictHeader,
  transformPaneToStrictPane,
  transformRootToStrictRoot,
  transformTabToStrictTab,
} from './utils/to-strict.utils';
import { Action, LayoutActionType } from './action';
import { ActionHistory } from './action-history';

export class NdlLayoutManager<T extends PropertyKey = string> {
  readonly #history: ActionHistory;
  readonly config!: WritableSignal<StrictLayout>;
  readonly components!: Components<T>;
  readonly settings: Signal<StrictSettings | undefined>;
  readonly actions: ActionHistory['actions'];
  readonly currentActionId: ActionHistory['currentActionId'];
  readonly maximizedPane: Signal<
    { pane: StrictPane; parent: StrictRow | StrictColumn } | undefined
  >;

  private constructor(config: Layout, components: Components<T>, maxHistorySize?: number) {
    this.#history = new ActionHistory(maxHistorySize);
    this.actions = this.#history.actions;
    this.currentActionId = this.#history.currentActionId;
    this.components = components;

    const strictLayout = transformRootToStrictRoot(config, components);
    this.config = signal(strictLayout);
    this.settings = linkedSignal(() => this.config().settings);
    this.maximizedPane = computed(() => {
      const root = this.config().root;
      const pane = findItem((item) => item.type === 'pane' && item.isMaximized, root) as
        | StrictPane
        | undefined;
      if (!pane) return undefined;
      return {
        pane,
        parent: findParentItem(root, ({ id }) => id === pane.id) as StrictRow | StrictColumn,
      };
    });
  }

  setConfig(config: Layout) {
    const strictLayout = transformRootToStrictRoot(config, this.components);
    this.#history.clear();
    this.config.set(strictLayout);
  }

  backConfig(): void {
    const layout = this.#history.back();
    if (layout) this.config.set(layout);
  }

  nextConfig(): void {
    const layout = this.#history.next();
    if (layout) this.config.set(layout);
  }

  dispatch(action: Action): void {
    this.config.set(this.#history.dispatch(action));
  }

  createAction(name: string): Action {
    return new Action({ action: name, strictLayout: this.config() });
  }

  static init<T extends PropertyKey>({ layout, components, maxHistorySize }: InitConfig<T>) {
    return new NdlLayoutManager<T>(layout, components, maxHistorySize);
  }

  findItem(
    predicate: (item: StrictItem) => boolean,
    item: StrictItem = this.config().root,
  ): StrictItem | undefined {
    return findItem(predicate, item);
  }

  everyItem(
    predicate: (item: StrictItem) => boolean,
    item: StrictItem = this.config().root,
  ): boolean {
    return everyItem(predicate, item);
  }

  findItemByIdOrFail(id: string, item: StrictItem = this.config().root): StrictItem {
    return findItemByIdOrFail(id, item);
  }

  setSizes(parentId: string, size: SplitAreaSize[]): void {
    const item = this.findItem((item) => item.id === parentId);
    if (item?.type !== 'row' && item?.type !== 'column') return;
    this.dispatch(
      this.createAction(LayoutActionType.Resize).operation((layout) => ({
        ...layout,
        root: applySizes(layout.root, parentId, size),
      })),
    );
  }

  maximizePane(paneId: string): void {
    this.dispatch(
      this.createAction(LayoutActionType.MaximizePane).operation((layout) => ({
        ...layout,
        root: maximizePane(layout.root, paneId),
      })),
    );
  }
  restorePane(paneId: string): void {
    this.dispatch(
      this.createAction(LayoutActionType.RestorePane).operation((layout) => ({
        ...layout,
        root: restorePane(layout.root, paneId),
      })),
    );
  }
  toggleMaximizePane(paneId: string): void {
    if (this.maximizedPane()?.pane.id === paneId) {
      this.restorePane(paneId);
    } else {
      this.maximizePane(paneId);
    }
  }

  split(
    rowOrColumnId: string,
    paneId: string,
    splitType: 'row' | 'column',
    position: 0 | 1,
    pane?: Pane,
  ) {
    const paneToAdd = transformPaneToStrictPane(
      { type: 'pane', ...pane, size: 50 },
      this.components,
      this.settings(),
    );
    this.dispatch(
      this.createAction(LayoutActionType.Split).operation((layout) => ({
        ...layout,
        root: splitPane(layout.root, rowOrColumnId, paneId, splitType, position, paneToAdd),
      })),
    );
  }

  activeTab(headerId: string, tabId: string) {
    this.dispatch(
      this.createAction(LayoutActionType.ActiveTab).operation((layout) => ({
        ...layout,
        root: activateTab(layout.root, headerId, tabId),
      })),
    );
  }

  addTab(headerId: string, newTab: NewTab, index = -1) {
    const newStrictTab = {
      ...transformTabToStrictTab(
        { ...newTab, type: 'tab', isActive: newTab.isActive ?? false },
        this.components,
        this.settings(),
      ),
      mustBeLoaded: newTab.isActive ?? false,
    };
    this.dispatch(
      this.createAction(LayoutActionType.AddTab).operation((layout) => ({
        ...layout,
        root: insertTab(layout.root, headerId, newStrictTab, index),
      })),
    );
  }

  addHeader(paneId: string, newHeader: NewHeader) {
    const strictHeader = transformHeaderToStrictHeader(
      {
        ...newHeader,
        type: 'header',
        tabs: newHeader.tabs?.map((tab) => ({ ...tab, type: 'tab' })) ?? [],
      },
      this.components,
      this.settings(),
    );
    this.dispatch(
      this.createAction(LayoutActionType.AddHeader).operation((layout) => ({
        ...layout,
        root: insertHeader(layout.root, paneId, strictHeader),
      })),
    );
  }

  editTab(headerId: string, tabId: string, changes: Partial<StrictTab>) {
    this.dispatch(
      this.createAction(LayoutActionType.EditTab).operation((layout) => ({
        ...layout,
        root: editTab(layout.root, headerId, tabId, changes),
      })),
    );
  }

  closeTab(headerId: string, tabId: string): void {
    this.dispatch(
      this.createAction(LayoutActionType.CloseTab).operation((layout) => ({
        ...layout,
        root: removeTab(layout.root, headerId, tabId),
      })),
    );
  }

  closePane(paneId: string): void {
    this.dispatch(
      this.createAction(LayoutActionType.ClosePane).operation((layout) => ({
        ...layout,
        root: removePane(layout.root, paneId),
      })),
    );
  }

  renameTab(headerId: string, tabId: string, title: string): void {
    this.dispatch(
      this.createAction(LayoutActionType.RenameTab).operation((layout) => ({
        ...layout,
        root: editTab(layout.root, headerId, tabId, { title }),
      })),
    );
  }

  moveTab(
    source: { tab: StrictTab; headerId?: string; paneId?: string },
    target: { headerId: string; index: number },
  ): void {
    const { tab } = source;
    const action = this.createAction(LayoutActionType.MoveTab);
    if (source.headerId && source.paneId) {
      this.#removeSource(action, tab.id, source.headerId, source.paneId);
    }
    action.operation((layout) => ({
      ...layout,
      root: insertTab(
        layout.root,
        target.headerId,
        { ...tab, mustBeLoaded: tab.isActive ?? false },
        target.index,
      ),
    }));
    this.dispatch(action);
  }

  dropTabToPane(
    source: { tab: StrictTab; headerId?: string; paneId?: string },
    target: {
      paneId: string;
      parentId: string;
      zone: 'top' | 'left' | 'right' | 'bottom' | 'center';
    },
  ): void {
    const { tab } = source;
    const { paneId: targetPaneId, parentId: targetParentId, zone } = target;
    const action = this.createAction(LayoutActionType.DropTabToPane);
    if (source.headerId && source.paneId) {
      this.#removeSource(action, tab.id, source.headerId, source.paneId);
    }
    if (zone !== 'center') {
      const splitType = zone === 'top' || zone === 'bottom' ? 'column' : 'row';
      const position = zone === 'top' || zone === 'left' ? 0 : 1;
      const paneToAdd = transformPaneToStrictPane(
        {
          type: 'pane',
          size: 50,
          header: { type: 'header', tabs: [{ ...tab, type: 'tab' }] },
        },
        this.components,
        this.settings(),
      );
      action.operation((layout) => ({
        ...layout,
        root: splitPane(layout.root, targetParentId, targetPaneId, splitType, position, paneToAdd),
      }));
    } else {
      const targetPane = this.findItem((i) => i.id === targetPaneId);
      if (targetPane?.type !== 'pane') return;
      const header = targetPane.header;
      if (header && header.tabs.length > 0) {
        action.operation((layout) => ({
          ...layout,
          root: insertTab(
            layout.root,
            header.id,
            { ...tab, mustBeLoaded: tab.isActive ?? false },
            -1,
          ),
        }));
      } else {
        const strictHeader = transformHeaderToStrictHeader(
          { type: 'header', tabs: [{ ...tab, type: 'tab', isActive: true }] },
          this.components,
          this.settings(),
        );
        action.operation((layout) => ({
          ...layout,
          root: insertHeader(layout.root, targetPaneId, strictHeader),
        }));
      }
    }
    this.dispatch(action);
  }

  #removeSource(action: Action, tabId: string, sourceHeaderId: string, sourcePaneId: string): void {
    const sourceHeader = this.findItem((i) => i.id === sourceHeaderId);
    if (!sourceHeader || sourceHeader.type !== 'header') return;
    action.operation((layout) => ({
      ...layout,
      root: removeTab(layout.root, sourceHeaderId, tabId),
    }));
    if ((sourceHeader as StrictHeader).tabs.filter((t) => t.id !== tabId).length === 0) {
      action.operation((layout) => ({
        ...layout,
        root: removePane(layout.root, sourcePaneId),
      }));
    }
  }
}
