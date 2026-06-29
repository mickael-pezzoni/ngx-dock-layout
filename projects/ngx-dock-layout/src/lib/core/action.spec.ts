import { afterEach, describe, it, expect, vi } from 'vitest';
import { Action } from './action';
import type { StrictLayout } from './model';

const layout1: StrictLayout = { root: { id: 'row-1', type: 'row', children: [] } };
const layout2: StrictLayout = { root: { id: 'row-2', type: 'row', children: [] } };
const layout3: StrictLayout = { root: { id: 'row-3', type: 'row', children: [] } };

describe('Action', () => {
  describe('commit', () => {
    afterEach(() => vi.restoreAllMocks());

    it('returns the initial layout when no operations are added', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 });
      expect(action.commit()).toBe(layout1);
    });

    it('applies a single operation', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 }).operation(() => layout2);
      expect(action.commit()).toBe(layout2);
    });

    it('applies multiple operations in sequence', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 })
        .operation(() => layout2)
        .operation(() => layout3);
      expect(action.commit()).toBe(layout3);
    });

    it('passes the result of each operation to the next', () => {
      const received: StrictLayout[] = [];
      new Action({ action: 'test', strictLayout: layout1 })
        .operation((l) => {
          received.push(l);
          return layout2;
        })
        .operation((l) => {
          received.push(l);
          return layout3;
        })
        .commit();
      expect(received[0]).toBe(layout1);
      expect(received[1]).toBe(layout2);
    });

    it('memoises the result on repeated calls', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 }).operation(() => layout2);
      expect(action.commit()).toBe(action.commit());
    });

    it('returns the initial layout when an operation throws', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const action = new Action({ action: 'test', strictLayout: layout1 }).operation(() => {
        throw new Error('fail');
      });
      expect(action.commit()).toBe(layout1);
    });

    it('returns the custom rollback when an operation throws', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const action = new Action({ action: 'test', strictLayout: layout1 })
        .operation(() => {
          throw new Error('fail');
        })
        .rollback(() => layout3);
      expect(action.commit()).toBe(layout3);
    });
  });

  describe('undo', () => {
    it('returns the initial layout by default', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 }).operation(() => layout2);
      expect(action.undo()).toBe(layout1);
    });

    it('returns the custom rollback when set', () => {
      const action = new Action({ action: 'test', strictLayout: layout1 })
        .operation(() => layout2)
        .rollback(() => layout3);
      expect(action.undo()).toBe(layout3);
    });
  });
});
