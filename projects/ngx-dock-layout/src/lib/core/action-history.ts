import { Signal, signal } from '@angular/core';
import { StrictLayout } from './model';
import { Action } from './action';

export class ActionHistory {
  readonly #maxSize: number;
  readonly #actions = signal<Record<string, Action>>({});
  readonly #currentActionId = signal<string | undefined>(undefined);

  readonly actions: Signal<Record<string, Action>> = this.#actions.asReadonly();
  readonly currentActionId: Signal<string | undefined> = this.#currentActionId.asReadonly();

  constructor(maxSize = 50) {
    this.#maxSize = maxSize;
  }

  dispatch(action: Action): StrictLayout {
    const currentId = this.#currentActionId();
    if (currentId !== undefined) {
      const entries = Object.entries(this.#actions());
      const idx = entries.findIndex(([id]) => id === currentId);
      this.#actions.set(Object.fromEntries(entries.slice(0, idx)));
      this.#currentActionId.set(undefined);
    }
    const id = crypto.randomUUID();
    this.#actions.update((obj) => {
      const entries = Object.entries(obj);
      const trimmed = entries.length >= this.#maxSize ? entries.slice(1) : entries;
      return Object.fromEntries([...trimmed, [id, action]]);
    });
    return action.commit();
  }

  back(): StrictLayout | undefined {
    const ids = Object.keys(this.#actions());
    const currentId = this.#currentActionId();

    if (currentId === undefined) {
      const lastId = ids.at(-1);
      if (!lastId) return undefined;
      this.#currentActionId.set(lastId);
      return this.#actions()[lastId].undo();
    }

    const idx = ids.indexOf(currentId);
    if (idx <= 0) return undefined;
    const prevId = ids[idx - 1];
    this.#currentActionId.set(prevId);
    return this.#actions()[prevId].undo();
  }

  next(): StrictLayout | undefined {
    const currentId = this.#currentActionId();
    if (currentId === undefined) return undefined;

    const ids = Object.keys(this.#actions());
    const idx = ids.indexOf(currentId);
    const result = this.#actions()[currentId].commit();
    this.#currentActionId.set(ids[idx + 1] ?? undefined);
    return result;
  }

  clear(): void {
    this.#actions.set({});
    this.#currentActionId.set(undefined);
  }
}
