import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NdlLayoutManager, NewTab } from '../../projects/ngx-dock-layout/src/public-api';

export interface PanelItem {
  id: string;
  label: string;
  color: string;
  initials: string;
  tab: NewTab;
}

@Component({
  selector: 'app-empty-pane-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .picker__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .picker__tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      background: transparent;
      color: var(--ndl-color-text);
      border: 1px solid color-mix(in srgb, var(--ndl-color-text) 12%, transparent);
      border-radius: var(--ndl-radius-sm, 6px);
      font-size: 11px;
      cursor: pointer;
      transition:
        background 0.12s,
        border-color 0.12s;
    }
    .picker__tile:hover {
      background: color-mix(in srgb, var(--ndl-color-text) 8%, transparent);
      border-color: color-mix(in srgb, var(--ndl-color-text) 28%, transparent);
    }
    .picker__icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
    }
    .picker__actions {
      display: flex;
      gap: 6px;
    }
    .picker__action {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: transparent;
      color: var(--ndl-color-text);
      border: 1px solid color-mix(in srgb, var(--ndl-color-text) 12%, transparent);
      border-radius: var(--ndl-radius-sm, 6px);
      font-size: 11px;
      opacity: 0.6;
      cursor: pointer;
      transition:
        opacity 0.12s,
        background 0.12s;
    }
    .picker__action:hover {
      opacity: 1;
      background: color-mix(in srgb, var(--ndl-color-text) 8%, transparent);
    }
    .picker__action--close {
      color: #e06c75;
      border-color: color-mix(in srgb, #e06c75 30%, transparent);
    }
    .picker__action--close:hover {
      background: color-mix(in srgb, #e06c75 10%, transparent);
    }
  `,
  template: `
    <div class="picker__grid">
      @for (item of items(); track item.id) {
        <button class="picker__tile" (click)="select(item)">
          <span class="picker__icon" [style.background]="item.color">{{ item.initials }}</span>
          {{ item.label }}
        </button>
      }
    </div>
    @if (isSplittable() || isClosable()) {
      <div class="picker__actions">
        @if (isSplittable()) {
          <button class="picker__action" (click)="split('column')" title="Split column">
            ⬚ Column
          </button>
          <button class="picker__action" (click)="split('row')" title="Split row">▤ Row</button>
        }
        @if (isClosable()) {
          <button class="picker__action picker__action--close" (click)="close()">✕ Close</button>
        }
      </div>
    }
  `,
})
export class EmptyPanePickerComponent {
  readonly items = input.required<PanelItem[]>();
  readonly manager = input.required<NdlLayoutManager>();
  readonly paneId = input.required<string>();
  readonly parentId = input.required<string>();
  readonly isSplittable = input(false);
  readonly isClosable = input(false);

  select(item: PanelItem): void {
    this.manager().addHeader(this.paneId(), { tabs: [item.tab] });
  }

  split(type: 'row' | 'column'): void {
    this.manager().split(this.parentId(), this.paneId(), type, 0);
  }

  close(): void {
    this.manager().closePane(this.paneId());
  }
}
