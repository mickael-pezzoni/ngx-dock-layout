import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'ndl-drag-preview-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'ndl-drag-preview-container',
  },
  styles: `
    :host {
      display: none;
      position: absolute;
      top: -1000px;
      left: -1000px;
      z-index: 999;
    }
    :host.ndl-drag-preview-container--dragging {
      display: block;
    }
  `,
})
export class NdlDragPreviewContainerComponent {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly class = 'ndl-drag-preview-container--dragging';
  toggleVisibility(isVisible: boolean): void {
    this.element.nativeElement.classList.toggle(this.class, isVisible);
  }
}
