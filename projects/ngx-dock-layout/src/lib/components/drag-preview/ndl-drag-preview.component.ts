import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NewTab } from '../../core/public-type';

@Component({
  selector: 'ndl-drag-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ndl-drag-preview__titlebar">
      <span class="ndl-drag-preview__dot"></span>
      <span class="ndl-drag-preview__title">{{ tab().title }}</span>
    </div>
    <div class="ndl-drag-preview__body"></div>
  `,
  host: {
    class: 'ndl-drag-preview',
  },
  styles: `
    :host {
      --ndl-drag-preview-width: 200px;
      --ndl-drag-preview-height: 120px;
      --ndl-drag-preview-titlebar-height: 32px;
      --ndl-drag-preview-font-size: 12px;
      --ndl-drag-preview-opacity: 0.93;
      --ndl-drag-preview-z-index: 9999;
      display: flex;
      flex-direction: column;
      width: var(--ndl-drag-preview-width);
      height: var(--ndl-drag-preview-height);
      border: 1px solid var(--ndl-color-border);
      border-radius: var(--ndl-radius-sm);
      overflow: hidden;
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 6px 12px rgba(0, 0, 0, 0.25);
      pointer-events: none;
      z-index: var(--ndl-drag-preview-z-index);
      opacity: var(--ndl-drag-preview-opacity);
    }
    .ndl-drag-preview__titlebar {
      display: flex;
      align-items: center;
      gap: var(--ndl-spacing-md);
      padding: 0 var(--ndl-spacing-md);
      height: var(--ndl-drag-preview-titlebar-height);
      flex-shrink: 0;
      background-color: var(--ndl-color-surface);
      color: var(--ndl-color-text);
    }
    .ndl-drag-preview__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      background-color: color-mix(in srgb, currentColor 30%, transparent);
      border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
    }
    .ndl-drag-preview__title {
      font-size: var(--ndl-drag-preview-font-size);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ndl-drag-preview__body {
      flex: 1;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        color-mix(in srgb, var(--ndl-color-border, #444) 20%, transparent) 3px,
        color-mix(in srgb, var(--ndl-color-border, #444) 20%, transparent) 4px
      );
      background-color: var(--ndl-color-surface, #1e1e1e);
    }
  `,
})
export class NdlDragPreviewComponent {
  readonly tab = input.required<NewTab>();
}
