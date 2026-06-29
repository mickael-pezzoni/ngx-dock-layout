import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { ItemComponent } from './components/item/item.component';
import { NdlLayoutManager } from './core/ndl-layout-manager';
import { DRAG_PREVIEW_TEMPLATE, EMPTY_PANE_TEMPLATE, GUTTER_SIZE, MANAGER } from './core/token';
import { StrictHeader, StrictPane, StrictTab } from './core/model';

@Component({
  selector: 'ngx-dock-layout',
  imports: [AngularSplitModule, ItemComponent],
  providers: [
    {
      provide: MANAGER,
      useFactory: () => {
        const ngxDockLayoutComponent = inject(NdlLayoutComponent);
        return ngxDockLayoutComponent.manager;
      },
    },
    {
      provide: GUTTER_SIZE,
      useFactory: () => {
        const ngxDockLayoutComponent = inject(NdlLayoutComponent);
        return ngxDockLayoutComponent.gutterSize;
      },
    },
    {
      provide: EMPTY_PANE_TEMPLATE,
      useFactory: () => {
        const ngxDockLayoutComponent = inject(NdlLayoutComponent);
        return ngxDockLayoutComponent.emptyPaneTemplate;
      },
    },
    {
      provide: DRAG_PREVIEW_TEMPLATE,
      useFactory: () => {
        const ngxDockLayoutComponent = inject(NdlLayoutComponent);
        return ngxDockLayoutComponent.dragPreviewTemplate;
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ndl-layout',
  },
  template: `
    <ndl-item
      [item]="manager().config().root"
      (addTab)="addTab.emit($event)"
      (addHeader)="addHeader.emit($event)"
      (editTab)="editTab.emit($event)"
    />
  `,
  styles: `
    @use 'angular-split/theme';

    :host {
      display: block;
      position: relative;
    }

    .ndl-layout__drag-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
    }
    .ndl-layout__drag-overlay--dragging {
      display: block;
    }
  `,
})
export class NdlLayoutComponent {
  readonly manager = input.required<NdlLayoutManager>();
  readonly gutterSize = input<number>(6);
  readonly emptyPaneTemplate = input<TemplateRef<unknown>>();
  readonly dragPreviewTemplate = input<TemplateRef<unknown>>();
  readonly addTab = output<StrictHeader>();
  readonly addHeader = output<StrictPane>();
  readonly editTab = output<StrictTab>();

  get layoutManager(): NdlLayoutManager {
    return this.manager();
  }
}
