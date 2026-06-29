import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-notes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
    .notes {
      flex: 1;
      padding: 12px;
      background: transparent;
      color: var(--ndl-color-text);
      border: none;
      outline: none;
      resize: none;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.6;
      box-sizing: border-box;
    }
    .notes::placeholder {
      color: color-mix(in srgb, var(--ndl-color-text) 30%, transparent);
    }
  `,
  template: `
    <textarea
      class="notes"
      [value]="text()"
      (input)="text.set($any($event.target).value)"
      placeholder="Type your notes here…"
    ></textarea>
  `,
})
export class NotesComponent {
  readonly text = signal('');
}
