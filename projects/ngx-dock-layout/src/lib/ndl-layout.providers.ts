import { Provider } from '@angular/core';
import { NdlLayoutService } from './ndl-layout.service';
import { NdlDragService } from './ndl-drag.service';

export function provideNdlLayout(): Provider[] {
  return [NdlLayoutService, NdlDragService];
}
