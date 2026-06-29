import {
  E,
  L as Lt,
  n as nv,
  U as Ua,
  t as tE,
  q as qa,
  A as Am,
  j as jf,
} from './main-4NNXYGUS.js';
var s = class r {
  ctx = E(Lt);
  static ɵfac = function (o) {
    return new (o || r)();
  };
  static ɵcmp = nv({
    type: r,
    selectors: [['app-context']],
    decls: 16,
    vars: 3,
    consts: [
      [1, 'ctx'],
      [1, 'ctx__row'],
      [1, 'ctx__label'],
      [1, 'ctx__value'],
    ],
    template: function (o, l) {
      (o & 1 &&
        (Ua(0, 'div', 0)(1, 'div', 1)(2, 'span', 2),
        tE(3, 'Tab ID'),
        qa(),
        Ua(4, 'span', 3),
        tE(5),
        qa()(),
        Ua(6, 'div', 1)(7, 'span', 2),
        tE(8, 'Header ID'),
        qa(),
        Ua(9, 'span', 3),
        tE(10),
        qa()(),
        Ua(11, 'div', 1)(12, 'span', 2),
        tE(13, 'Pane ID'),
        qa(),
        Ua(14, 'span', 3),
        tE(15),
        qa()()()),
        o & 2 &&
          (Am(5), jf(l.ctx().tabId), Am(5), jf(l.ctx().headerId), Am(5), jf(l.ctx().paneId)));
    },
    styles: [
      '[_nghost-%COMP%]{display:flex;align-items:center;justify-content:center;height:100%;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.ctx[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px;min-width:260px}.ctx__row[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}.ctx__label[_ngcontent-%COMP%]{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:color-mix(in srgb,var(--ndl-color-text) 45%,transparent)}.ctx__value[_ngcontent-%COMP%]{font-family:Menlo,Consolas,monospace;font-size:13px;color:var(--ndl-color-text);background:color-mix(in srgb,var(--ndl-color-text) 6%,transparent);padding:4px 8px;border-radius:var(--ndl-radius-sm, 4px);word-break:break-all}',
    ],
  });
};
export { s as ContextComponent };
