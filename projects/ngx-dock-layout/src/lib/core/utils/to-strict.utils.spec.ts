import { describe, it, expect } from 'vitest';
import {
  transformTabToStrictTab,
  transformHeaderToStrictHeader,
  transformPaneToStrictPane,
  transformItemToStrictItem,
  transformRootToStrictRoot,
} from './to-strict.utils';
import type { Header, Layout, Pane, Row, Settings, Tab } from '../public-type';
import type { StrictPane, StrictRow } from '../model';

const components = {};

describe('to-strict.utils', () => {
  describe('transformTabToStrictTab', () => {
    it('assigns a UUID when no id is provided', () => {
      const tab: Tab = { type: 'tab', title: 'T' };
      expect(transformTabToStrictTab(tab, components).id).toMatch(/.+/);
    });

    it('preserves the id when provided', () => {
      const tab: Tab = { id: 'tab-1', type: 'tab', title: 'T' };
      expect(transformTabToStrictTab(tab, components).id).toBe('tab-1');
    });

    it('defaults isClosable and isDraggable to true', () => {
      const tab: Tab = { type: 'tab', title: 'T' };
      const result = transformTabToStrictTab(tab, components);
      expect(result.isClosable).toBe(true);
      expect(result.isDraggable).toBe(true);
    });

    it('defaults isEditable to false', () => {
      const tab: Tab = { type: 'tab', title: 'T' };
      expect(transformTabToStrictTab(tab, components).isEditable).toBe(false);
    });

    it('uses flag values from settings when not set on tab', () => {
      const tab: Tab = { type: 'tab', title: 'T' };
      const settings: Settings = {
        panes: { headers: { tabs: { isClosable: false, isDraggable: false, isEditable: true } } },
      };
      const result = transformTabToStrictTab(tab, components, settings);
      expect(result.isClosable).toBe(false);
      expect(result.isDraggable).toBe(false);
      expect(result.isEditable).toBe(true);
    });

    it('tab flag values take precedence over settings', () => {
      const tab: Tab = {
        type: 'tab',
        title: 'T',
        isClosable: true,
        isDraggable: true,
        isEditable: false,
      };
      const settings: Settings = {
        panes: { headers: { tabs: { isClosable: false, isDraggable: false, isEditable: true } } },
      };
      const result = transformTabToStrictTab(tab, components, settings);
      expect(result.isClosable).toBe(true);
      expect(result.isDraggable).toBe(true);
      expect(result.isEditable).toBe(false);
    });

    it('sets mustBeLoaded to false when isActive is not set', () => {
      const tab: Tab = { type: 'tab', title: 'T' };
      expect(transformTabToStrictTab(tab, components).mustBeLoaded).toBe(false);
    });

    it('sets mustBeLoaded to true when isActive is true', () => {
      const tab: Tab = { type: 'tab', title: 'T', isActive: true };
      expect(transformTabToStrictTab(tab, components).mustBeLoaded).toBe(true);
    });
  });

  describe('transformHeaderToStrictHeader', () => {
    it('assigns a UUID when no id is provided', () => {
      const header: Header = { type: 'header', tabs: [] };
      expect(transformHeaderToStrictHeader(header, components).id).toMatch(/.+/);
    });

    it('preserves the id when provided', () => {
      const header: Header = { id: 'h-1', type: 'header', tabs: [] };
      expect(transformHeaderToStrictHeader(header, components).id).toBe('h-1');
    });

    it('defaults canAddTab to false when not provided', () => {
      const header: Header = { type: 'header', tabs: [] };
      expect(transformHeaderToStrictHeader(header, components).canAddTab).toBe(false);
    });

    it('uses settings.panes.headers.canAddTab when header value is not set', () => {
      const header: Header = { type: 'header', tabs: [] };
      const settings: Settings = { panes: { headers: { canAddTab: true } } };
      expect(transformHeaderToStrictHeader(header, components, settings).canAddTab).toBe(true);
    });

    it('lets Header.canAddTab override settings', () => {
      const settings: Settings = { panes: { headers: { canAddTab: true } } };
      const headerWithFlag: Header = { type: 'header', canAddTab: false, tabs: [] };
      expect(transformHeaderToStrictHeader(headerWithFlag, components, settings).canAddTab).toBe(
        false,
      );
    });

    it('defaults isMaximizable to true when not provided', () => {
      const header: Header = { type: 'header', tabs: [] };
      expect(transformHeaderToStrictHeader(header, components).isMaximizable).toBe(true);
    });

    it('uses settings.panes.headers.isMaximizable when header value is not set', () => {
      const header: Header = { type: 'header', tabs: [] };
      const settings: Settings = { panes: { headers: { isMaximizable: false } } };
      expect(transformHeaderToStrictHeader(header, components, settings).isMaximizable).toBe(false);
    });

    it('lets Header.isMaximizable override settings', () => {
      const settings: Settings = { panes: { headers: { isMaximizable: false } } };
      const headerWithFlag: Header = { type: 'header', isMaximizable: true, tabs: [] };
      expect(
        transformHeaderToStrictHeader(headerWithFlag, components, settings).isMaximizable,
      ).toBe(true);
    });

    it('activates the first tab when none is active', () => {
      const header: Header = {
        type: 'header',
        tabs: [
          { type: 'tab', id: 'tab-1', title: 'T1' },
          { type: 'tab', id: 'tab-2', title: 'T2' },
        ],
      };
      const result = transformHeaderToStrictHeader(header, components);
      expect(result.tabs[0].isActive).toBe(true);
      expect(result.tabs[1].isActive).toBe(false);
    });

    it('transforms all tabs', () => {
      const header: Header = {
        type: 'header',
        tabs: [
          { type: 'tab', id: 'tab-1', title: 'T1' },
          { type: 'tab', id: 'tab-2', title: 'T2' },
        ],
      };
      const result = transformHeaderToStrictHeader(header, components);
      expect(result.tabs).toHaveLength(2);
      expect(result.tabs[0]).toMatchObject({ id: 'tab-1', isClosable: true });
    });
  });

  describe('transformPaneToStrictPane', () => {
    it('assigns a UUID when no id is provided', () => {
      const pane: Pane = { type: 'pane' };
      expect(transformPaneToStrictPane(pane, components).id).toMatch(/.+/);
    });

    it('defaults flags, uses settings values, pane values take precedence', () => {
      const pane: Pane = { type: 'pane' };
      const defaults = transformPaneToStrictPane(pane, components);
      expect(defaults.isSplittable).toBe(true);
      expect(defaults.isClosable).toBe(true);

      const settings: Settings = {
        panes: { isSplittable: false, isClosable: false },
      };
      const fromSettings = transformPaneToStrictPane(pane, components, settings);
      expect(fromSettings.isSplittable).toBe(false);
      expect(fromSettings.isClosable).toBe(false);

      const paneWithFlags: Pane = {
        type: 'pane',
        isSplittable: true,
        isClosable: true,
      };
      const fromPane = transformPaneToStrictPane(paneWithFlags, components, settings);
      expect(fromPane.isSplittable).toBe(true);
      expect(fromPane.isClosable).toBe(true);
    });

    it('transforms the header when present', () => {
      const pane: Pane = {
        type: 'pane',
        header: {
          type: 'header',
          tabs: [{ type: 'tab', id: 'tab-1', title: 'T' }],
        },
      };
      const result = transformPaneToStrictPane(pane, components);
      expect(result.header?.tabs).toHaveLength(1);
      expect(result.header?.tabs[0].id).toBe('tab-1');
    });

    it('leaves header undefined when not provided', () => {
      const pane: Pane = { type: 'pane' };
      expect(transformPaneToStrictPane(pane, components).header).toBeUndefined();
    });

    it('defaults isMaximized to false when not provided', () => {
      const pane: Pane = { type: 'pane' };
      expect(transformPaneToStrictPane(pane, components).isMaximized).toBe(false);
    });
  });

  describe('transformItemToStrictItem', () => {
    it('assigns a UUID when no id is provided', () => {
      const row: Row = { type: 'row', children: [] };
      expect(transformItemToStrictItem(row, components).id).toMatch(/.+/);
    });

    it('preserves the id when provided', () => {
      const row: Row = { id: 'row-1', type: 'row', children: [] };
      expect(transformItemToStrictItem(row, components).id).toBe('row-1');
    });

    it('recursively transforms pane children with strict defaults', () => {
      const row: Row = {
        type: 'row',
        children: [{ type: 'pane', id: 'pane-1' }],
      };
      const result = transformItemToStrictItem(row, components);
      expect(result.children[0]).toMatchObject({
        id: 'pane-1',
        type: 'pane',
        isSplittable: true,
      });
    });

    it('recursively transforms nested row/column children', () => {
      const row: Row = {
        type: 'row',
        children: [{ type: 'row', children: [{ type: 'pane', id: 'pane-1' }] }],
      };
      const result = transformItemToStrictItem(row, components) as StrictRow;
      const inner = result.children[0] as StrictRow;
      expect(inner.children[0]).toMatchObject({ id: 'pane-1' });
    });
  });

  describe('transformRootToStrictRoot', () => {
    it('transforms the root item recursively', () => {
      const layout: Layout = {
        root: { type: 'row', children: [{ type: 'pane', id: 'pane-1' }] },
      };
      const result = transformRootToStrictRoot(layout, components);
      expect(result.root.children[0]).toMatchObject({ id: 'pane-1', isSplittable: true });
    });

    it('leaves settings undefined when not provided', () => {
      const layout: Layout = { root: { type: 'row', children: [] } };
      expect(transformRootToStrictRoot(layout, components).settings).toBeUndefined();
    });

    it('transforms settings when provided', () => {
      const settings: Settings = { panes: { isSplittable: false } };
      const layout: Layout = { root: { type: 'row', children: [] }, settings };
      expect(transformRootToStrictRoot(layout, components).settings).toEqual(settings);
    });

    it('keeps a single pane marked as maximized as-is', () => {
      const layout: Layout = {
        root: {
          type: 'row',
          children: [
            { type: 'pane', id: 'pane-1', isMaximized: true },
            { type: 'pane', id: 'pane-2' },
          ],
        },
      };
      const result = transformRootToStrictRoot(layout, components);
      expect((result.root.children[0] as StrictPane).isMaximized).toBe(true);
      expect((result.root.children[1] as StrictPane).isMaximized).toBe(false);
    });

    it('normalises multiple panes marked as maximized to only the first one', () => {
      const layout: Layout = {
        root: {
          type: 'row',
          children: [
            { type: 'pane', id: 'pane-1', isMaximized: true },
            { type: 'pane', id: 'pane-2', isMaximized: true },
          ],
        },
      };
      const result = transformRootToStrictRoot(layout, components);
      expect((result.root.children[0] as StrictPane).isMaximized).toBe(true);
      expect((result.root.children[1] as StrictPane).isMaximized).toBe(false);
    });
  });
});
