import { l as lo, n as nv, U as Ua, C as Cf, q as qa, D as Df } from './main-4NNXYGUS.js';
var p = class t {
  text = lo('');
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = nv({
    type: t,
    selectors: [['app-notes']],
    decls: 1,
    vars: 1,
    consts: [['placeholder', 'Type your notes here\u2026', 1, 'notes', 3, 'input', 'value']],
    template: function (e, n) {
      (e & 1 &&
        (Ua(0, 'textarea', 0),
        Cf('input', function (c) {
          return n.text.set(c.target.value);
        }),
        qa()),
        e & 2 && Df('value', n.text()));
    },
    styles: [
      '[_nghost-%COMP%]{display:flex;height:100%;width:100%;box-sizing:border-box}.notes[_ngcontent-%COMP%]{flex:1;padding:12px;background:transparent;color:var(--ndl-color-text);border:none;outline:none;resize:none;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.6;box-sizing:border-box}.notes[_ngcontent-%COMP%]::placeholder{color:color-mix(in srgb,var(--ndl-color-text) 30%,transparent)}',
    ],
  });
};
export { p as NotesComponent };
