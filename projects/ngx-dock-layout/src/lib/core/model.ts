import { Type } from '@angular/core';
import { SplitAreaSize } from 'angular-split';

export type StrictTabComponent = {
  load: () => Promise<Type<unknown>>;
  id: string;
  inputs?: Record<string, unknown>;
};

export type StrictTab = {
  id: string;
  type: 'tab';
  title: string;
  isActive?: boolean;
  mustBeLoaded: boolean;
  isClosable: boolean;
  isDraggable: boolean;
  isEditable: boolean;
  component?: StrictTabComponent;
};
export type StrictHeader = {
  id: string;
  type: 'header';
  isVisible?: boolean;
  canAddTab: boolean;
  tabs: StrictTab[];
};
export type StrictPane = {
  id: string;
  type: 'pane';
  size?: SplitAreaSize;
  header?: StrictHeader;
  isSplittable: boolean;
  canAddTab: boolean;
  isClosable: boolean;
};

export type StrictRow = {
  id: string;
  type: 'row';
  size?: SplitAreaSize;
  children: (StrictRow | StrictColumn | StrictPane)[];
};

export type StrictColumn = {
  id: string;
  type: 'column';
  size?: SplitAreaSize;
  children: (StrictRow | StrictColumn | StrictPane)[];
};

// Type
export type StrictItem = StrictRow | StrictColumn | StrictPane | StrictHeader | StrictTab;

export type StrictTabSettings = {
  /**
   * Whether tabs display a close button.
   *
   * @default true
   *
   * Acts as the default behavior for all tabs.
   * Individual tabs can override this using `Tab.isClosable`.
   */
  isClosable?: boolean;
  /**
   * Whether tabs can be dragged.
   *
   * @default true
   *
   * Acts as the default behavior for all tabs.
   * Individual tabs can override this using `Tab.isDraggable`.
   */
  isDraggable?: boolean;
  /**
   * Whether tabs display an edit button.
   *
   * @default false
   *
   * Acts as the default behavior for all tabs.
   * Individual tabs can override this using `Tab.isEditable`.
   */
  isEditable?: boolean;
};

export type StrictPaneSettings = {
  /**
   * Whether panes can be split.
   *
   * @default true
   *
   * Acts as the default for all panes.
   * Individual panes can override this using `Pane.isSplittable`.
   */
  isSplittable?: boolean;
  /**
   * Whether panes display an add-tab button when the pane is empty.
   *
   * @default false
   *
   * Acts as the default for all panes.
   * Individual panes can override this using `Pane.canAddTab`.
   *
   * When `true`, listen to the `(addHeader)` output on `<ngx-dock-layout>`
   * to handle the click and add a header/tab to the pane.
   */
  canAddTab?: boolean;
  /**
   * Whether panes display a close button.
   *
   * @default true
   *
   * Acts as the default for all panes.
   * Individual panes can override this using `Pane.isClosable`.
   */
  isClosable?: boolean;

  headers?: StrictHeaderSettings;
};
export type StrictHeaderSettings = {
  /**
   * Whether the header is visible.
   * @default true
   *  Acts as the default behavior for all headers.
   * Individual headers can override this using `Header.isVisible`.
   */
  isVisible?: boolean;

  /**
   * Whether headers display an add-tab button.
   *
   * @default false
   *
   * Acts as the default for all headers.
   * Individual headers can override this using `Header.canAddTab`.
   *
   * When `true`, listen to the `(addTab)` output on `<ngx-dock-layout>`
   * to handle the click and add a tab to the header.
   */
  canAddTab?: boolean;

  tabs?: StrictTabSettings;
};

export type StrictSettings = {
  panes?: StrictPaneSettings;
};
export interface StrictLayout {
  root: StrictRow | StrictColumn;
  settings?: StrictSettings;
}

export interface DragTabData {
  type: 'tab';
  tab: StrictTab;
  pane?: StrictPane;
  target?: {
    headerId?: string;
    position: 'center' | 'left' | 'right' | 'top' | 'bottom';
  };
}
export interface DragTabDataCenter extends DragTabData {
  target?: {
    headerId?: string;
    tabPosition: 'before' | 'after';
    position: 'center';
    tabIndex: number;
  };
}

export interface DragTabDataSide extends DragTabData {
  target?: {
    headerId?: string;
    position: 'left' | 'right' | 'top' | 'bottom';
  };
}
