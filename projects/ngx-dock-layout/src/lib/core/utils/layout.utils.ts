import { SplitAreaSize } from 'angular-split';
import { Tab } from '../public-type';
import { StrictColumn, StrictHeader, StrictItem, StrictPane, StrictRow, StrictTab } from '../model';

/**
 * Recursively searches the layout tree depth-first and returns the first item
 * that satisfies `predicate`, or `undefined` if none is found.
 *
 * @param predicate - Test function called on each node.
 * @param item - Root node to start the search from.
 */
export function findItem(
  predicate: (item: StrictItem) => boolean,
  item: StrictItem,
): StrictItem | undefined {
  if (predicate(item)) return item;
  if (item.type === 'row' || item.type === 'column') {
    for (const child of item.children) {
      const found = findItem(predicate, child);
      if (found) return found;
    }
  }
  if (item.type === 'pane') {
    return item.header ? findItem(predicate, item.header) : undefined;
  }
  if (item.type === 'header') {
    for (const tab of item.tabs) {
      const found = findItem(predicate, tab);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Returns `true` if `predicate` holds for every node in the layout subtree
 * rooted at `item` (depth-first traversal), `false` otherwise.
 *
 * @param predicate - Test function called on each node.
 * @param item - Root node of the subtree to check.
 */
export function everyItem(predicate: (item: StrictItem) => boolean, item: StrictItem): boolean {
  if (!predicate(item)) return false;
  if (item.type === 'row' || item.type === 'column') {
    return item.children.every((child) => everyItem(predicate, child));
  }
  if (item.type === 'pane') {
    return item.header ? everyItem(predicate, item.header) : true;
  }
  if (item.type === 'header') {
    return item.tabs.every((tab) => everyItem(predicate, tab));
  }
  return true;
}

/**
 * Like `findItem` but looks up by `id` and throws if nothing is found.
 *
 * @param id - The `id` of the item to locate.
 * @param item - Root node to start the search from.
 * @throws {Error} When no item with the given `id` exists in the subtree.
 */
export function findItemByIdOrFail(id: string, item: StrictItem): StrictItem {
  const found = findItem((i) => i.id === id, item);
  if (!found) throw new Error(`Item with id ${id} not found`);
  return found;
}

/**
 * Inserts `newTab` into `tabs` at the given index.
 * Pass `-1` to append at the end.
 *
 * @param tabs - The existing tab array (not mutated).
 * @param newTab - The tab to insert.
 * @param indexToAdd - Zero-based insertion index, or `-1` to append.
 */
export function insertTabToTabs(
  tabs: StrictTab[],
  newTab: StrictTab,
  indexToAdd: number,
): StrictTab[] {
  if (indexToAdd === -1) return [...tabs, newTab];
  return [...tabs.slice(0, indexToAdd), newTab, ...tabs.slice(indexToAdd)];
}

/**
 * Returns the currently active tab of a header, or `undefined` if none is active.
 *
 * @param header - The header to inspect.
 */
export function getActiveTab(header: StrictHeader): StrictTab | undefined {
  return header.tabs.find((tab) => tab.isActive);
}

/**
 * Returns the tab matching `tabId` inside a header, or `undefined` if not found.
 *
 * @param header - The header to search in.
 * @param tabId - The `id` of the tab to find.
 */
export function getTabById(header: StrictHeader, tabId: string): StrictTab | undefined {
  return header.tabs.find((tab) => tab.id === tabId);
}

/**
 * Recursively walks the layout tree applying the given callbacks at each node type.
 * Returns a new tree (immutable — original nodes are never mutated).
 *
 * @param item - Root of the subtree to transform.
 * @param maps - Optional per-type callbacks; unmatched nodes are returned as-is.
 */
export function mapItem<T extends StrictItem>(
  item: T,
  maps: {
    rowOrColumn?: (item: StrictRow | StrictColumn) => StrictRow | StrictColumn;
    pane?: (item: StrictPane) => StrictPane;
    header?: (item: StrictHeader) => StrictHeader;
    tab?: (item: StrictTab) => StrictTab;
    item?: (item: StrictItem) => StrictItem;
  },
): T {
  const transformedItem = { ...(maps.item?.(item) ?? item) };
  if (transformedItem.type === 'row' || transformedItem.type === 'column') {
    const transformedRowOrColumn = {
      ...(maps.rowOrColumn?.(transformedItem) ?? transformedItem),
    };
    return {
      ...transformedRowOrColumn,
      children: transformedRowOrColumn.children.map((child) => mapItem(child, maps)),
    } as T;
  }
  if (transformedItem.type === 'pane') {
    const transformedPane = {
      ...(maps.pane?.(transformedItem) ?? transformedItem),
    };
    return {
      ...transformedPane,
      header: transformedPane.header ? mapItem(transformedPane.header, maps) : undefined,
    } as T;
  }
  if (transformedItem.type === 'header') {
    const transformedHeader = {
      ...(maps.header?.(transformedItem) ?? transformedItem),
    };
    return {
      ...transformedHeader,
      tabs: transformedHeader.tabs.map((tab) => mapItem(tab, maps)),
    } as T;
  }
  return { ...(maps.tab?.(transformedItem) ?? transformedItem) } as T;
}

/**
 * Ensures exactly one tab is active in `tabs`.
 * When `activeTabId` is provided, activates that tab and deactivates all others.
 * Otherwise, preserves the existing active tab or falls back to the first tab.
 *
 * @param tabs - The tab array to normalise (not mutated).
 * @param activeTabId - Optional id of the tab to activate.
 */
export function setActiveTab<T extends StrictTab | Tab>(tabs: T[], activeTabId?: string): T[] {
  const activeTabs = tabs.filter((tab) => tab.isActive);
  return tabs.map((tab, index) => {
    const isOtherActiveTab = tabs.slice(index + 1).some(({ isActive }) => isActive);
    if (activeTabId) {
      return { ...tab, isActive: tab.id === activeTabId };
    }
    const shouldActive = activeTabs.length > 0 ? tab.isActive && !isOtherActiveTab : index === 0;
    return {
      ...tab,
      isActive: shouldActive,
      mustBeLoaded: shouldActive,
    };
  });
}

/**
 * Returns a new layout root where the children of the row/column identified by
 * `parentId` have their sizes replaced by `size`.
 */
export function applySizes(
  root: StrictRow | StrictColumn,
  parentId: string,
  size: SplitAreaSize[],
): StrictRow | StrictColumn {
  return mapItem(root, {
    rowOrColumn: (item) => {
      if (item.id !== parentId) return item;
      return {
        ...item,
        children: item.children.map((child, i) => ({
          ...child,
          size: size[i],
        })),
      };
    },
  });
}

/**
 * Returns a new layout root where the tab `tabId` in header `headerId` is active
 * and all sibling tabs are deactivated.
 */
export function activateTab(
  root: StrictRow | StrictColumn,
  headerId: string,
  tabId: string,
): StrictRow | StrictColumn {
  return mapItem(root, {
    header: (item) => {
      if (item.id !== headerId) return item;
      return {
        ...item,
        tabs: item.tabs.map((tab) => ({
          ...tab,
          isActive: tab.id === tabId,
          mustBeLoaded: tab.mustBeLoaded || tab.id === tabId,
        })),
      };
    },
  });
}

/**
 * Returns a new layout root where `newTab` has been inserted at `index`
 * (or appended when `index` is `-1`) inside header `headerId`.
 * If a tab with the same id already exists it is removed before insertion.
 */
export function insertTab(
  root: StrictRow | StrictColumn,
  headerId: string,
  newTab: StrictTab,
  index = -1,
): StrictRow | StrictColumn {
  return mapItem(root, {
    header: (item): StrictHeader => {
      if (item.id !== headerId) return item;
      const filteredTabs = item.tabs.filter(({ id }) => id !== newTab.id);
      return {
        ...item,
        tabs: setActiveTab(
          insertTabToTabs(filteredTabs, newTab, index),
          newTab.isActive ? newTab.id : undefined,
        ),
      };
    },
  });
}

/**
 * Returns a new layout root where the pane identified by `paneId` now has
 * `newHeader` as its header.
 */
export function insertHeader(
  root: StrictRow | StrictColumn,
  paneId: string,
  newHeader: StrictHeader,
): StrictRow | StrictColumn {
  return mapItem(root, {
    pane: (pane): StrictPane => (pane.id === paneId ? { ...pane, header: newHeader } : pane),
  });
}

/**
 * Returns a new layout root where the tab `tabId` in header `headerId`
 * has been merged with `changes`.
 */
export function editTab(
  root: StrictRow | StrictColumn,
  headerId: string,
  tabId: string,
  changes: Partial<StrictTab>,
): StrictRow | StrictColumn {
  return mapItem(root, {
    header: (item): StrictHeader => {
      if (item.id !== headerId) return item;
      return {
        ...item,
        tabs: item.tabs.map((tab) => (tab.id === tabId ? { ...tab, ...changes } : tab)),
      };
    },
  });
}

/**
 * Returns a new layout root where the tab `tabId` has been removed from
 * header `headerId` and the remaining tabs have their active state normalised.
 */
export function removeTab(
  root: StrictRow | StrictColumn,
  headerId: string,
  tabId: string,
): StrictRow | StrictColumn {
  return mapItem(root, {
    header: (item): StrictHeader => {
      if (item.id !== headerId) return item;
      return {
        ...item,
        tabs: setActiveTab(item.tabs.filter((tab) => tab.id !== tabId)),
      };
    },
  });
}

/**
 * Returns a new layout root where the pane `paneId` has been removed.
 * Row/column containers that become empty after removal are also pruned.
 */
export function removePane(
  root: StrictRow | StrictColumn,
  paneId: string,
): StrictRow | StrictColumn {
  const excludePane = <T extends StrictItem>(item: T): T =>
    mapItem(item, {
      rowOrColumn: (rc) => ({
        ...rc,
        children: rc.children.filter((child) => child.id !== paneId),
      }),
    });

  return mapItem(root, {
    rowOrColumn: (item): StrictRow | StrictColumn => {
      const itemWithoutPane = excludePane(item);
      return {
        ...itemWithoutPane,
        children: itemWithoutPane.children.filter(
          (child) => !everyItem((_item) => _item.type === 'row' || _item.type === 'column', child),
        ),
      };
    },
  });
}

/**
 * Returns a new layout root where the pane `paneId` (inside row/column
 * `rowOrColumnId`) has been replaced by a new `splitType` container holding
 * the original pane and `paneToAdd` at the given `position`.
 */
export function splitPane(
  root: StrictRow | StrictColumn,
  rowOrColumnId: string,
  paneId: string,
  splitType: 'row' | 'column',
  position: 0 | 1,
  paneToAdd: StrictPane,
): StrictRow | StrictColumn {
  return mapItem(root, {
    rowOrColumn: (item) => {
      if (item.id !== rowOrColumnId) return item;
      return {
        ...item,
        children: item.children.map((child) => {
          if (child.type !== 'pane' || child.id !== paneId) return child;
          const newContainer = {
            id: crypto.randomUUID(),
            type: splitType,
            size: child.size,
          } satisfies Partial<StrictRow | StrictColumn>;
          const children =
            position === 0
              ? [paneToAdd, { ...child, size: 50 }]
              : [{ ...child, size: 50 }, paneToAdd];
          return { ...newContainer, children };
        }),
      };
    },
  });
}
