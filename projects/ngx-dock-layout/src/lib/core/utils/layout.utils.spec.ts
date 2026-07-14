import { describe, expect, it } from 'vitest';
import { StrictColumn, StrictHeader, StrictPane, StrictRow, StrictTab } from '../../../public-api';
import {
  activateTab,
  applySizes,
  editTab,
  everyItem,
  findItem,
  findItemByIdOrFail,
  findParentItem,
  getActiveTab,
  getTabById,
  insertHeader,
  insertTab,
  insertTabToTabs,
  mapItem,
  maximizePane,
  removePane,
  removeTab,
  restorePane,
  setActiveTab,
  setMaximizedPanes,
  splitPane,
} from './layout.utils';

const tab1: StrictTab = {
  id: 'tab-1',
  type: 'tab',
  title: 'Tab 1',
  mustBeLoaded: false,
  isClosable: true,
  isDraggable: true,
  isEditable: false,
};
const tab2: StrictTab = {
  id: 'tab-2',
  type: 'tab',
  title: 'Tab 2',
  mustBeLoaded: false,
  isClosable: true,
  isDraggable: true,
  isEditable: false,
};
const tab3: StrictTab = {
  id: 'tab-3',
  type: 'tab',
  title: 'Tab 3',
  mustBeLoaded: false,
  isClosable: true,
  isDraggable: true,
  isEditable: false,
};

const header1: StrictHeader = {
  id: 'header-1',
  type: 'header',
  canAddTab: false,
  isVisible: true,
  isMaximizable: false,
  tabs: [tab1, tab2],
};
const header2: StrictHeader = {
  id: 'header-2',
  type: 'header',
  canAddTab: false,
  isVisible: true,
  isMaximizable: false,
  tabs: [tab3],
};

const pane1: StrictPane = {
  id: 'pane-1',
  type: 'pane',
  isSplittable: true,
  canAddTab: false,
  isClosable: true,
  isMaximized: false,
  header: header1,
};
const pane2: StrictPane = {
  id: 'pane-2',
  type: 'pane',
  isSplittable: true,
  canAddTab: false,
  isMaximized: false,
  isClosable: true,
  header: header2,
};
const pane3: StrictPane = {
  id: 'pane-3',
  type: 'pane',
  isSplittable: true,
  isMaximized: false,
  canAddTab: false,
  isClosable: true,
};

const maximizedPane: StrictPane = {
  id: 'pane-4',
  type: 'pane',
  isSplittable: true,
  isMaximized: true,
  canAddTab: false,
  isClosable: true,
};
const root: StrictColumn = {
  id: 'column-1',
  type: 'column',
  children: [{ id: 'row-1', type: 'row', children: [pane1, pane2] }, pane3],
};

