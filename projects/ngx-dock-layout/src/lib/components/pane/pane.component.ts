import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  DragTabData,
  DragTabDataCenter,
  StrictColumn,
  StrictHeader,
  StrictPane,
  StrictRow,
  StrictTab,
} from '../../core/model';
import { ContentComponent } from './content.component';
import { IconComponent } from '../icon/icon.component';
import { HeaderComponent } from '../header/header.component';
import { NdlLayoutService } from '../../ndl-layout.service';
import { NdlDragService } from '../../ndl-drag.service';
import { EMPTY_PANE_TEMPLATE, MANAGER, NDL_LABELS } from '../../core/token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ndl-pane',
  standalone: true,
  imports: [HeaderComponent, ContentComponent, IconComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
      --ndl-pane-content-bg: var(--ndl-color-surface);
      --ndl-pane-action-bg: var(--ndl-color-base);
      --ndl-pane-button-sm: 25px;
      --ndl-pane-button-md: 30px;
      --ndl-pane-preview-color: var(--ndl-color-text);
    }
    .ndl-pane__content {
      height: 100%;
      width: 100%;
      flex: 1;
      background-color: var(--ndl-pane-content-bg);
      overflow: auto;
      position: relative;
    }
    .ndl-pane__preview {
      position: absolute;
      box-sizing: border-box;
      opacity: 0;
      transform: scale(0.98);
      transition:
        opacity 150ms ease-out,
        transform 150ms ease-out;
    }
    .ndl-pane__preview--active {
      display: block;
      opacity: 1;
      transform: scale(1);
      background-color: color-mix(in srgb, var(--ndl-pane-preview-color) 8%, transparent);
      backdrop-filter: blur(8px);
      border: 1.5px solid color-mix(in srgb, var(--ndl-pane-preview-color) 35%, transparent);
      border-radius: var(--ndl-radius-sm);
      box-shadow: inset 0 0 24px color-mix(in srgb, var(--ndl-pane-preview-color) 6%, transparent);
      z-index: 5;
    }
    .ndl-pane__drag-zone {
      position: absolute;
      width: 100%;
      height: 100%;
      display: none;
    }
    .ndl-pane__drag-zone--active {
      z-index: 5;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 0;
    }
    .ndl-pane__left {
      grid-row: 1 / 4;
      grid-column: 1;
    }
    .ndl-pane__right {
      grid-row: 1 / 4;
      grid-column: 3;
    }
    .ndl-pane__empty {
      display: flex;
      align-items: center;
      position: absolute;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    .ndl-pane__button {
      background-color: transparent;
      color: var(--ndl-color-text);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    .ndl-pane__empty .ndl-pane__split-column,
    .ndl-pane__empty .ndl-pane__split-row {
      height: var(--ndl-pane-button-sm);
      width: var(--ndl-pane-button-sm);
      --ndl-icon--custom: var(--ndl-pane-button-sm);
    }
    .ndl-pane__actions {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ndl-pane__close,
    .ndl-pane__add-tab {
      height: var(--ndl-pane-button-md);
      width: var(--ndl-pane-button-md);
      --ndl-icon--custom: var(--ndl-pane-button-md);
    }
    .ndl-pane__button:hover {
      background-color: color-mix(in srgb, var(--ndl-pane-action-bg) 40%, transparent);
    }
  `,
  template: `
    @let _header = pane().header;
    @if (_header && _header.tabs.length && _header?.isVisible) {
      <ndl-header
        [header]="_header"
        [(isDragging)]="isDraggingOnHeader"
        (addTab)="addTab.emit($event)"
        (editTab)="editTab.emit($event)"
        [pane]="pane()"
      />
    }
    <div
      #ndlPaneContent
      class="ndl-pane__content"
      (dragenter)="onDragEnter($event)"
      (dragleave)="onDragLeave($event)"
      [class.ndl-pane__active]="_header?.tabs?.length"
    >
      <div
        class="ndl-pane__preview"
        [class.ndl-pane__preview--active]="previewState() !== undefined"
        [style.top.%]="previewState()?.top"
        [style.left.%]="previewState()?.left"
        [style.right.%]="previewState()?.right"
        [style.bottom.%]="previewState()?.bottom"
        [style.width.%]="previewState()?.width"
        [style.height.%]="previewState()?.height"
      ></div>
      <div
        class="ndl-pane__drag-zone"
        [class.ndl-pane__drag-zone--active]="dragService.currentDragData() !== undefined"
      >
        <div
          class="ndl-pane__top"
          (drop)="onDrop($event, 'top')"
          (dragover)="onDragTop($event)"
        ></div>
        <div
          class="ndl-pane__left"
          (drop)="onDrop($event, 'left')"
          (dragover)="onDragLeft($event)"
        ></div>
        <div
          class="ndl-pane__right"
          (drop)="onDrop($event, 'right')"
          (dragover)="onDragRight($event)"
        ></div>
        <div
          class="ndl-pane__center"
          (drop)="onDrop($event, 'center')"
          (dragover)="onDragCenter($event)"
        ></div>
        <div
          class="ndl-pane__bottom"
          (drop)="onDrop($event, 'bottom')"
          (dragover)="onDragBottom($event)"
        ></div>
      </div>

      @for (tab of _header?.tabs; track tab.id) {
        @if (tab.component && tab.mustBeLoaded) {
          <ndl-content
            [style.visibility]="tab.isActive ? 'visible' : 'hidden'"
            [tabContext]="{
              tabId: tab.id,
              headerId: _header!.id,
              paneId: pane().id,
            }"
            [tab]="tab"
          />
        }
      } @empty {
        <div class="ndl-pane__empty">
          @if (emptyPaneTemplate?.(); as emptyPaneTemplateRef) {
            <ng-container
              *ngTemplateOutlet="
                emptyPaneTemplateRef;
                context: {
                  layoutManager: layoutManager(),
                  pane: pane(),
                  parent: parent(),
                }
              "
            />
          } @else {
            @if (pane().isSplittable) {
              <button
                class="ndl-pane__button ndl-pane__split-column"
                (click)="onSplit('column')"
                [title]="labels.splitColumnTooltip"
              >
                <ndl-icon icon="splitscreen_add" size="custom" />
              </button>
            }

            <div class="ndl-pane__actions">
              @if (pane().canAddTab) {
                <button
                  class="ndl-pane__button ndl-pane__add-tab"
                  (click)="onAddTab()"
                  [title]="labels.newTabTooltip"
                >
                  <ndl-icon icon="add" size="custom" />
                </button>
              }

              @if (pane().isClosable) {
                <button
                  class="ndl-pane__button ndl-pane__close"
                  (click)="onClosePane()"
                  [title]="labels.closePaneTooltip"
                >
                  <ndl-icon icon="close" size="custom" />
                </button>
              }
            </div>

            @if (pane().isSplittable) {
              <button
                class="ndl-pane__button ndl-pane__split-row"
                (click)="onSplit('row')"
                [title]="labels.splitRowTooltip"
              >
                <ndl-icon icon="splitscreen_vertical_add" size="custom" />
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'ndl-pane',
  },
})
export class PaneComponent {
  readonly layoutManager = inject(MANAGER);
  readonly dockLayoutService = inject(NdlLayoutService);
  readonly dragService = inject(NdlDragService);
  readonly labels = inject(NDL_LABELS);

  readonly pane = input.required<StrictPane>();
  readonly parent = input.required<StrictRow | StrictColumn>();
  readonly emptyPaneTemplate = inject(EMPTY_PANE_TEMPLATE, { optional: true });

  readonly addTab = output<StrictHeader>();
  readonly addHeader = output<StrictPane>();
  readonly editTab = output<StrictTab>();

  readonly previewState = linkedSignal<
    DragTabData | undefined,
    | {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
        width: number;
        height: number;
      }
    | undefined
  >({
    source: this.dragService.currentDragData,
    computation: (src, previous) => (src ? previous?.value : undefined),
  });

  readonly ndlPaneContent = viewChild.required<ElementRef<HTMLElement>>('ndlPaneContent');

  readonly isDraggingOnHeader = signal(false);

  onAddTab() {
    this.addHeader.emit(this.pane());
  }

  onSplit(splitType: 'row' | 'column'): void {
    this.layoutManager().split(this.parent().id, this.pane().id, splitType, 0);
  }

  onClosePane() {
    this.layoutManager().closePane(this.pane().id);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget) return;
    if (!this.ndlPaneContent().nativeElement.contains(relatedTarget as Node)) {
      this.previewState.set(undefined);
    }
  }

  onDragTop(event: DragEvent) {
    event.preventDefault();
    this.previewState.set({ width: 100, height: 50, left: 0 });
    this.dragService.currentDragData.update((currentDragData) => {
      if (!currentDragData) return undefined;
      return {
        ...currentDragData,
        target: { position: 'top' },
      } satisfies DragTabData;
    });
  }

  onDragBottom(event: DragEvent) {
    event.preventDefault();
    this.previewState.set({ width: 100, height: 50, bottom: 0 });
    this.dragService.currentDragData.update((currentDragData) => {
      if (!currentDragData) return undefined;
      return {
        ...currentDragData,
        target: { position: 'bottom' },
      } satisfies DragTabData;
    });
  }

  onDragLeft(event: DragEvent) {
    event.preventDefault();
    this.previewState.set({ width: 50, height: 100, left: 0 });
    this.dragService.currentDragData.update((currentDragData) => {
      if (!currentDragData) return undefined;
      return {
        ...currentDragData,
        target: { position: 'left' },
      } satisfies DragTabData;
    });
  }

  onDragRight(event: DragEvent) {
    event.preventDefault();
    this.previewState.set({ width: 50, height: 100, right: 0 });
    this.dragService.currentDragData.update((currentDragData) => {
      if (!currentDragData) return undefined;
      return {
        ...currentDragData,
        target: { position: 'right' },
      } satisfies DragTabData;
    });
  }

  onDragCenter(event: DragEvent) {
    event.preventDefault();
    this.previewState.set({ width: 100, height: 100 });
    this.dragService.currentDragData.update((currentDragData) => {
      if (!currentDragData) return undefined;
      return {
        ...currentDragData,
        target: {
          headerId: this.pane().header?.id,
          position: 'center',
          tabPosition: 'after',
          tabIndex: this.pane().header?.tabs.length ?? 0,
        },
      } satisfies DragTabDataCenter;
    });
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, zone: 'top' | 'left' | 'right' | 'bottom' | 'center') {
    event.preventDefault();
    const data = this.dragService.currentDragData();
    if (!data) return;

    const isSelfDrop = data.pane?.id === this.pane().id;
    if (isSelfDrop) {
      const hasOtherTabs =
        (data.pane?.header?.tabs.filter((t) => t.id !== data.tab.id).length ?? 0) > 0;
      if (zone === 'center' || !hasOtherTabs) {
        this.dragService.currentDragData.set(undefined);
        return;
      }
    }

    this.dockLayoutService.detachTabComponent(data.tab.id);
    this.layoutManager().dropTabToPane(
      { tab: data.tab, headerId: data.pane?.header?.id, paneId: data.pane?.id },
      { paneId: this.pane().id, parentId: this.parent().id, zone },
    );
    this.dragService.currentDragData.set(undefined);
  }
}
