import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  DragTabData,
  DragTabDataCenter,
  StrictHeader,
  StrictPane,
  StrictTab,
} from '../../core/model';
import { TabComponent } from './tab.component';
import { IconComponent } from '../icon/icon.component';
import { NdlLayoutService } from '../../ndl-layout.service';
import { NdlDragService } from '../../ndl-drag.service';
import { DRAG_PREVIEW_TEMPLATE, MANAGER, NDL_LABELS } from '../../core/token';
import { NdlDraggableElementDirective } from '../../core/ndl-draggable-element.directive';
import { NdlDragPreviewComponent } from '../drag-preview/ndl-drag-preview.component';
import { CommonModule } from '@angular/common';
import { NdlDragPreviewContainerComponent } from '../../core/ndl-drag-preview-container.component';

@Component({
  selector: 'ndl-header',
  standalone: true,
  imports: [
    TabComponent,
    IconComponent,
    NdlDraggableElementDirective,
    NdlDragPreviewContainerComponent,
    NdlDragPreviewComponent,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ndl-header',
  },
  template: `
    <div class="ndl-header__tabs" #tabsContainer>
      @for (tab of header().tabs; track tab.id) {
        @if (
          tabPlaceHolderPosition()?.target?.tabIndex === $index &&
          tabPlaceHolderPosition()?.target?.tabPosition === 'before'
        ) {
          <button class="ndl-header__tab-placeholder">
            {{ tabPlaceHolderPosition()?.tab?.title }}
          </button>
        }
        <ndl-tab
          [tab]="tab"
          id="tab-{{ tab.id }}"
          [attr.data-tab_id]="tab.id"
          [isDraggable]="tab.isDraggable"
          [ndlDraggableElement]="{
            tab: tab,
            pane: pane(),
            manager: layoutManager(),
          }"
          (activeTab)="onActiveTab($event)"
          (closeTab)="onCloseTab($event)"
          (editTab)="onEditTab($event)"
          (dragStart)="onDragStartTab($event)"
          (dragover)="onDragOverTab($event)"
          (dragEnd)="onDragEndTab()"
        >
          <ndl-drag-preview-container>
            @if (dragPreviewTemplate?.(); as dragPreviewTemplateRef) {
              <ng-container
                *ngTemplateOutlet="
                  dragPreviewTemplateRef;
                  context: {
                    tab,
                    header: header(),
                    pane: pane(),
                  }
                "
              />
            } @else {
              <ndl-drag-preview [tab]="tab" />
            }
          </ndl-drag-preview-container>
        </ndl-tab>
        @if (
          tabPlaceHolderPosition()?.target?.tabIndex === $index &&
          tabPlaceHolderPosition()?.target?.tabPosition === 'after'
        ) {
          <button class="ndl-header__tab-placeholder">
            {{ tabPlaceHolderPosition()?.tab?.title }}
          </button>
        }
      }
      @if (
        tabPlaceHolderPosition()?.target?.tabIndex === header().tabs.length &&
        tabPlaceHolderPosition()?.target?.tabPosition === 'after'
      ) {
        <button class="ndl-header__tab-placeholder">
          {{ tabPlaceHolderPosition()?.tab?.title }}
        </button>
      }
      <div class="ndl-header__empty" (dragover)="onDragOverEnd($event)"></div>
    </div>

    @if (hasOverflow()) {
      <div class="ndl-header__overflow">
        <button
          class="ndl-header__overflow-btn"
          (click)="toggleDropdown()"
          [title]="labels.allTabsTooltip"
        >
          <ndl-icon icon="arrow_drop_down" size="xs" />
        </button>
        @if (isDropdownOpen()) {
          <div class="ndl-header__dropdown">
            @for (tab of header().tabs; track tab.id) {
              <button
                class="ndl-header__dropdown-item"
                [class.ndl-header__dropdown-item--active]="tab.isActive"
                (click)="onActiveTab(tab); isDropdownOpen.set(false)"
              >
                {{ tab.title }}
              </button>
            }
          </div>
        }
      </div>
    }
    @if (header().canAddTab) {
      <div class="ndl-header__end">
        <button class="ndl-header__add" (click)="onAddTab()" [title]="labels.newTabTooltip">
          <ndl-icon icon="add" />
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      --ndl-header-color: var(--ndl-color-text);
      --ndl-header-add-size: 25px;
      --ndl-header-tab-min-width: var(--ndl-tab-min-width, 100px);
      --ndl-header-tab-max-width: var(--ndl-tab-max-width, 150px);
      --ndl-header-preview-color: var(--ndl-color-text);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--ndl-spacing-sm);
      background-color: var(--ndl-color-base);
      height: var(--ndl-tab-height);
    }
    .ndl-header__tabs {
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow-x: auto;
      scrollbar-width: none;
      height: 100%;
      flex: 1;
      min-width: 0;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .ndl-header__add {
      height: var(--ndl-header-add-size);
      background-color: transparent;
      color: var(--ndl-header-color);
      width: var(--ndl-header-add-size);
      cursor: pointer;
      border-radius: 50%;
      border: none;
      padding: 0;
    }
    .ndl-header__add:hover {
      background-color: color-mix(in srgb, var(--ndl-color-base) 40%, transparent);
    }
    @keyframes ndl-preview-in {
      from {
        opacity: 0;
        transform: scaleX(0.85);
      }
      to {
        opacity: 1;
        transform: scaleX(1);
      }
    }
    .ndl-header__tab-placeholder {
      background-color: color-mix(in srgb, var(--ndl-header-preview-color) 8%, transparent);
      backdrop-filter: blur(8px);
      border: 1.5px solid color-mix(in srgb, var(--ndl-header-preview-color) 35%, transparent);
      border-radius: var(--ndl-radius-sm);
      box-shadow: inset 0 0 12px color-mix(in srgb, var(--ndl-header-preview-color) 6%, transparent);
      animation: ndl-preview-in 150ms ease-out;
      transform-origin: left center;
      display: flex;
      align-items: center;
      min-width: var(--ndl-header-tab-min-width);
      max-width: var(--ndl-header-tab-max-width);
      padding: 0px var(--ndl-spacing-sm) 0px var(--ndl-spacing-md);
      height: 100%;
      color: var(--ndl-header-color);
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .ndl-header__empty {
      width: 100%;
      height: 100%;
      flex: 1;
    }
    .ndl-header__end {
      flex-shrink: 0;
    }
    .ndl-header__overflow {
      position: relative;
      flex-shrink: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .ndl-header__overflow-btn {
      height: 100%;
      padding: 0 var(--ndl-spacing-sm);
      background-color: transparent;
      color: var(--ndl-header-color);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .ndl-header__overflow-btn:hover {
      background-color: color-mix(in srgb, var(--ndl-color-base) 60%, transparent);
    }
    .ndl-header__dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 180px;
      max-height: 240px;
      overflow-y: auto;
      background-color: var(--ndl-color-surface);
      border: 1px solid var(--ndl-color-border);
      border-radius: var(--ndl-radius-sm);
      box-shadow:
        0 8px 20px rgba(0, 0, 0, 0.2),
        0 2px 6px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
    .ndl-header__dropdown-item {
      display: block;
      width: 100%;
      padding: var(--ndl-spacing-sm) var(--ndl-spacing-md);
      background: transparent;
      color: var(--ndl-header-color);
      border: none;
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: inherit;
    }
    .ndl-header__dropdown-item:hover {
      background-color: color-mix(in srgb, var(--ndl-color-base) 80%, transparent);
    }
    .ndl-header__dropdown-item--active {
      background-color: var(--ndl-color-base);
    }
  `,
})
export class HeaderComponent {
  readonly layoutManager = inject(MANAGER);
  readonly elementRef = inject(ElementRef);
  readonly dockLayoutService = inject(NdlLayoutService);
  readonly dragService = inject(NdlDragService);
  readonly #destroyRef = inject(DestroyRef);
  readonly labels = inject(NDL_LABELS);
  readonly dragPreviewTemplate = inject(DRAG_PREVIEW_TEMPLATE, {
    optional: true,
  });

