import { Pipe, PipeTransform } from '@angular/core';
import { StrictTab } from '../core/model';
import { Components, Settings, Tab } from '../core/public-type';
import { transformTabToStrictTab } from '../core/utils/to-strict.utils';

@Pipe({
  name: 'ndlStrictTab',
  standalone: true,
})
export class NdlStrictTabPipe implements PipeTransform {
  transform<T extends Tab, C extends PropertyKey>(
    value: T,
    components: Components<C>,
    settings?: Settings,
  ): StrictTab {
    return transformTabToStrictTab(value, components, settings);
  }
}
