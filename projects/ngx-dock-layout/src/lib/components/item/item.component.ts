import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { StrictHeader, StrictItem, StrictPane, StrictTab } from '../../core/model';
import { AngularSplitModule, SplitGutterInteractionEvent } from 'angular-split';
import { PaneComponent } from '../pane/pane.component';
import { GUTTER_SIZE, MANAGER } from '../../core/token';

@Component({
  selector: 'ndl-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      --as-gutter-background-color: var(--ndl-color-surface-alt);
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .ndl-item__area {
      position: relative;
    }
  `,
  imports: [AngularSplitModule, PaneComponent],
  template: `
    @let _item = item();
    @if (_item.type === 'row' || _item.type === 'column') {
      <as-split
        (dragEnd)="onDragEnd($event)"
        [gutterSize]="gutterSize()"
        [direction]="_item.type === 'row' ? 'horizontal' : 'vertical'"
      >
        @for (child of _item.children; track child.id) {
          <as-split-area
            class="ndl-item__area"
            [size]="$safeNavigationMigration($any(child)?.size)"
          >
            @if (child.type === 'pane') {
              <ndl-pane
                [pane]="child"
                [parent]="$any(_item)"
                (addTab)="addTab.emit($event)"
                (addHeader)="addHeader.emit($event)"
                (editTab)="editTab.emit($event)"
              />
            } @else {
              <ndl-item
                [item]="$any(child)"
                (addTab)="addTab.emit($event)"
                (addHeader)="addHeader.emit($event)"
                (editTab)="editTab.emit($event)"
              />
            }
          </as-split-area>
        }
      </as-split>
    }
  `,
  host: {
    class: 'ndl-item',
    '[class.ndl-item--row]': 'item().type === "row"',
    '[class.ndl-item--column]': 'item().type === "column"',
    '[attr.id]': 'item().id',
  },
})
export class ItemComponent {
  readonly layoutManager = inject(MANAGER);
  readonly gutterSize = inject(GUTTER_SIZE);
  readonly item = input.required<StrictItem>();
  readonly addTab = output<StrictHeader>();
  readonly addHeader = output<StrictPane>();
  readonly editTab = output<StrictTab>();

  onDragEnd(event: SplitGutterInteractionEvent): void {
    this.layoutManager().setSizes(this.item().id, event.sizes);
  }
}
