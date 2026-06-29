import { Components, Header, Pane, Row, Column, Settings, Tab } from '../public-type';
import {
  StrictHeader,
  StrictPane,
  StrictRow,
  StrictColumn,
  StrictSettings,
  StrictTab,
} from '../model';
import { setActiveTab } from './layout.utils';

export function transformTabToStrictTab<T extends PropertyKey>(
  tab: Tab,
  components: Components<T>,
  settings?: Settings,
): StrictTab {
  const component = Object.entries(components).find(
    ([id]) => id === tab.component?.id,
  )?.[1] as Components<T>[T];
  const transformedItem = {
    ...tab,
    id: tab.id ?? crypto.randomUUID(),
    isClosable: tab.isClosable ?? settings?.panes?.headers?.tabs?.isClosable ?? true,
    isDraggable: tab.isDraggable ?? settings?.panes?.headers?.tabs?.isDraggable ?? true,
    isEditable: tab.isEditable ?? settings?.panes?.headers?.tabs?.isEditable ?? false,
  };
  return {
    ...transformedItem,
    component: tab.component && {
      load: () => component(),
      ...tab.component,
    },
    mustBeLoaded: tab.isActive ?? false,
  };
}

export function transformSettingsToStrictSettings(settings: Settings): StrictSettings {
  return settings;
}

export function transformHeaderToStrictHeader<T extends PropertyKey>(
  header: Header,
  components: Components<T>,
  settings?: Settings,
): StrictHeader {
  const activatedTabs = setActiveTab(header.tabs);
  return {
    ...header,
    id: header.id ?? crypto.randomUUID(),
    isVisible: header.isVisible ?? settings?.panes?.headers?.isVisible ?? true,
    canAddTab: header.canAddTab ?? settings?.panes?.headers?.canAddTab ?? false,
    tabs: activatedTabs.map((tab) => transformTabToStrictTab(tab, components, settings)),
  };
}

export function transformPaneToStrictPane<T extends PropertyKey>(
  pane: Pane,
  components: Components<T>,
  settings?: Settings,
): StrictPane {
  return {
    ...pane,
    id: pane.id ?? crypto.randomUUID(),
    header: pane.header
      ? transformHeaderToStrictHeader(pane.header, components, settings)
      : undefined,
    isSplittable: pane.isSplittable ?? settings?.panes?.isSplittable ?? true,
    canAddTab: pane.canAddTab ?? settings?.panes?.canAddTab ?? false,
    isClosable: pane.isClosable ?? settings?.panes?.isClosable ?? true,
  };
}

export function transformItemToStrictItem<T extends PropertyKey>(
  item: Row | Column,
  components: Components<T>,
  settings?: Settings,
): StrictRow | StrictColumn {
  const transformedItem = { ...item, id: item.id ?? crypto.randomUUID() };
  return {
    ...transformedItem,
    children: transformedItem.children.map((child) =>
      child.type === 'pane'
        ? transformPaneToStrictPane(child, components, settings)
        : transformItemToStrictItem(child, components, settings),
    ),
  };
}
