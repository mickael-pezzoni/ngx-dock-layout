import {
  l as lo,
  n as nv,
  U as Ua,
  t as tE,
  q as qa,
  C as Cf,
  A as Am,
  j as jf,
} from './main-4NNXYGUS.js';
var p = class a {
  count = lo(0);
  static ɵfac = function (o) {
    return new (o || a)();
  };
  static ɵcmp = nv({
    type: a,
    selectors: [['app-counter']],
    decls: 10,
    vars: 1,
    consts: [
      [1, 'counter'],
      [1, 'counter__value'],
      [1, 'counter__buttons'],
      [1, 'counter__btn', 3, 'click'],
      [1, 'counter__reset', 3, 'click'],
    ],
    template: function (o, r) {
      (o & 1 &&
        (Ua(0, 'div', 0)(1, 'span', 1),
        tE(2),
        qa(),
        Ua(3, 'div', 2)(4, 'button', 3),
        Cf('click', function () {
          return r.count.update((c) => c - 1);
        }),
        tE(5, '\u2212'),
        qa(),
        Ua(6, 'button', 3),
        Cf('click', function () {
          return r.count.update((c) => c + 1);
        }),
        tE(7, '+'),
        qa()(),
        Ua(8, 'button', 4),
        Cf('click', function () {
          return r.count.set(0);
        }),
        tE(9, 'reset'),
        qa()()),
        o & 2 && (Am(2), jf(r.count())));
    },
    styles: [
      '[_nghost-%COMP%]{display:flex;align-items:center;justify-content:center;height:100%;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.counter[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:24px}.counter__value[_ngcontent-%COMP%]{font-size:72px;font-weight:200;line-height:1;color:var(--ndl-color-text);min-width:3ch;text-align:center}.counter__buttons[_ngcontent-%COMP%]{display:flex;gap:12px}.counter__btn[_ngcontent-%COMP%]{width:44px;height:44px;border-radius:50%;border:1px solid color-mix(in srgb,var(--ndl-color-text) 20%,transparent);background:transparent;color:var(--ndl-color-text);font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s}.counter__btn[_ngcontent-%COMP%]:hover{background:color-mix(in srgb,var(--ndl-color-text) 8%,transparent)}.counter__reset[_ngcontent-%COMP%]{font-size:11px;color:color-mix(in srgb,var(--ndl-color-text) 40%,transparent);background:none;border:none;cursor:pointer;padding:0}.counter__reset[_ngcontent-%COMP%]:hover{color:var(--ndl-color-text)}',
    ],
  });
};
export { p as CounterComponent };