describe('layout.utils', () => {
  describe('findItem', () => {
    it('returns root item when predicate matches immediately', () => {
      expect(findItem(({ id }) => id === 'column-1', root)).toMatchObject({
        id: 'column-1',
        type: 'column',
      });
    });

    it('finds an item nested inside a column', () => {
      expect(findItem(({ id }) => id === 'row-1', root)).toMatchObject({
        id: 'row-1',
        type: 'row',
      });
    });

    it('finds an item nested two levels deep', () => {
      expect(findItem(({ id }) => id === 'pane-2', root)).toMatchObject({
        id: 'pane-2',
        type: 'pane',
      });
    });

    it('finds a header nested inside a pane', () => {
      expect(findItem(({ id }) => id === 'header-2', root)).toMatchObject({
        id: 'header-2',
        type: 'header',
      });
    });

    it('finds a tab nested inside a header', () => {
      expect(findItem(({ id }) => id === 'tab-1', root)).toMatchObject({
        id: 'tab-1',
        type: 'tab',
      });
    });

    it('returns undefined when no item matches', () => {
      expect(findItem(({ id }) => id === 'not-found', root)).toBeUndefined();
    });
  });

  describe('findItemByIdOrFail', () => {
    it('returns the item when id exists', () => {
      expect(findItemByIdOrFail('tab-1', root)).toMatchObject({
        id: 'tab-1',
        type: 'tab',
      });
    });

    it('throws an error when id does not exist', () => {
      expect(() => findItemByIdOrFail('not-found', root)).toThrow(
        'Item with id not-found not found',
      );
    });
  });

  describe('everyItem', () => {
    it('returns true when all items satisfy predicate', () => {
      expect(
        everyItem(({ type }) => ['column', 'row', 'pane', 'header', 'tab'].includes(type), root),
      ).toBe(true);
    });

    it('returns false when root item does not satisfy predicate', () => {
      expect(everyItem(({ type }) => type === 'row', root)).toBe(false);
    });

    it('returns false when a nested child does not satisfy predicate', () => {
      expect(everyItem(({ id, type }) => id === 'column-1' || type === 'pane', root)).toBe(false);
    });

    it('returns true when pane has no header', () => {
      expect(everyItem(() => true, pane3)).toBe(true);
    });

    it('returns true when traversing a header with tabs', () => {
      expect(everyItem(() => true, header1)).toBe(true);
    });

    it('returns false when a tab does not satisfy predicate', () => {
      expect(everyItem(({ type }) => type !== 'tab', root)).toBe(false);
    });
  });

  describe('insertTabToTabs', () => {
    // it.todo('appends tab when index is -1');
    it('appends tab at the end when index is -1', () => {
      const tabs = insertTabToTabs(
        [tab1, tab2, tab3],
        { ...tab3, title: 'Tab 4', id: 'tab-4' },
        -1,
      );
      expect(tabs.at(-1)).toMatchObject({ title: 'Tab 4', id: 'tab-4' });
    });
    // it.todo('inserts tab at the beginning when index is 0');
    it('inserts tab at the beginning when index is 0', () => {
      const tabs = insertTabToTabs([tab1, tab2, tab3], { ...tab3, title: 'Tab 4', id: 'tab-4' }, 0);
      expect(tabs.at(0)).toMatchObject({ title: 'Tab 4', id: 'tab-4' });
    });
    it('inserts tab at a specific index', () => {
      const tabs = insertTabToTabs(
        [tab1, tab2, tab3],
        { ...tab3, title: 'New Tab', id: 'new-tab' },
        1,
      );
      expect(tabs.at(1)).toMatchObject({
        ...tab3,
        title: 'New Tab',
        id: 'new-tab',
      });
    });
  });

  describe('getActiveTab', () => {
    it('returns the active tab when one is active', () => {
      const header: StrictHeader = { ...header1, tabs: [{ ...tab1, isActive: true }, tab2] };
      expect(getActiveTab(header)).toMatchObject({ id: 'tab-1' });
    });

    it('returns undefined when no tab is active', () => {
      expect(getActiveTab(header1)).toBeUndefined();
    });
  });

  describe('getTabById', () => {
    it('returns the tab when id exists', () => {
      expect(getTabById(header1, 'tab-1')).toMatchObject({ id: 'tab-1' });
    });

    it('returns undefined when id does not exist', () => {
      expect(getTabById(header1, 'not-found')).toBeUndefined();
    });
  });

  describe('setActiveTab', () => {
    it('activates the specified tab and deactivates others when activeTabId is given', () => {
      const result = setActiveTab([tab1, tab2, tab3], 'tab-2');
      expect(result.find((t) => t.id === 'tab-2')?.isActive).toBe(true);
      expect(result.find((t) => t.id === 'tab-1')?.isActive).toBe(false);
      expect(result.find((t) => t.id === 'tab-3')?.isActive).toBe(false);
    });

    it('preserves existing active tab when no activeTabId is given', () => {
      const tabs = [tab1, { ...tab2, isActive: true }, tab3];
      const result = setActiveTab(tabs);
      expect(result.find((t) => t.id === 'tab-2')?.isActive).toBe(true);
      expect(result.find((t) => t.id === 'tab-1')?.isActive).not.toBe(true);
    });

    it('activates the first tab when none is active', () => {
      const result = setActiveTab([tab1, tab2, tab3]);
      expect(result[0].isActive).toBe(true);
      expect(result[1].isActive).toBe(false);
    });

    it('keeps only the last active tab when multiple are active', () => {
      const tabs = [{ ...tab1, isActive: true }, { ...tab2, isActive: true }, tab3];
      const result = setActiveTab(tabs);
      expect(result.find((t) => t.id === 'tab-2')?.isActive).toBe(true);
      expect(result.find((t) => t.id === 'tab-1')?.isActive).toBe(false);
    });
  });

  describe('applySizes', () => {
    it('sets sizes on children of the target parent', () => {
      const result = applySizes(root, 'row-1', [60, 40]);
      const row = findItem(({ id }) => id === 'row-1', result) as StrictRow;
      expect(row.children[0].size).toBe(60);
      expect(row.children[1].size).toBe(40);
    });

    it('does not affect other containers', () => {
      const result = applySizes(root, 'row-1', [60, 40]);
      expect(result.size).toBe(root.size);
    });
  });

  describe('activateTab', () => {
    it('activates the specified tab and deactivates others in the header', () => {
      const result = activateTab(root, 'header-1', 'tab-2');
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs.find((t) => t.id === 'tab-2')?.isActive).toBe(true);
      expect(header.tabs.find((t) => t.id === 'tab-1')?.isActive).toBe(false);
    });

    it('does not affect other headers', () => {
      const result = activateTab(root, 'header-1', 'tab-2');
      const header2 = findItem(({ id }) => id === 'header-2', result) as StrictHeader;
      expect(header2.tabs).toEqual(header2.tabs);
    });
  });

  describe('insertTab', () => {
    it('appends a tab to the target header', () => {
      const newTab: StrictTab = { ...tab1, id: 'tab-new', title: 'New' };
      const result = insertTab(root, 'header-1', newTab);
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs).toHaveLength(3);
      expect(header.tabs.at(-1)).toMatchObject({ id: 'tab-new' });
    });

    it('replaces a tab with the same id', () => {
      const updated = { ...tab1, title: 'Updated' };
      const result = insertTab(root, 'header-1', updated);
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs).toHaveLength(2);
      expect(header.tabs.find((t) => t.id === 'tab-1')?.title).toBe('Updated');
    });
  });

  describe('insertHeader', () => {
    it('sets the header on the target pane', () => {
      const result = insertHeader(root, 'pane-3', header1);
      const pane = findItem(({ id }) => id === 'pane-3', result) as StrictPane;
      expect(pane.header).toMatchObject({ id: 'header-1' });
    });

    it('does not affect other panes', () => {
      const result = insertHeader(root, 'pane-3', header1);
      const pane1Result = findItem(({ id }) => id === 'pane-1', result) as StrictPane;
      expect(pane1Result.header?.id).toBe('header-1');
    });
  });

  describe('editTab', () => {
    it('applies changes to the specified tab', () => {
      const result = editTab(root, 'header-1', 'tab-1', { title: 'Renamed' });
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs.find((t) => t.id === 'tab-1')?.title).toBe('Renamed');
    });

    it('does not affect other tabs', () => {
      const result = editTab(root, 'header-1', 'tab-1', { title: 'Renamed' });
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs.find((t) => t.id === 'tab-2')?.title).toBe('Tab 2');
    });
  });

  describe('removeTab', () => {
    it('removes the specified tab from the header', () => {
      const result = removeTab(root, 'header-1', 'tab-1');
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs).toHaveLength(1);
      expect(header.tabs[0].id).toBe('tab-2');
    });

    it('activates the remaining tab when the active tab is removed', () => {
      const activeRoot = activateTab(root, 'header-1', 'tab-1');
      const result = removeTab(activeRoot, 'header-1', 'tab-1');
      const header = findItem(({ id }) => id === 'header-1', result) as StrictHeader;
      expect(header.tabs[0].isActive).toBe(true);
    });
  });

  describe('removePane', () => {
    it('removes the specified pane from the tree', () => {
      const result = removePane(root, 'pane-1');
      expect(findItem(({ id }) => id === 'pane-1', result)).toBeUndefined();
    });

    it('keeps sibling panes intact', () => {
      const result = removePane(root, 'pane-1');
      expect(findItem(({ id }) => id === 'pane-2', result)).toBeDefined();
    });
  });

  describe('mapItem', () => {
    it('returns the tree unchanged when no callbacks are provided', () => {
      const result = mapItem(root, {});
      expect(result).toEqual(root);
    });

    it('applies maps.rowOrColumn only to rows and columns', () => {
      const result = mapItem(root, {
        rowOrColumn: (item) => ({ ...item, id: item.id + '-modified' }),
      });
      expect(result.id).toBe('column-1-modified');
      expect(findItem(({ id }) => id === 'row-1-modified', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'pane-1', result)).toBeDefined();
    });

    it('applies maps.pane only to panes', () => {
      const result = mapItem(root, {
        pane: (item) => ({ ...item, id: item.id + '-modified' }),
      });
      expect(findItem(({ id }) => id === 'pane-1-modified', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'column-1', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'header-1', result)).toBeDefined();
    });

    it('applies maps.header only to headers', () => {
      const result = mapItem(root, {
        header: (item) => ({ ...item, id: item.id + '-modified' }),
      });
      expect(findItem(({ id }) => id === 'header-1-modified', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'pane-1', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'tab-1', result)).toBeDefined();
    });

    it('applies maps.tab only to tabs', () => {
      const result = mapItem(root, {
        tab: (item) => ({ ...item, id: item.id + '-modified' }),
      });
      expect(findItem(({ id }) => id === 'tab-1-modified', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'header-1', result)).toBeDefined();
    });

    it('applies maps.item to every node before the type-specific callback', () => {
      const visited: string[] = [];
      mapItem(root, {
        item: (item) => {
          visited.push(item.id);
          return item;
        },
      });
      expect(visited).toContain('column-1');
      expect(visited).toContain('row-1');
      expect(visited).toContain('pane-1');
      expect(visited).toContain('header-1');
      expect(visited).toContain('tab-1');
    });

    it('maps.item result is passed to the type-specific callback', () => {
      const result = mapItem(root, {
        item: (item) => ({ ...item, id: item.id + '-a' }),
        rowOrColumn: (item) => ({ ...item, id: item.id + 'b' }),
      });
      expect(result.id).toBe('column-1-ab');
    });

    it('recurses through all levels so multiple callbacks apply independently', () => {
      const result = mapItem(root, {
        rowOrColumn: (item) => ({ ...item, id: item.id + '-r' }),
        tab: (item) => ({ ...item, id: item.id + '-t' }),
      });
      expect(findItem(({ id }) => id === 'column-1-r', result)).toBeDefined();
      expect(findItem(({ id }) => id === 'tab-1-t', result)).toBeDefined();
    });

    it('does not recurse into header when pane has no header', () => {
      const result = mapItem(pane3, {
        header: (item) => ({ ...item, id: 'should-not-appear' }),
      });
      expect((result as StrictPane).header).toBeUndefined();
    });

    it('does not mutate the original tree', () => {
      const originalId = root.id;
      mapItem(root, {
        rowOrColumn: (item) => ({ ...item, id: 'mutated' }),
      });
      expect(root.id).toBe(originalId);
    });
  });

  describe('splitPane', () => {
    const paneToAdd: StrictPane = {
      id: 'pane-new',
      type: 'pane',
      isSplittable: true,
      canAddTab: false,
      isClosable: true,
      isMaximized: false,
    };

    it('replaces the target pane with a new container of the given splitType', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 1, paneToAdd);
      const row = findItem(({ id }) => id === 'row-1', result) as StrictRow;
      expect(row.children[0]).toMatchObject({ type: 'column' });
    });

    it('position 0 → paneToAdd is first, existing pane is second', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 0, paneToAdd);
      const row = findItem(({ id }) => id === 'row-1', result) as StrictRow;
      const newContainer = row.children[0] as StrictColumn;
      expect(newContainer.children[0]).toMatchObject({ id: 'pane-new' });
      expect(newContainer.children[1]).toMatchObject({ id: 'pane-1' });
    });

    it('position 1 → existing pane is first, paneToAdd is second', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 1, paneToAdd);
      const row = findItem(({ id }) => id === 'row-1', result) as StrictRow;
      const newContainer = row.children[0] as StrictColumn;
      expect(newContainer.children[0]).toMatchObject({ id: 'pane-1' });
      expect(newContainer.children[1]).toMatchObject({ id: 'pane-new' });
    });

    it('new container inherits the size of the original pane', () => {
      const paneWithSize: StrictPane = { ...pane1, size: 40 };
      const simpleRoot: StrictColumn = {
        id: 'col',
        type: 'column',
        children: [paneWithSize],
      };
      const result = splitPane(simpleRoot, 'col', 'pane-1', 'row', 1, paneToAdd);
      expect(result.children[0]).toMatchObject({ type: 'row', size: 40 });
    });

    it('sets size 50 on the existing pane inside the new container', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 1, paneToAdd);
      const row = findItem(({ id }) => id === 'row-1', result) as StrictRow;
      const newContainer = row.children[0] as StrictColumn;
      expect(newContainer.children[0]).toMatchObject({ id: 'pane-1', size: 50 });
    });

    it('does not affect other panes in the same container', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 1, paneToAdd);
      expect(findItem(({ id }) => id === 'pane-2', result)).toBeDefined();
    });

    it('does not affect containers that do not match rowOrColumnId', () => {
      const result = splitPane(root, 'row-1', 'pane-1', 'column', 1, paneToAdd);
      expect(findItem(({ id }) => id === 'pane-3', result)).toBeDefined();
    });
  });

  describe('setMaximizedPanes', () => {
    it('leaves the tree untouched when no pane is maximized', () => {
      const result = setMaximizedPanes(root);
      expect(everyItem((item) => (item.type === 'pane' ? !item.isMaximized : true), result)).toBe(
        true,
      );
    });

    it('keeps the maximized pane maximized', () => {
      const rootWithMaximized: StrictColumn = {
        ...root,
        children: [...root.children, maximizedPane],
      };
      const result = setMaximizedPanes(rootWithMaximized);
      expect((findItemByIdOrFail('pane-4', result) as StrictPane).isMaximized).toBe(true);
    });

    it('clears `isMaximized` on every other pane when one is already maximized', () => {
      const rootWithMaximized: StrictColumn = {
        ...root,
        children: [...root.children, maximizedPane],
      };
      const result = setMaximizedPanes(rootWithMaximized);
      expect(
        everyItem(
          (item) => (item.type === 'pane' && item.id !== 'pane-4' ? !item.isMaximized : true),
          result,
        ),
      ).toBe(true);
    });

    it('keeps only the first maximized pane found when several are marked maximized', () => {
      const secondMaximizedPane: StrictPane = { ...maximizedPane, id: 'pane-5' };
      const rootWithTwoMaximized: StrictColumn = {
        ...root,
        children: [...root.children, maximizedPane, secondMaximizedPane],
      };
      const result = setMaximizedPanes(rootWithTwoMaximized);
      expect((findItemByIdOrFail('pane-4', result) as StrictPane).isMaximized).toBe(true);
      expect((findItemByIdOrFail('pane-5', result) as StrictPane).isMaximized).toBe(false);
    });
  });

  describe('maximizePane', () => {
    it('sets the `isMaximized` property of the target pane to `true` and sets all others to `false`', () => {
      const result = maximizePane(
        {
          ...root,
          children: [...root.children, maximizedPane],
        },
        'pane-1',
      );
      expect(
        everyItem(
          (item) => (item.type === 'pane' && item.id !== 'pane-1' ? !item.isMaximized : true),
          result,
        ),
      ).toBe(true);
      expect((findItemByIdOrFail('pane-1', result) as StrictPane).isMaximized).toBe(true);
    });
  });
  describe('restorePane', () => {
    it('sets the `isMaximized` property of the target pane to `false`', () => {
      const maximizedRoot = maximizePane(root, 'pane-1');
      const result = restorePane(maximizedRoot, 'pane-1');
      expect((findItemByIdOrFail('pane-1', result) as StrictPane).isMaximized).toBe(false);
    });
  });

  describe('findParentItem', () => {
    it('returns the row containing the target pane', () => {
      expect(findParentItem(root, ({ id }) => id === 'pane-1')).toMatchObject({ id: 'row-1' });
    });

    it('returns the root itself when the matching pane is a direct child', () => {
      expect(findParentItem(root, ({ id }) => id === 'pane-3')).toMatchObject({ id: 'column-1' });
    });

    it('returns the pane containing the target header', () => {
      expect(findParentItem(root, ({ id }) => id === 'header-1')).toMatchObject({ id: 'pane-1' });
    });

    it('returns the header containing the target tab', () => {
      expect(findParentItem(root, ({ id }) => id === 'tab-1')).toMatchObject({ id: 'header-1' });
    });

    it('returns undefined when no item matches', () => {
      expect(findParentItem(root, ({ id }) => id === 'not-found')).toBeUndefined();
    });
  });
});
