import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DragTabData, StrictTab } from '../../core/model';
import { IconComponent } from '../icon/icon.component';
import { NDL_LABELS } from '../../core/token';

@Component({
  selector: 'ndl-tab',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let _tab = tab();
    <button class="ndl-tab__title" [title]="_tab.title" (click)="activeTab.emit(_tab)">
      {{ _tab.title }}
    </button>
    <div class="ndl-tab__actions">
      @if (_tab.isEditable) {
        <button class="ndl-tab__edit" (click)="editTab.emit(_tab)" [title]="labels.editTabTooltip">
          <ndl-icon icon="edit" size="xs" />
        </button>
      }
      @if (_tab.isClosable) {
        <button
          class="ndl-tab__close"
          [title]="labels.closeTabTooltip"
          (click)="closeTab.emit(_tab)"
        >
          <ndl-icon icon="close" size="xs" />
        </button>
      }
    </div>
    <ng-content></ng-content>
  `,
  host: {
    class: 'ndl-tab',
    '[class.ndl-tab--active]': 'tab().isActive',
  },
  styles: `
    :host {
      --ndl-tab-bg: var(--ndl-color-base);
      --ndl-tab-bg-active: var(--ndl-color-surface);
      --ndl-tab-color: var(--ndl-color-text);
      --ndl-tab-radius: var(--ndl-radius-sm);
      --ndl-tab-min-width: 100px;
      --ndl-tab-max-width: 150px;

      color: var(--ndl-tab-color);
      display: flex;
      align-items: center;
      min-width: var(--ndl-tab-min-width);
      max-width: var(--ndl-tab-max-width);
      height: 100%;
    }

    :host {
      background-color: var(--ndl-tab-bg);
    }
    :host.ndl-dragging {
      opacity: 0.4;
      background-color: color-mix(in srgb, var(--ndl-tab-bg) 60%, black);
    }
    :host.ndl-tab--active {
      background-color: var(--ndl-tab-bg-active);
    }
    :host:not(.ndl-tab--active):hover {
      background-color: color-mix(in srgb, var(--ndl-tab-bg-active) 40%, transparent);
    }
    .ndl-tab__title {
      height: 100%;
      width: 100%;
      cursor: pointer;
      background-color: transparent;
      padding: 0 5px;
      color: inherit;
      border: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ndl-tab__actions {
      display: flex;
      align-items: center;
      padding-right: var(--ndl-spacing-md);
    }
    .ndl-tab__edit,
    .ndl-tab__close {
      background-color: transparent;
      color: inherit;
      cursor: pointer;
      border: none;
      padding: var(--ndl-spacing-sm);
    }
    :host:not(.ndl-tab--active) .ndl-tab__edit,
    :host:not(.ndl-tab--active) .ndl-tab__close {
      opacity: 0.7;
    }

    :host .ndl-tab__edit:hover,
    :host .ndl-tab__close:hover,
    :host.ndl-tab--active .ndl-tab__edit,
    :host.ndl-tab--active .ndl-tab__close {
      opacity: 1;
    }
  `,
})
export class TabComponent {
  readonly tab = input.required<StrictTab>();
  readonly labels = inject(NDL_LABELS);

  readonly activeTab = output<StrictTab>();
  readonly closeTab = output<StrictTab>();
  readonly editTab = output<StrictTab>();
  readonly dragStart = output<Omit<DragTabData, 'pane'>>();
  readonly dragEnd = output<StrictTab>();
}
