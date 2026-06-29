import { ComponentRef, Injectable, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { TabContext } from '../public-api';

@Injectable()
export class NdlLayoutService {
  readonly #tabComponents = signal<{
    [tabId: string]: {
      componentRef: ComponentRef<unknown>;
      context: WritableSignal<TabContext>;
      viewContainerRef: ViewContainerRef;
    };
  }>({});

  getTabComponent(tabId: string): ComponentRef<unknown> | undefined {
    return this.#tabComponents()[tabId]?.componentRef;
  }

  getTabContext(tabId: string): WritableSignal<TabContext> | undefined {
    return this.#tabComponents()[tabId]?.context;
  }

  addTabComponent(
    tabId: string,
    componentRef: ComponentRef<unknown>,
    context: WritableSignal<TabContext>,
    viewContainerRef: ViewContainerRef,
  ): void {
    this.#tabComponents.update((tabComponents) => ({
      ...tabComponents,
      [tabId]: { componentRef, viewContainerRef, context },
    }));
    componentRef.onDestroy(() => this.deleteTabComponent(tabId));
  }

  deleteTabComponent(tabId: string): void {
    this.#tabComponents.update((tabComponents) => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { [tabId]: _, ...rest } = tabComponents;
      return rest;
    });
  }

  detachTabComponent(tabId: string): void {
    const tabInfo = this.#tabComponents()[tabId];
    if (tabInfo) {
      const index = tabInfo.viewContainerRef.indexOf(tabInfo.componentRef.hostView);
      if (index !== -1) {
        tabInfo.viewContainerRef.detach(index);
      }
    }
  }

  attachTabComponent(tabId: string, viewContainerRef: ViewContainerRef): void {
    const tabInfo = this.#tabComponents()[tabId];
    if (tabInfo) {
      viewContainerRef.insert(tabInfo.componentRef.hostView);
      this.#tabComponents.update((tabComponents) => ({
        ...tabComponents,
        [tabId]: { ...tabInfo, viewContainerRef },
      }));
    }
  }
}
