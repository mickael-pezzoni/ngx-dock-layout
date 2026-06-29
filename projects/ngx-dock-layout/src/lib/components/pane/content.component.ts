import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  effect,
  inject,
  Injector,
  input,
  signal,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { StrictTab } from '../../core/model';
import { NdlLayoutComponent } from '../../ndl-layout.component';
import { NdlLayoutService } from '../../ndl-layout.service';
import { NDL_LAYOUT_MANAGER, NDL_TAB_CONTEXT } from '../../core/token';
import { TabContext } from '../../core/public-type';
@Component({
  selector: 'ndl-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container></ng-container>`,
  host: {
    class: 'ndl-content',
  },
  styles: `
    :host {
      height: 100%;
      width: 100%;
      display: block;
      position: absolute;
      color: var(--ndl-color-text);
    }
  `,
})
export class ContentComponent {
  readonly tab = input.required<StrictTab>();
  readonly ndlLayoutComponent = inject(NdlLayoutComponent);
  readonly dockLayoutService = inject(NdlLayoutService);
  readonly tabContext = input.required<TabContext>();

  readonly viewContainerRef = viewChild('container', {
    read: ViewContainerRef,
  });
  #componentRef?: ComponentRef<unknown>;

  constructor() {
    effect(() => {
      const tab = this.tab();
      const viewContainerRef = this.viewContainerRef();
      untracked(async () => {
        const tabContext = this.tabContext();
        const tabComponent = this.dockLayoutService.getTabComponent(tab.id);
        if (!viewContainerRef) return;
        if (tabComponent) {
          const context = this.dockLayoutService.getTabContext(tab.id);
          context?.set(tabContext);
          this.dockLayoutService.attachTabComponent(tab.id, viewContainerRef);
          return;
        }
        if (this.#componentRef) return;
        const component = await tab.component?.load();
        if (component) {
          const context = signal(tabContext);
          this.#componentRef = viewContainerRef.createComponent(component, {
            injector: Injector.create({
              providers: [
                {
                  provide: NDL_LAYOUT_MANAGER,
                  useValue: this.ndlLayoutComponent.layoutManager,
                },
                {
                  provide: NDL_TAB_CONTEXT,
                  useValue: context.asReadonly(),
                },
              ],
            }),
          });
          this.dockLayoutService.addTabComponent(
            tab.id,
            this.#componentRef,
            context,
            viewContainerRef,
          );
          Object.entries(tab.component?.inputs || {}).forEach(([key, value]) => {
            this.#componentRef?.setInput(key, value);
          });
        }
      });
    });
  }
}