  readonly header = input.required<StrictHeader>();
  readonly pane = input.required<StrictPane>();

  readonly addTab = output<StrictHeader>();
  readonly editTab = output<StrictTab>();
  readonly isDragging = model(false);

  readonly hasOverflow = signal(false);
  readonly isDropdownOpen = signal(false);
  readonly tabsContainerRef = viewChild.required<ElementRef<HTMLElement>>('tabsContainer');

  readonly tabPlaceHolderPosition = computed<DragTabDataCenter | undefined>(() => {
    const currentDragData = this.dragService.currentDragData();
    if (!currentDragData) return undefined;
    if (currentDragData.target?.headerId !== this.header().id) return undefined;
    return currentDragData.target.position === 'center'
      ? (currentDragData as DragTabDataCenter)
      : undefined;
  });

  constructor() {
    afterNextRender(() => {
      const el = this.tabsContainerRef().nativeElement;
      const observer = new ResizeObserver(() => this.#checkOverflow());
      observer.observe(el);
      this.#destroyRef.onDestroy(() => observer.disconnect());
    });

    effect(() => {
      void this.header().tabs;
      queueMicrotask(() => this.#checkOverflow());
    });
  }

  #checkOverflow(): void {
    const el = this.tabsContainerRef()?.nativeElement;
    if (el) {
      this.hasOverflow.set(el.scrollWidth > el.clientWidth);
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isDropdownOpen.set(false);
    }
  }

  onActiveTab(tab: StrictTab): void {
    if (tab.isActive) return;
    this.layoutManager().activeTab(this.header().id, tab.id);
    const el = this.tabsContainerRef().nativeElement.querySelector(`#tab-${tab.id}`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
  }

  onCloseTab(tab: StrictTab): void {
    this.layoutManager().closeTab(this.header().id, tab.id);
  }

  onAddTab(): void {
    this.addTab.emit(this.header());
  }

  onEditTab(tab: StrictTab) {
    this.editTab.emit(tab);
  }

  onDragStartTab(dragPaneData: Omit<DragTabData, 'pane'>): void {
    this.dragService.currentDragData.set({
      ...dragPaneData,
      pane: this.pane(),
    });
  }

  onDragEndTab(): void {
    this.dragService.currentDragData.set(undefined);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget) return;
    if (!this.elementRef.nativeElement.contains(relatedTarget as Node)) {
      this.isDragging.set(false);
      this.dragService.currentDragData.update((dragData) => {
        if (!dragData) return dragData;
        return { ...dragData, target: undefined };
      });
    }
  }

  onDragOverTab(event: DragEvent): void {
    event.preventDefault();
    const tab = (event.target as HTMLElement).closest('ndl-tab') as HTMLElement;
    if (!tab) return;
    const tabId = tab.dataset['tab_id'];
    const { width, left } = tab.getBoundingClientRect();
    const x = event.clientX - left;
    const index = this.header().tabs.findIndex((t) => t.id === tabId);
    this.dragService.currentDragData.update((dragData) => {
      if (!dragData) return dragData;
      return {
        ...dragData,
        target: {
          headerId: this.header().id,
          tabPosition: x < width / 2 ? 'before' : 'after',
          position: 'center',
          tabIndex: index,
        },
      } satisfies DragTabDataCenter;
    });
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const placeHolderPosition = this.tabPlaceHolderPosition();
    if (!placeHolderPosition?.target) return;
    const { tab, pane } = placeHolderPosition;
    const index = placeHolderPosition.target.tabIndex;
    const targetIndex = placeHolderPosition.target.tabPosition === 'before' ? index : index + 1;
    this.dockLayoutService.detachTabComponent(tab.id);
    this.layoutManager().moveTab(
      { tab, headerId: pane?.header?.id, paneId: pane?.id },
      { headerId: this.header().id, index: targetIndex },
    );
    this.isDragging.set(false);
    this.dragService.currentDragData.set(undefined);
  }

  onDragOverEnd(event: DragEvent): void {
    event.preventDefault();
    this.dragService.currentDragData.update((dragData) => {
      if (!dragData) return dragData;
      return {
        ...dragData,
        target: {
          headerId: this.header().id,
          tabPosition: 'after',
          position: 'center',
          tabIndex: this.header().tabs.length,
        },
      } satisfies DragTabDataCenter;
    });
  }
}
