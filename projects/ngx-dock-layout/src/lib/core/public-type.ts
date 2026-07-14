import { Type } from '@angular/core';
import {
  StrictColumn,
  StrictHeader,
  StrictPane,
  StrictRow,
  StrictSettings,
  StrictTab,
  StrictTabComponent,
} from './model';

export type Tab = Omit<
  StrictTab,
  'mustBeLoaded' | 'id' | 'component' | 'isClosable' | 'isDraggable' | 'isEditable'
> & {
  id?: string;
  isClosable?: boolean;
  isDraggable?: boolean;
  isEditable?: boolean;
  component?: TabComponent;
};
export type Header = Omit<
  StrictHeader,
  'id' | 'tabs' | 'canAddTab' | 'isVisible' | 'isMaximizable'
> & {
  id?: string;
  canAddTab?: boolean;
  isVisible?: boolean;
  isMaximizable?: boolean;
  tabs: Tab[];
};
export type Pane = Omit<
  StrictPane,
  'id' | 'header' | 'isSplittable' | 'canAddTab' | 'isClosable' | 'isMaximized'
> & {
  id?: string;
  header?: Header;
  isSplittable?: boolean;
  isMaximized?: boolean;
  canAddTab?: boolean;
  isClosable?: boolean;
};
export type Row = Omit<StrictRow, 'id' | 'children'> & {
  id?: string;
  children: (Row | Column | Pane)[];
};
export type Column = Omit<StrictColumn, 'id' | 'children'> & {
  id?: string;
  children: (Row | Column | Pane)[];
};
export type Item = Row | Column | Pane;

export type Settings = StrictSettings;
export type Layout = {
  root: Row | Column;
  settings?: Settings;
};
export type TabComponent = Omit<StrictTabComponent, 'load'>;

export type Components<T extends PropertyKey> = Record<T, () => Promise<Type<unknown>>>;
export interface InitConfig<T extends PropertyKey> {
  layout: Layout;
  components: Components<T>;
  maxHistorySize?: number;
}

export type NewTab = Omit<Tab, 'type'> & {
  id?: string;
};

export type NewHeader = Omit<Header, 'tabs' | 'type'> & {
  tabs?: NewTab[];
};

export interface NdlLabels {
  allTabsTooltip: string;
  newTabTooltip: string;
  newTabDefaultTitle: string;
  editTabTooltip: string;
  splitColumnTooltip: string;
  splitRowTooltip: string;
  closePaneTooltip: string;
  closeTabTooltip: string;
  // TODO(2.0): consider making required — kept optional so 1.x consumers with a
  // full custom NdlLabels object don't break; header.component.ts falls back to defaultNdlLabels.
  expandPaneTooltip?: string;
  collapsePaneTooltip?: string;
}
export type TabContext = {
  tabId: string;
  headerId: string;
  paneId: string;
};
