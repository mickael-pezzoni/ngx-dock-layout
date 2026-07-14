import { InjectionToken, Signal, TemplateRef } from '@angular/core';
import { NdlLayoutManager } from './ndl-layout-manager';
import { NdlLabels, TabContext } from './public-type';

export const MANAGER = new InjectionToken<Signal<NdlLayoutManager>>('MANAGER');

export const GUTTER_SIZE = new InjectionToken<Signal<number>>('GUTTER_SIZE');

export const NDL_LAYOUT_MANAGER = new InjectionToken<NdlLayoutManager>('NDL_LAYOUT_MANAGER');

export const defaultNdlLabels: NdlLabels = {
  allTabsTooltip: 'All tabs',
  newTabTooltip: 'New tab',
  newTabDefaultTitle: 'New Tab',
  editTabTooltip: 'Edit tab',
  splitColumnTooltip: 'Split column',
  splitRowTooltip: 'Split row',
  closePaneTooltip: 'Close pane',
  closeTabTooltip: 'Close tab',
  collapsePaneTooltip: 'Restore pane',
  expandPaneTooltip: 'Maximize pane',
};

export const NDL_LABELS = new InjectionToken<NdlLabels>('NDL_LABELS', {
  factory: () => defaultNdlLabels,
});
export const NDL_TAB_CONTEXT = new InjectionToken<Signal<TabContext>>('NDL_TAB_CONTEXT');
export const EMPTY_PANE_TEMPLATE = new InjectionToken<Signal<TemplateRef<unknown>>>(
  'EMPTY_PANE_TEMPLATE',
);

export const DRAG_PREVIEW_TEMPLATE = new InjectionToken<Signal<TemplateRef<unknown>>>(
  'DRAG_PREVIEW_TEMPLATE',
);
