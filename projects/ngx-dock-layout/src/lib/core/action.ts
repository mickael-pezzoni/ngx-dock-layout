import { StrictLayout } from './model';

export enum LayoutActionType {
  Resize = 'resize',
  Split = 'split',
  ActiveTab = 'activeTab',
  AddTab = 'addTab',
  AddHeader = 'addHeader',
  EditTab = 'editTab',
  CloseTab = 'closeTab',
  ClosePane = 'closePane',
  RenameTab = 'renameTab',
  MoveTab = 'moveTab',
  DropTabToPane = 'dropTabToPane',
  MaximizePane = 'maximizePane',
  RestorePane = 'restorePane',
}

type ActionArgs = {
  action: string;
  strictLayout: StrictLayout;
};

export class Action {
  readonly action: string;
  readonly #initialLayout: StrictLayout;
  readonly #operations: ((layout: StrictLayout) => StrictLayout)[] = [];
  #rollbackFn: () => StrictLayout;
  #committed?: StrictLayout;

  constructor({ action, strictLayout }: ActionArgs) {
    this.action = action;
    this.#initialLayout = strictLayout;
    this.#rollbackFn = () => strictLayout;
  }

  operation(op: (layout: StrictLayout) => StrictLayout): this {
    this.#operations.push(op);
    return this;
  }

  rollback(fn: () => StrictLayout): this {
    this.#rollbackFn = fn;
    return this;
  }

  commit(): StrictLayout {
    try {
      this.#committed ??= this.#operations.reduce((prev, op) => op(prev), this.#initialLayout);
      return this.#committed;
    } catch (err) {
      console.error(`[Action:${this.action}]`, err);
      return this.#rollbackFn();
    }
  }

  undo(): StrictLayout {
    return this.#rollbackFn();
  }
}
