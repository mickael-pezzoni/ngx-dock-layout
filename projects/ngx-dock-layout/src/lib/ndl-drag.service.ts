import { Injectable, signal } from '@angular/core';
import { DragTabData } from './core/model';

@Injectable()
export class NdlDragService {
  readonly currentDragData = signal<DragTabData | undefined>(undefined);
}
