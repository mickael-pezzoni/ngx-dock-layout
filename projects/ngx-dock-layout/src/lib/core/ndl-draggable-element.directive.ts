import {
  contentChild,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { NdlDragService } from '../ndl-drag.service';
import { NdlLayoutManager } from './ndl-layout-manager';
import { transformTabToStrictTab } from './utils/to-strict.utils';
import { StrictPane } from './model';
import { NewTab } from './public-type';
import { NdlDragPreviewContainerComponent } from './ndl-drag-preview-container.component';

@Directive({
  selector: '[ndlDraggableElement]',
  host: {
    '[attr.draggable]': 'isDraggable()',
    '[class.ndl-dragging]': 'isDragging()',
  },
})
export class NdlDraggableElementDirective {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #dragService = inject(NdlDragService, { optional: true })!;
  readonly overlay = contentChild(NdlDragPreviewContainerComponent, {
    descendants: true,
  });
  readonly dragEnd = output<NewTab>();
  readonly isDraggable = input(true);

  constructor() {
    if (!this.#dragService) {
      throw new Error(
        '[ndlDraggableElement] NdlDragService is not provided. ' +
          'Add NdlDragService to the providers of the component that contains both ' +
          '<ngx-dock-layout> and [ndlDraggableElement] elements.',
      );
    }
  }

  readonly isDragging = linkedSignal(
    () => this.#dragService.currentDragData()?.tab.id === this.ndlDraggableElement().tab.id,
  );

  readonly ndlDraggableElement = input.required<{
    tab: NewTab;
    pane?: StrictPane;
    manager: NdlLayoutManager;
  }>();

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const overlay = this.overlay();
    const userAgent = window.navigator.userAgent;
    const isFirefox = userAgent.toLowerCase().includes('firefox');
    this.overlay()?.toggleVisibility(true);
    if (overlay) {
      const { x, y } = isFirefox ? { x: 50, y: 30 } : { x: 0, y: 0 };
      event.dataTransfer?.setDragImage(overlay.element.nativeElement, x, y);
    }
    const strictTab = transformTabToStrictTab(
      {
        ...this.ndlDraggableElement().tab,
        type: 'tab',
      },
      this.ndlDraggableElement().manager.components,
      this.ndlDraggableElement().manager.settings(),
    );
    this.#dragService.currentDragData.set({
      tab: strictTab,
      pane: this.ndlDraggableElement().pane,
      type: 'tab',
    });
  }

  @HostListener('dragend')
  onDragEnd() {
    this.isDragging.set(false);
    this.overlay()?.toggleVisibility(false);
    this.dragEnd.emit(this.ndlDraggableElement().tab);
    this.#dragService.currentDragData.set(undefined);
  }
}
