/*
 * Public API Surface of ngx-dock-layout
 */

export * from './lib/ndl-layout.providers';
export * from './lib/ndl-layout.component';
export * from './lib/core/public-type';
export * from './lib/core/ndl-layout-manager';
export * from './lib/core/utils/layout.utils';
export * from './lib/core/ndl-draggable-element.directive';
export * from './lib/core/ndl-drag-preview-container.component';
export * from './lib/components/drag-preview/ndl-drag-preview.component';
export * from './lib/pipes/ndl-strict-tab.pipe';
export { Action, LayoutActionType } from './lib/core/action';
export {
  NDL_LABELS,
  NDL_LAYOUT_MANAGER,
  NDL_TAB_CONTEXT,
  defaultNdlLabels,
} from './lib/core/token';
export type {
  StrictLayout,
  StrictRow,
  StrictColumn,
  StrictPane,
  StrictHeader,
  StrictTab,
  StrictItem,
  StrictTabComponent,
} from './lib/core/model';
