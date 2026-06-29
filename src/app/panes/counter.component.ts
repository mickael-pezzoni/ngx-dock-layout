import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .counter {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }
    .counter__value {
      font-size: 72px;
      font-weight: 200;
      line-height: 1;
      color: var(--ndl-color-text);
      min-width: 3ch;
      text-align: center;
    }
    .counter__buttons {
      display: flex;
      gap: 12px;
    }
    .counter__btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--ndl-color-text) 20%, transparent);
      background: transparent;
      color: var(--ndl-color-text);
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.12s;
    }
    .counter__btn:hover {
      background: color-mix(in srgb, var(--ndl-color-text) 8%, transparent);
    }
    .counter__reset {
      font-size: 11px;
      color: color-mix(in srgb, var(--ndl-color-text) 40%, transparent);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .counter__reset:hover {
      color: var(--ndl-color-text);
    }
  `,
  template: `
    <div class="counter">
      <span class="counter__value">{{ count() }}</span>
      <div class="counter__buttons">
        <button class="counter__btn" (click)="count.update((v) => v - 1)">−</button>
        <button class="counter__btn" (click)="count.update((v) => v + 1)">+</button>
      </div>
      <button class="counter__reset" (click)="count.set(0)">reset</button>
    </div>
  `,
})
export class CounterComponent {
  readonly count = signal(0);
}
