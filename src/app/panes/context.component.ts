import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NDL_TAB_CONTEXT } from '../../../projects/ngx-dock-layout/src/public-api';

@Component({
  selector: 'app-context',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .ctx {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 260px;
    }
    .ctx__row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ctx__label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: color-mix(in srgb, var(--ndl-color-text) 45%, transparent);
    }
    .ctx__value {
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      color: var(--ndl-color-text);
      background: color-mix(in srgb, var(--ndl-color-text) 6%, transparent);
      padding: 4px 8px;
      border-radius: var(--ndl-radius-sm, 4px);
      word-break: break-all;
    }
  `,
  template: `
    <div class="ctx">
      <div class="ctx__row">
        <span class="ctx__label">Tab ID</span>
        <span class="ctx__value">{{ ctx().tabId }}</span>
      </div>
      <div class="ctx__row">
        <span class="ctx__label">Header ID</span>
        <span class="ctx__value">{{ ctx().headerId }}</span>
      </div>
      <div class="ctx__row">
        <span class="ctx__label">Pane ID</span>
        <span class="ctx__value">{{ ctx().paneId }}</span>
      </div>
    </div>
  `,
})
export class ContextComponent {
  readonly ctx = inject(NDL_TAB_CONTEXT);
}
