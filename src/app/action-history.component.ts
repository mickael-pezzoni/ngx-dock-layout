import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NdlLayoutManager } from '../../projects/ngx-dock-layout/src/public-api';

@Component({
  selector: 'app-action-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ah__list">
      @if (entries().length === 0) {
        <div class="ah__empty">No actions yet</div>
      }
      @for (entry of entries(); track entry.id) {
        @if (entry.showSeparator) {
          <div class="ah__separator">
            <span>HEAD</span>
          </div>
        }
        <div class="ah__item" [class.ah__item--done]="entry.isDone">
          <span class="ah__dot" [class.ah__dot--done]="entry.isDone"></span>
          <span class="ah__name">{{ formatName(entry.name) }}</span>
        </div>
      }
    </div>
    <div class="ah__controls">
      <button class="ah__btn" (click)="manager().backConfig()" [disabled]="!canUndo()">
        ↺ Undo
      </button>
      <button class="ah__btn" (click)="manager().nextConfig()" [disabled]="!canRedo()">
        ↻ Redo
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ah__list {
      max-height: 180px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      scrollbar-width: thin;
      scrollbar-color: #3c3c3c transparent;
    }
    .ah__empty {
      font-size: 11px;
      color: #444;
      text-align: center;
      padding: 10px 0;
    }
    .ah__separator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      color: #007acc;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
    }
    .ah__separator::before,
    .ah__separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #007acc44;
    }
    .ah__item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 14px;
      font-size: 11px;
      color: #444;
    }
    .ah__item--done {
      color: #bbb;
    }
    .ah__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 1px solid #444;
      background: transparent;
    }
    .ah__dot--done {
      background: #007acc;
      border-color: #007acc;
    }
    .ah__name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ah__controls {
      display: flex;
      gap: 5px;
      padding: 0 14px;
    }
    .ah__btn {
      flex: 1;
      padding: 5px 0;
      background: #2a2a2a;
      border: 1px solid #3c3c3c;
      border-radius: 5px;
      color: #777;
      font-size: 11px;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
    }
    .ah__btn:hover:not(:disabled) {
      background: #333;
      color: #ccc;
    }
    .ah__btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  `,
})
export class ActionHistoryComponent {
  readonly manager = input.required<NdlLayoutManager>();

  readonly entries = computed(() => {
    const actions = Object.entries(this.manager().actions());
    const currentId = this.manager().currentActionId();
    const currentIdx = currentId ? actions.findIndex(([id]) => id === currentId) : actions.length;

    const reversed = [...actions].reverse().map(([id, action], ri) => ({
      id,
      name: action.action,
      isDone: actions.length - 1 - ri < currentIdx,
    }));

    const firstDoneIdx = reversed.findIndex((e) => e.isDone);
    return reversed.map((e, i) => ({
      ...e,
      showSeparator: i === firstDoneIdx && currentId !== undefined,
    }));
  });

  readonly canUndo = computed(() => this.entries().some((e) => e.isDone));
  readonly canRedo = computed(() => this.manager().currentActionId() !== undefined);

  formatName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').replace(/^[a-z]/, (c) => c.toUpperCase());
  }
}
