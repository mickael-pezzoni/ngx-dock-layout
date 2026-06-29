import { describe, it, expect, beforeEach } from 'vitest';
import { NdlLayoutManager } from './ndl-layout-manager';
import type { Layout } from './public-type';
import type { StrictHeader, StrictPane, StrictRow } from './model';

const baseLayout: Layout = {
  root: {
    type: 'row',
    children: [
      {
        type: 'pane',
        id: 'pane-1',
        header: {
          id: 'header-1',
          type: 'header',
          tabs: [
            { id: 'tab-1', title: 'Tab 1', type: 'tab' },
            { id: 'tab-2', title: 'Tab 2', type: 'tab' },
          ],
        },
      },
    ],
  },
};

function getHeader(manager: NdlLayoutManager, headerId = 'header-1'): StrictHeader {
  const item = manager.findItemByIdOrFail(headerId);
  if (item.type !== 'header') throw new Error('not a header');
  return item;
}

describe('NdlLayoutManager', () => {
  let manager: NdlLayoutManager;

  beforeEach(() => {
    manager = NdlLayoutManager.init({ layout: baseLayout, components: {} });
  });

  it('initializes config with ids and defaults', () => {
    const root = manager.config().root;
    expect(root.type).toBe('row');
    const pane = root.children[0] as StrictPane;
    expect(pane.type).toBe('pane');
    expect(pane.header?.tabs).toHaveLength(2);
  });

  describe('activeTab', () => {
    it('activates the correct tab and deactivates the others', () => {
      manager.activeTab('header-1', 'tab-2');
      const header = getHeader(manager);
      expect(header.tabs.find((t) => t.id === 'tab-2')?.isActive).toBe(true);
      expect(header.tabs.find((t) => t.id === 'tab-1')?.isActive).toBe(false);
    });
  });

  describe('closeTab', () => {
    it('removes the targeted tab', () => {
      manager.closeTab('header-1', 'tab-1');
      const header = getHeader(manager);
      expect(header.tabs).toHaveLength(1);
      expect(header.tabs[0].id).toBe('tab-2');
    });
  });

  describe('addTab', () => {
    it('appends a tab at the end of the header', () => {
      manager.addTab('header-1', { title: 'Tab 3' });
      const header = getHeader(manager);
      expect(header.tabs).toHaveLength(3);
      expect(header.tabs.at(-1)?.title).toBe('Tab 3');
    });

    it('inserts a tab at a specific index', () => {
      manager.addTab('header-1', { title: 'Tab 0' }, 0);
      const header = getHeader(manager);
      expect(header.tabs[0].title).toBe('Tab 0');
    });
  });

  describe('undo / redo', () => {
    it('backConfig undoes the last action', () => {
      manager.closeTab('header-1', 'tab-1');
      manager.backConfig();
      const header = getHeader(manager);
      expect(header.tabs).toHaveLength(2);
    });

    it('nextConfig replays the undone action', () => {
      manager.closeTab('header-1', 'tab-1');
      manager.backConfig();
      manager.nextConfig();
      const header = getHeader(manager);
      expect(header.tabs).toHaveLength(1);
    });

    it('backConfig with no history does not change config', () => {
      const before = manager.config();
      manager.backConfig();
      expect(manager.config()).toBe(before);
    });
  });

  describe('setConfig', () => {
    it('replaces config and clears history', () => {
      manager.closeTab('header-1', 'tab-1');
      manager.setConfig(baseLayout);
      const header = getHeader(manager);
      expect(header.tabs).toHaveLength(2);
      manager.backConfig();
      expect(header.tabs).toHaveLength(2);
    });
  });

  describe('closePane', () => {
    it('removes the pane from the tree', () => {
      manager.closePane('pane-1');
      expect(() => manager.findItemByIdOrFail('pane-1')).toThrow();
    });
  });

  describe('renameTab', () => {
    it('updates the title of the specified tab', () => {
      manager.renameTab('header-1', 'tab-1', 'Renamed');
      expect(getHeader(manager).tabs.find((t) => t.id === 'tab-1')?.title).toBe('Renamed');
    });
  });

  describe('editTab', () => {
    it('applies partial changes to the specified tab', () => {
      manager.editTab('header-1', 'tab-1', { title: 'Edited', isClosable: false });
      const tab = getHeader(manager).tabs.find((t) => t.id === 'tab-1');
      expect(tab?.title).toBe('Edited');
      expect(tab?.isClosable).toBe(false);
    });
  });

  describe('addHeader', () => {
    it('adds a header to an empty pane', () => {
      const mgr = NdlLayoutManager.init({
        layout: { root: { type: 'row', children: [{ type: 'pane', id: 'empty-pane' }] } },
        components: {},
      });
      mgr.addHeader('empty-pane', { tabs: [{ title: 'Tab A' }] });
      const pane = mgr.findItemByIdOrFail('empty-pane') as StrictPane;
      expect(pane.header?.tabs).toHaveLength(1);
      expect(pane.header?.tabs[0].title).toBe('Tab A');
    });
  });

  describe('setSizes', () => {
    it('updates sizes on children of the target container', () => {
      const rootId = manager.config().root.id;
      manager.setSizes(rootId, [100]);
      const root = manager.config().root as StrictRow;
      expect(root.children[0]).toMatchObject({ size: 100 });
    });
  });

  describe('createAction / dispatch', () => {
    it('applies a custom operation and records it in history', () => {
      manager.dispatch(
        manager.createAction('custom').operation((layout) => ({
          ...layout,
          root: { ...layout.root, id: 'custom-root' },
        })),
      );
      expect(manager.config().root.id).toBe('custom-root');
      manager.backConfig();
      expect(manager.config().root.id).not.toBe('custom-root');
    });
  });

  describe('split', () => {
    it('replaces the pane with a container holding the original and a new pane', () => {
      const rootId = manager.config().root.id;
      manager.split(rootId, 'pane-1', 'row', 1);
      const newPanes = manager.findItem((i) => i.type === 'pane' && i.id !== 'pane-1');
      expect(newPanes).toBeDefined();
    });
  });
});
