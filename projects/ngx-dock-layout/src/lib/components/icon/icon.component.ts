import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const icons = {
  close:
    'M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z',
  add: 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z',
  edit: 'M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z',
  splitscreen_add:
    'M200-200v-160 4-4 160Zm0 80q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360H200v160h400v80H200Zm0-400q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0-80h560v-160H200v160Zm0 0v-160 160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z',
  splitscreen_vertical_add:
    'M760-760H599h5-4 160Zm-240 0q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v400h-80v-400H600v640q-33 0-56.5-23.5T520-200v-560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm160-640H200v560h160v-560Zm0 0H200h160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z',
  arrow_drop_down: 'M480-360 280-560h400L480-360Z',
  expand_content: 'M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z',
  collapse_content: 'M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z',
} as const;

@Component({
  selector: 'ndl-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [class]="
        {
          xs: 'ndl-icon--xs',
          sm: 'ndl-icon--sm',
          md: 'ndl-icon--md',
          lg: 'ndl-icon--lg',
          custom: 'ndl-icon--custom',
        }[size()]
      "
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      fill: currentColor;
    }
    .ndl-icon--xs {
      width: var(--ndl-icon-xs);
      height: var(--ndl-icon-xs);
    }
    .ndl-icon--sm {
      width: var(--ndl-icon-sm);
      height: var(--ndl-icon-sm);
    }
    .ndl-icon--md {
      width: var(--ndl-icon-md);
      height: var(--ndl-icon-md);
    }
    .ndl-icon--lg {
      width: var(--ndl-icon-lg);
      height: var(--ndl-icon-lg);
    }
  `,
})
export class IconComponent {
  readonly icon = input.required<keyof typeof icons>();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'custom'>('sm');
  readonly path = computed(() => icons[this.icon()]);
}
