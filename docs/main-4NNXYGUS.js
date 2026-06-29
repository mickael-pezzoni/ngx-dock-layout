var ip = Object.defineProperty,
  sp = Object.defineProperties;
var ap = Object.getOwnPropertyDescriptors;
var sr$1 = Object.getOwnPropertySymbols;
var rc = Object.prototype.hasOwnProperty,
  oc = Object.prototype.propertyIsEnumerable;
var nc = (e, t, n) =>
    t in e
      ? ip(e, t, { enumerable: true, configurable: true, writable: true, value: n })
      : (e[t] = n),
  H = (e, t) => {
    for (var n in (t ||= {})) rc.call(t, n) && nc(e, n, t[n]);
    if (sr$1) for (var n of sr$1(t)) oc.call(t, n) && nc(e, n, t[n]);
    return e;
  },
  B$1 = (e, t) => sp(e, ap(t));
var ZE = (e) => (typeof e == 'symbol' ? e : e + ''),
  cp = (e, t) => {
    var n = {};
    for (var r in e) rc.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && sr$1)
      for (var r of sr$1(e)) t.indexOf(r) < 0 && oc.call(e, r) && (n[r] = e[r]);
    return n;
  };
var oi$1 = (e, t, n) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(n.next(c));
        } catch (l) {
          o(l);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (l) {
          o(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
var Q = null,
  ar$1 = false,
  nt$2 = 1,
  j = Symbol('SIGNAL');
function m(e) {
  let t = Q;
  return ((Q = e), t);
}
function cr$1() {
  return Q;
}
var Ue$1 = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: false,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: false,
  consumerAllowSignalWrites: false,
  consumerIsAlwaysLive: false,
  kind: 'unknown',
  producerMustRecompute: () => false,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Ae(e) {
  if (ar$1) throw new Error('');
  if (Q === null) return;
  Q.consumerOnSignalRead(e);
  let t = Q.producersTail;
  if (t !== void 0 && t.producer === e) return;
  let n,
    r = Q.recomputing;
  if (r && ((n = t !== void 0 ? t.nextProducer : Q.producers), n !== void 0 && n.producer === e)) {
    ((Q.producersTail = n), (n.lastReadVersion = e.version), (n.knownValidAtEpoch = nt$2));
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === Q && (!r || o.knownValidAtEpoch === nt$2)) return;
  let i = jt$2(Q),
    s = {
      producer: e,
      consumer: Q,
      nextProducer: n,
      prevConsumer: void 0,
      knownValidAtEpoch: nt$2,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  ((Q.producersTail = s), t !== void 0 ? (t.nextProducer = s) : (Q.producers = s), i && cc(e, s));
}
function ic() {
  nt$2++;
}
function it$2(e) {
  if (!(jt$2(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === nt$2)) {
    if (!e.producerMustRecompute(e) && !Ft$1(e)) {
      Pt$1(e);
      return;
    }
    (e.producerRecomputeValue(e), Pt$1(e));
  }
}
function ii$2(e) {
  if (e.consumers === void 0) return;
  let t = ar$1;
  ar$1 = true;
  try {
    for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
      let r = n.consumer;
      r.dirty || up(r);
    }
  } finally {
    ar$1 = t;
  }
}
function si$1() {
  return Q?.consumerAllowSignalWrites !== false;
}
function up(e) {
  ((e.dirty = true), ii$2(e), e.consumerMarkedDirty?.(e));
}
function Pt$1(e) {
  ((e.dirty = false), (e.lastCleanEpoch = nt$2));
}
function Re$1(e) {
  return (e && sc(e), m(e));
}
function sc(e) {
  if (e.producersTail?.knownValidAtEpoch === nt$2) {
    let t = e.producers;
    for (; t !== void 0; ) ((t.knownValidAtEpoch = null), (t = t.nextProducer));
  }
  ((e.producersTail = void 0), (e.recomputing = true));
}
function qe(e, t) {
  (m(t), e && ac(e));
}
function ac(e) {
  e.recomputing = false;
  let t = e.producersTail,
    n = t !== void 0 ? t.nextProducer : e.producers;
  if (n !== void 0) {
    if (jt$2(e))
      do n = ai$2(n);
      while (n !== void 0);
    t !== void 0 ? (t.nextProducer = void 0) : (e.producers = void 0);
  }
}
function Ft$1(e) {
  for (let t = e.producers; t !== void 0; t = t.nextProducer) {
    let n = t.producer,
      r = t.lastReadVersion;
    if (r !== n.version || (it$2(n), r !== n.version)) return true;
  }
  return false;
}
function We(e) {
  if (jt$2(e)) {
    let t = e.producers;
    for (; t !== void 0; ) t = ai$2(t);
  }
  ((e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0));
}
function cc(e, t) {
  let n = e.consumersTail,
    r = jt$2(e);
  if (
    (n !== void 0
      ? ((t.nextConsumer = n.nextConsumer), (n.nextConsumer = t))
      : ((t.nextConsumer = void 0), (e.consumers = t)),
    (t.prevConsumer = n),
    (e.consumersTail = t),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer) cc(o.producer, o);
}
function ai$2(e) {
  let t = e.producer,
    n = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (t.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((t.consumers = r), !jt$2(t))) {
    let i = t.producers;
    for (; i !== void 0; ) i = ai$2(i);
  }
  return n;
}
function jt$2(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function mn$1(e, t) {
  return Object.is(e, t);
}
function yn$1(e, t) {
  let n = Object.create(dp);
  n.computation = e;
  let r = () => {
    if ((it$2(n), Ae(n), n.value === ye)) throw n.error;
    return n.value;
  };
  return ((r[j] = n), r);
}
var rt$2 = Symbol('UNSET'),
  ot$2 = Symbol('COMPUTING'),
  ye = Symbol('ERRORED'),
  dp = B$1(H({}, Ue$1), {
    value: rt$2,
    dirty: true,
    error: null,
    equal: mn$1,
    kind: 'computed',
    producerMustRecompute(e) {
      return e.value === rt$2 || e.value === ot$2;
    },
    producerRecomputeValue(e) {
      if (e.value === ot$2) throw new Error('');
      let t = e.value;
      e.value = ot$2;
      let n = Re$1(e),
        r,
        o = false;
      try {
        ((r = e.computation()), m(null), (o = t !== rt$2 && t !== ye && r !== ye && e.equal(t, r)));
      } catch (i) {
        ((r = ye), (e.error = i));
      } finally {
        qe(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      ((e.value = r), e.version++);
    },
  });
function fp() {
  throw new Error();
}
var lc = fp;
function uc(e) {
  lc(e);
}
function ci$2(e) {
  lc = e;
}
function li$2(e, t) {
  let n = Object.create(vn$1);
  ((n.value = e), t !== void 0 && (n.equal = t));
  let r = () => dc(n);
  return ((r[j] = n), [r, (s) => Ge(n, s), (s) => lr$1(n, s)]);
}
function dc(e) {
  return (Ae(e), e.value);
}
function Ge(e, t) {
  (si$1() || uc(e), e.equal(e.value, t) || ((e.value = t), hp(e)));
}
function lr$1(e, t) {
  (si$1() || uc(e), Ge(e, t(e.value)));
}
var vn$1 = B$1(H({}, Ue$1), { equal: mn$1, value: void 0, kind: 'signal' });
function hp(e) {
  (e.version++, ic(), ii$2(e));
}
var ui$2 = B$1(H({}, Ue$1), {
  consumerIsAlwaysLive: true,
  consumerAllowSignalWrites: true,
  dirty: true,
  kind: 'effect',
});
function di$2(e) {
  if (((e.dirty = false), e.version > 0 && !Ft$1(e))) return;
  e.version++;
  let t = Re$1(e);
  try {
    (e.cleanup(), e.fn());
  } finally {
    qe(e, t);
  }
}
var fi$2;
function ur$1() {
  return fi$2;
}
function ve(e) {
  let t = fi$2;
  return ((fi$2 = e), t);
}
var fc = Symbol('NotFound');
function Vt$2(e) {
  return e === fc || e?.name === '\u0275NotFound';
}
function pi$2(e, t, n) {
  let r = Object.create(gp);
  ((r.source = e), (r.computation = t), n != null && (r.equal = n));
  let i = () => {
    if ((it$2(r), Ae(r), r.value === ye)) throw r.error;
    return r.value;
  };
  return ((i[j] = r), i);
}
function pc(e, t) {
  (it$2(e), Ge(e, t), Pt$1(e));
}
function hc(e, t) {
  if ((it$2(e), e.value === ye)) throw e.error;
  (lr$1(e, t), Pt$1(e));
}
var gp = B$1(H({}, Ue$1), {
  value: rt$2,
  dirty: true,
  error: null,
  equal: mn$1,
  kind: 'linkedSignal',
  producerMustRecompute(e) {
    return e.value === rt$2 || e.value === ot$2;
  },
  producerRecomputeValue(e) {
    if (e.value === ot$2) throw new Error('');
    let t = e.value;
    e.value = ot$2;
    let n = Re$1(e),
      r,
      o = false;
    try {
      let i = e.source(),
        s = t !== rt$2 && t !== ye,
        a = s ? { source: e.sourceValue, value: t } : void 0;
      ((r = e.computation(i, a)),
        (e.sourceValue = i),
        m(null),
        (o = s && r !== ye && e.equal(t, r)));
    } catch (i) {
      ((r = ye), (e.error = i));
    } finally {
      qe(e, n);
    }
    if (o) {
      e.value = t;
      return;
    }
    ((e.value = r), e.version++);
  },
});
function gc(e) {
  let t = m(null);
  try {
    return e();
  } finally {
    m(t);
  }
}
function y(e) {
  return typeof e == 'function';
}
function Ht$2(e) {
  let n = e((r) => {
    (Error.call(r), (r.stack = new Error().stack));
  });
  return ((n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n);
}
var dr$1 = Ht$2(
  (e) =>
    function (n) {
      (e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n));
    },
);
function st$2(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var $ = class e {
  constructor(t) {
    ((this.initialTeardown = t),
      (this.closed = false),
      (this._parentage = null),
      (this._finalizers = null));
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = true;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n))) for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (y(r))
        try {
          r();
        } catch (i) {
          t = i instanceof dr$1 ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            mc(i);
          } catch (s) {
            ((t = t ?? []), s instanceof dr$1 ? (t = [...t, ...s.errors]) : t.push(s));
          }
      }
      if (t) throw new dr$1(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) mc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && st$2(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    (n && st$2(n, t), t instanceof e && t._removeParent(this));
  }
};
$.EMPTY = (() => {
  let e = new $();
  return ((e.closed = true), e);
})();
var hi$2 = $.EMPTY;
function fr(e) {
  return e instanceof $ || (e && 'closed' in e && y(e.remove) && y(e.add) && y(e.unsubscribe));
}
function mc(e) {
  y(e) ? e() : e.unsubscribe();
}
var ue = { Promise: void 0 };
var Bt$2 = {
  setTimeout(e, t, ...n) {
    return setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    return clearTimeout(e);
  },
  delegate: void 0,
};
function pr(e) {
  Bt$2.setTimeout(() => {
    throw e;
  });
}
function at$2() {}
function $t$2(e) {
  e();
}
var lt$2 = class lt extends $ {
  constructor(t) {
    (super(),
      (this.isStopped = false),
      t ? ((this.destination = t), fr(t) && t.add(this)) : (this.destination = vp));
  }
  static create(t, n, r) {
    return new Ut$2(t, n, r);
  }
  next(t) {
    this.isStopped ? yi$2() : this._next(t);
  }
  error(t) {
    this.isStopped ? yi$2() : ((this.isStopped = true), this._error(t));
  }
  complete() {
    this.isStopped ? yi$2() : ((this.isStopped = true), this._complete());
  }
  unsubscribe() {
    this.closed || ((this.isStopped = true), super.unsubscribe(), (this.destination = null));
  }
  _next(t) {
    this.destination.next(t);
  }
  _error(t) {
    try {
      this.destination.error(t);
    } finally {
      this.unsubscribe();
    }
  }
  _complete() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
};
var vi$2 = class vi {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          hr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          hr(r);
        }
      else hr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          hr(n);
        }
    }
  },
  Ut$2 = class Ut extends lt$2 {
    constructor(t, n, r) {
      super();
      let o;
      if (y(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        o = t;
      }
      this.destination = new vi$2(o);
    }
  };
function hr(e) {
  pr(e);
}
function yp(e) {
  throw e;
}
function yi$2(e, t) {}
var vp = { closed: true, next: at$2, error: yp, complete: at$2 };
var qt$1 = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function de(e) {
  return e;
}
function Ep(...e) {
  return Ei$2(e);
}
function Ei$2(e) {
  return e.length === 0
    ? de
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var M = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return ((r.source = this), (r.operator = n), r);
    }
    subscribe(n, r, o) {
      let i = Dp(n) ? n : new Ut$2(n, r, o);
      return (
        $t$2(() => {
          let { operator: s, source: a } = this;
          i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Dc(r)),
        new r((o, i) => {
          let s = new Ut$2({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                (i(c), s.unsubscribe());
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n);
    }
    [qt$1]() {
      return this;
    }
    pipe(...n) {
      return Ei$2(n)(this);
    }
    toPromise(n) {
      return (
        (n = Dc(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return ((e.create = (t) => new e(t)), e);
})();
function Dc(e) {
  var t;
  return (t = e ?? ue.Promise) !== null && t !== void 0 ? t : Promise;
}
function Ip(e) {
  return e && y(e.next) && y(e.error) && y(e.complete);
}
function Dp(e) {
  return (e && e instanceof lt$2) || (Ip(e) && fr(e));
}
function wp(e) {
  return y(e?.lift);
}
function w(e) {
  return (t) => {
    if (wp(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function T(e, t, n, r, o) {
  return new Ii$2(e, t, n, r, o);
}
var Ii$2 = class Ii extends lt$2 {
  constructor(t, n, r, o, i, s) {
    (super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete));
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      (super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this)));
    }
  }
};
var wc = Ht$2(
  (e) =>
    function () {
      (e(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    },
);
var ke$1 = (() => {
    class e extends M {
      constructor() {
        (super(),
          (this.closed = false),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = false),
          (this.hasError = false),
          (this.thrownError = null));
      }
      lift(n) {
        let r = new gr$1(this, this);
        return ((r.operator = n), r);
      }
      _throwIfClosed() {
        if (this.closed) throw new wc();
      }
      next(n) {
        $t$2(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        $t$2(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ((this.hasError = this.isStopped = true), (this.thrownError = n));
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        $t$2(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = true;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        ((this.isStopped = this.closed = true), (this.observers = this.currentObservers = null));
      }
      get observed() {
        var n;
        return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
      }
      _trySubscribe(n) {
        return (this._throwIfClosed(), super._trySubscribe(n));
      }
      _subscribe(n) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n));
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? hi$2
          : ((this.currentObservers = null),
            i.push(n),
            new $(() => {
              ((this.currentObservers = null), st$2(i, n));
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new M();
        return ((n.source = this), n);
      }
    }
    return ((e.create = (t, n) => new gr$1(t, n)), e);
  })(),
  gr$1 = class gr extends ke$1 {
    constructor(t, n) {
      (super(), (this.destination = t), (this.source = n));
    }
    next(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null &&
        r !== void 0
        ? r
        : hi$2;
    }
  };
var En$1 = class En extends ke$1 {
  constructor(t) {
    (super(), (this._value = t));
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return (!n.closed && t.next(this._value), n);
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return (this._throwIfClosed(), r);
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Di$2 = {
  now() {
    return Date.now();
  },
};
var mr = class extends $ {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var In$2 = {
  setInterval(e, t, ...n) {
    let { delegate: r } = In$2;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    return clearInterval(e);
  },
  delegate: void 0,
};
var yr = class extends mr {
  constructor(t, n) {
    (super(t, n), (this.scheduler = t), (this.work = n), (this.pending = false));
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = true),
      (this.delay = n),
      (this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return In$2.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === false) return n;
    n != null && In$2.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = false;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === false &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = false,
      o;
    try {
      this.work(t);
    } catch (i) {
      ((r = true), (o = i || new Error('Scheduled action threw falsy error')));
    }
    if (r) return (this.unsubscribe(), o);
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      ((this.work = this.state = this.scheduler = null),
        (this.pending = false),
        st$2(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe());
    }
  }
};
var Wt$1 = class e {
  constructor(t, n = e.now) {
    ((this.schedulerActionCtor = t), (this.now = n));
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
Wt$1.now = Di$2.now;
var vr = class extends Wt$1 {
  constructor(t, n = Wt$1.now) {
    (super(t, n), (this.actions = []), (this._active = false));
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = true;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = false), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var Dn$1 = new vr(yr),
  Tc = Dn$1;
var Oe = new M((e) => e.complete());
function Er(e) {
  return e && y(e.schedule);
}
function wi$1(e) {
  return e[e.length - 1];
}
function Cc(e) {
  return y(wi$1(e)) ? e.pop() : void 0;
}
function Ee$1(e) {
  return Er(wi$1(e)) ? e.pop() : void 0;
}
function bc(e, t) {
  return typeof wi$1(e) == 'number' ? e.pop() : t;
}
function _c(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, [])).next());
  });
}
function Mc(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e });
      },
    };
  throw new TypeError(t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function ut$2(e) {
  return this instanceof ut$2 ? ((this.v = e), this) : new ut$2(e);
}
function Nc(e, t, n) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    a('next'),
    a('throw'),
    a('return', s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (h) {
      return Promise.resolve(h).then(f, d);
    };
  }
  function a(f, h) {
    r[f] &&
      ((o[f] = function (D) {
        return new Promise(function (N, k) {
          i.push([f, D, N, k]) > 1 || c(f, D);
        });
      }),
      h && (o[f] = h(o[f])));
  }
  function c(f, h) {
    try {
      l(r[f](h));
    } catch (D) {
      p(i[0][3], D);
    }
  }
  function l(f) {
    f.value instanceof ut$2 ? Promise.resolve(f.value.v).then(u, d) : p(i[0][2], f);
  }
  function u(f) {
    c('next', f);
  }
  function d(f) {
    c('throw', f);
  }
  function p(f, h) {
    (f(h), i.shift(), i.length && c(i[0][0], i[0][1]));
  }
}
function Sc(e) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Mc == 'function' ? Mc(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          ((s = e[i](s)), o(a, c, s.done, s.value));
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var Gt$2 = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function Ir(e) {
  return y(e?.then);
}
function Dr(e) {
  return y(e[qt$1]);
}
function wr(e) {
  return Symbol.asyncIterator && y(e?.[Symbol.asyncIterator]);
}
function Tr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Tp() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var Cr = Tp();
function br(e) {
  return y(e?.[Cr]);
}
function Mr(e) {
  return Nc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield ut$2(n.read());
        if (o) return yield ut$2(void 0);
        yield yield ut$2(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function _r(e) {
  return y(e?.getReader);
}
function O(e) {
  if (e instanceof M) return e;
  if (e != null) {
    if (Dr(e)) return Cp(e);
    if (Gt$2(e)) return bp(e);
    if (Ir(e)) return Mp(e);
    if (wr(e)) return xc(e);
    if (br(e)) return _p(e);
    if (_r(e)) return Np(e);
  }
  throw Tr(e);
}
function Cp(e) {
  return new M((t) => {
    let n = e[qt$1]();
    if (y(n.subscribe)) return n.subscribe(t);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function bp(e) {
  return new M((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Mp(e) {
  return new M((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, pr);
  });
}
function _p(e) {
  return new M((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function xc(e) {
  return new M((t) => {
    Sp(e, t).catch((n) => t.error(n));
  });
}
function Np(e) {
  return xc(Mr(e));
}
function Sp(e, t) {
  var n, r, o, i;
  return _c(this, void 0, void 0, function* () {
    try {
      for (n = Sc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function K(e, t, n, r = 0, o = false) {
  let i = t.schedule(function () {
    (n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((e.add(i), !o)) return i;
}
function Nr(e, t = 0) {
  return w((n, r) => {
    n.subscribe(
      T(
        r,
        (o) => K(r, e, () => r.next(o), t),
        () => K(r, e, () => r.complete(), t),
        (o) => K(r, e, () => r.error(o), t),
      ),
    );
  });
}
function Sr(e, t = 0) {
  return w((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Ac(e, t) {
  return O(e).pipe(Sr(t), Nr(t));
}
function Rc(e, t) {
  return O(e).pipe(Sr(t), Nr(t));
}
function kc(e, t) {
  return new M((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Oc(e, t) {
  return new M((n) => {
    let r;
    return (
      K(n, t, () => {
        ((r = e[Cr]()),
          K(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            true,
          ));
      }),
      () => y(r?.return) && r.return()
    );
  });
}
function xr(e, t) {
  if (!e) throw new Error('Iterable cannot be null');
  return new M((n) => {
    K(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      K(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        true,
      );
    });
  });
}
function Lc(e, t) {
  return xr(Mr(e), t);
}
function Pc(e, t) {
  if (e != null) {
    if (Dr(e)) return Ac(e, t);
    if (Gt$2(e)) return kc(e, t);
    if (Ir(e)) return Rc(e, t);
    if (wr(e)) return xr(e, t);
    if (br(e)) return Oc(e, t);
    if (_r(e)) return Lc(e, t);
  }
  throw Tr(e);
}
function Ie(e, t) {
  return t ? Pc(e, t) : O(e);
}
function xp(...e) {
  let t = Ee$1(e);
  return Ie(e, t);
}
function Ap(e, t) {
  let n = y(e) ? e : () => e,
    r = (o) => o.error(n());
  return new M(r);
}
function Rp(e) {
  return !!e && (e instanceof M || (y(e.lift) && y(e.subscribe)));
}
var wn$1 = Ht$2(
  (e) =>
    function () {
      (e(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence'));
    },
);
function Fc(e) {
  return e instanceof Date && !isNaN(e);
}
function De$1(e, t) {
  return w((n, r) => {
    let o = 0;
    n.subscribe(
      T(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: kp } = Array;
function Op(e, t) {
  return kp(t) ? e(...t) : e(t);
}
function Ar(e) {
  return De$1((t) => Op(e, t));
}
var { isArray: Lp } = Array,
  { getPrototypeOf: Pp, prototype: Fp, keys: jp } = Object;
function jc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Lp(t)) return { args: t, keys: null };
    if (Vp(t)) {
      let n = jp(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Vp(e) {
  return e && typeof e == 'object' && Pp(e) === Fp;
}
function Vc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Hp(...e) {
  let t = Ee$1(e),
    n = Cc(e),
    { args: r, keys: o } = jc(e);
  if (r.length === 0) return Ie([], t);
  let i = new M(Bp(r, t, o ? (s) => Vc(o, s) : de));
  return n ? i.pipe(Ar(n)) : i;
}
function Bp(e, t, n = de) {
  return (r) => {
    Hc(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Hc(
            t,
            () => {
              let l = Ie(e[c], t),
                u = false;
              l.subscribe(
                T(
                  r,
                  (d) => {
                    ((i[c] = d), u || ((u = true), a--), a || r.next(n(i.slice())));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function Hc(e, t, n) {
  e ? K(n, e, t) : t();
}
function Bc(e, t, n, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = false,
    p = () => {
      d && !c.length && !l && t.complete();
    },
    f = (D) => (l < r ? h(D) : c.push(D)),
    h = (D) => {
      l++;
      let N = false;
      O(n(D, u++)).subscribe(
        T(
          t,
          (k) => {
            t.next(k);
          },
          () => {
            N = true;
          },
          void 0,
          () => {
            if (N)
              try {
                for (l--; c.length && l < r; ) {
                  let k = c.shift();
                  s ? K(t, s, () => h(k)) : h(k);
                }
                p();
              } catch (k) {
                t.error(k);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      T(t, f, () => {
        ((d = true), p());
      }),
    ),
    () => {}
  );
}
function ne$1(e, t, n = 1 / 0) {
  return y(t)
    ? ne$1((r, o) => De$1((i, s) => t(r, i, o, s))(O(e(r, o))), n)
    : (typeof t == 'number' && (n = t), w((r, o) => Bc(r, o, e, n)));
}
function Rr(e = 1 / 0) {
  return ne$1(de, e);
}
function $c() {
  return Rr(1);
}
function zt$2(...e) {
  return $c()(Ie(e, Ee$1(e)));
}
function $p(e) {
  return new M((t) => {
    O(e()).subscribe(t);
  });
}
var Up = ['addListener', 'removeListener'],
  qp = ['addEventListener', 'removeEventListener'],
  Wp = ['on', 'off'];
function Ti$2(e, t, n, r) {
  if ((y(n) && ((r = n), (n = void 0)), r)) return Ti$2(e, t, n).pipe(Ar(r));
  let [o, i] = Qp(e)
    ? qp.map((s) => (a) => e[s](t, a, n))
    : Gp(e)
      ? Up.map(Uc(e, t))
      : zp(e)
        ? Wp.map(Uc(e, t))
        : [];
  if (!o && Gt$2(e)) return ne$1((s) => Ti$2(s, t, n))(O(e));
  if (!o) throw new TypeError('Invalid event target');
  return new M((s) => {
    let a = (...c) => s.next(1 < c.length ? c : c[0]);
    return (o(a), () => i(a));
  });
}
function Uc(e, t) {
  return (n) => (r) => e[n](t, r);
}
function Gp(e) {
  return y(e.addListener) && y(e.removeListener);
}
function zp(e) {
  return y(e.on) && y(e.off);
}
function Qp(e) {
  return y(e.addEventListener) && y(e.removeEventListener);
}
function kr(e = 0, t, n = Tc) {
  let r = -1;
  return (
    t != null && (Er(t) ? (n = t) : (r = t)),
    new M((o) => {
      let i = Fc(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed || (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function Zp(...e) {
  let t = Ee$1(e),
    n = bc(e, 1 / 0),
    r = e;
  return r.length ? (r.length === 1 ? O(r[0]) : Rr(n)(Ie(r, t))) : Oe;
}
function Or(e, t) {
  return w((n, r) => {
    let o = 0;
    n.subscribe(T(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function qc(e) {
  return w((t, n) => {
    let r = null,
      o = !1,
      i;
    ((r = t.subscribe(
      T(n, void 0, void 0, (s) => {
        ((i = O(e(s, qc(e)(t)))), r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0));
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n)));
  });
}
function Wc(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      c = t,
      l = 0;
    i.subscribe(
      T(
        s,
        (u) => {
          let d = l++;
          ((c = a ? e(c, u, d) : ((a = true), u)), s.next(c));
        },
        o,
      ),
    );
  };
}
function Yp(e, t) {
  return y(t) ? ne$1(e, t, 1) : ne$1(e, 1);
}
function Gc(e) {
  return w((t, n) => {
    let r = !1;
    t.subscribe(
      T(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => {
          (r || n.next(e), n.complete());
        },
      ),
    );
  });
}
function dt$2(e) {
  return e <= 0
    ? () => Oe
    : w((t, n) => {
        let r = 0;
        t.subscribe(
          T(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function zc() {
  return w((e, t) => {
    e.subscribe(T(t, at$2));
  });
}
function Qc(e) {
  return De$1(() => e);
}
function Ci$2(e, t) {
  return t
    ? (n) => zt$2(t.pipe(dt$2(1), zc()), n.pipe(Ci$2(e)))
    : ne$1((n, r) => O(e(n, r)).pipe(dt$2(1), Qc(n)));
}
function Kp(e, t = Dn$1) {
  let n = kr(e, t);
  return Ci$2(() => n);
}
function Zc(e = Jp) {
  return w((t, n) => {
    let r = !1;
    t.subscribe(
      T(
        n,
        (o) => {
          ((r = !0), n.next(o));
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function Jp() {
  return new wn$1();
}
function Xp(e) {
  return w((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function eh(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(e ? Or((o, i) => e(o, i, r)) : de, dt$2(1), n ? Gc(t) : Zc(() => new wn$1()));
}
function th(e) {
  return e <= 0
    ? () => Oe
    : w((t, n) => {
        let r = [];
        t.subscribe(
          T(
            n,
            (o) => {
              (r.push(o), e < r.length && r.shift());
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function nh() {
  return w((e, t) => {
    let n,
      r = !1;
    e.subscribe(
      T(t, (o) => {
        let i = n;
        ((n = o), r && t.next([i, o]), (r = !0));
      }),
    );
  });
}
function rh(e) {
  let t = 1 / 0,
    n;
  return t <= 0
    ? () => Oe
    : w((r, o) => {
        let i = 0,
          s,
          a = () => {
            if ((s?.unsubscribe(), (s = null), n != null));
            else c();
          },
          c = () => {
            let l = !1;
            ((s = r.subscribe(
              T(o, void 0, () => {
                ++i < t ? (s ? a() : (l = !0)) : o.complete();
              }),
            )),
              l && a());
          };
        c();
      });
}
function oh(e, t) {
  return w(Wc(e, t, arguments.length >= 2, !0));
}
function ih(e) {
  return w((t, n) => {
    let r = !1,
      o = 0;
    t.subscribe(T(n, (i) => (r || (r = !e(i, o++))) && n.next(i)));
  });
}
function Yc(...e) {
  let t = Ee$1(e);
  return w((n, r) => {
    (t ? zt$2(e, n, t) : zt$2(e, n)).subscribe(r);
  });
}
function Kc(e, t) {
  return w((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      T(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          O(e(c, u)).subscribe(
            (o = T(
              r,
              (d) => r.next(t ? t(c, d, u, l++) : d),
              () => {
                ((o = null), a());
              },
            )),
          );
        },
        () => {
          ((s = !0), a());
        },
      ),
    );
  });
}
function Jc(e) {
  return w((t, n) => {
    (O(e).subscribe(T(n, () => n.complete(), at$2)), !n.closed && t.subscribe(n));
  });
}
function Xc(e, t, n) {
  let r = y(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? w((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          T(
            i,
            (c) => {
              var l;
              ((l = r.next) === null || l === void 0 || l.call(r, c), i.next(c));
            },
            () => {
              var c;
              ((a = !1), (c = r.complete) === null || c === void 0 || c.call(r), i.complete());
            },
            (c) => {
              var l;
              ((a = !1), (l = r.error) === null || l === void 0 || l.call(r, c), i.error(c));
            },
            () => {
              var c, l;
              (a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r));
            },
          ),
        );
      })
    : de;
}
function sh(e = Dn$1) {
  return w((t, n) => {
    let r = e.now();
    t.subscribe(
      T(n, (o) => {
        let i = e.now(),
          s = i - r;
        ((r = i), n.next(new bi$2(o, s)));
      }),
    );
  });
}
var bi$2 = class bi {
  constructor(t, n) {
    ((this.value = t), (this.interval = n));
  }
};
var Vi$2 = 'https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss',
  b$1 = class b extends Error {
    code;
    constructor(t, n) {
      (super(_n$1(t, n)), (this.code = t));
    }
  };
function ah(e) {
  return `NG0${Math.abs(e)}`;
}
function _n$1(e, t) {
  return `${ah(e)}${t ? ': ' + t : ''}`;
}
function S(e) {
  for (let t in e) if (e[t] === S) return t;
  throw Error('');
}
function Nn$2(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return `[${e.map(Nn$2).join(', ')}]`;
  if (e == null) return '' + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return '' + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function Br(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || '';
}
var ch = S({ __forward_ref__: S });
function $r(e) {
  return ((e.__forward_ref__ = $r), e);
}
function G$1(e) {
  return ol(e) ? e() : e;
}
function ol(e) {
  return typeof e == 'function' && e.hasOwnProperty(ch) && e.__forward_ref__ === $r;
}
function oe(e) {
  return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
}
function il(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Sn$1(e) {
  return uh(e, Ur);
}
function lh(e) {
  return Sn$1(e) !== null;
}
function uh(e, t) {
  return (e.hasOwnProperty(t) && e[t]) || null;
}
function dh(e) {
  let t = e?.[Ur] ?? null;
  return t || null;
}
function _i$2(e) {
  return e && e.hasOwnProperty(Pr) ? e[Pr] : null;
}
var Ur = S({ ɵprov: S }),
  Pr = S({ ɵinj: S }),
  x$1 = class x {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(t, n) {
      ((this._desc = t),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = oe({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            })));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Hi$2(e) {
  return e && !!e.ɵproviders;
}
var Bi$2 = S({ ɵcmp: S }),
  $i$2 = S({ ɵdir: S }),
  Ui$2 = S({ ɵpipe: S }),
  qi$2 = S({ ɵmod: S }),
  Ni$2 = S({ ɵfac: S }),
  mt$1 = S({ __NG_ELEMENT_ID__: S }),
  el = S({ __NG_ENV_ID__: S });
function sl(e) {
  return (qr(e), e[qi$2] || null);
}
function yt$1(e) {
  return (qr(e), e[Bi$2] || null);
}
function Wi$2(e) {
  return (qr(e), e[$i$2] || null);
}
function al(e) {
  return (qr(e), e[Ui$2] || null);
}
function qr(e, t) {
  if (e == null) throw new b$1(-919, false);
}
function Gi$2(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
var cl = S({ ngErrorCode: S }),
  fh = S({ ngErrorMessage: S });
S({ ngTokenPath: S });
function zi$2(e, t) {
  return ll('', -200);
}
function Wr(e, t) {
  throw new b$1(-201, false);
}
function ll(e, t, n) {
  let r = new b$1(t, e);
  return ((r[cl] = t), (r[fh] = e), r);
}
function hh(e) {
  return e[cl];
}
var Si$2;
function ul() {
  return Si$2;
}
function J$1(e) {
  let t = Si$2;
  return ((Si$2 = e), t);
}
function Qi$2(e, t, n) {
  let r = Sn$1(e);
  if (r && r.providedIn == 'root') return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & 8) return null;
  if (t !== void 0) return t;
  Wr();
}
var gh = {},
  ft$1 = gh,
  mh = '__NG_DI_FLAG__',
  xi$2 = class xi {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = pt$2(n) || 0;
      try {
        return this.injector.get(t, r & 8 ? null : ft$1, r);
      } catch (o) {
        if (Vt$2(o)) return o;
        throw o;
      }
    }
  };
function yh(e, t = 0) {
  let n = ur$1();
  if (n === void 0) throw new b$1(-203, false);
  if (n === null) return Qi$2(e, void 0, t);
  {
    let r = vh(t),
      o = n.retrieve(e, r);
    if (Vt$2(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function we$1(e, t = 0) {
  return (ul() || yh)(G$1(e), t);
}
function E(e, t) {
  return we$1(e, pt$2(t));
}
function pt$2(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function vh(e) {
  return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) };
}
function Ai$2(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = G$1(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new b$1(900, false);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Eh(a);
        typeof c == 'number' ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(we$1(o, i));
    } else t.push(we$1(r));
  }
  return t;
}
function Eh(e) {
  return e[mh];
}
function Zt$1(e, t) {
  let n = e.hasOwnProperty(Ni$2);
  return n ? e[Ni$2] : null;
}
function dl(e, t, n) {
  if (e.length !== t.length) return false;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return false;
  }
  return true;
}
function fl(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Gr(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Gr(n, t) : t(n)));
}
function Zi$2(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function xn$2(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function pl(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function hl(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) (e.push(r, e[0]), (e[0] = n));
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      ((e[o] = e[i]), o--);
    }
    ((e[t] = n), (e[t + 1] = r));
  }
}
function zr(e, t, n) {
  let r = Kt$1(e, t);
  return (r >= 0 ? (e[r | 1] = n) : ((r = ~r), hl(e, r, t, n)), r);
}
function Qr(e, t) {
  let n = Kt$1(e, t);
  if (n >= 0) return e[n | 1];
}
function Kt$1(e, t) {
  return Ih(e, t, 1);
}
function Ih(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var vt$1 = {},
  Z$1 = [],
  Et$1 = new x$1(''),
  An$1 = new x$1('', -1),
  Yi$2 = new x$1(''),
  Yt = class {
    get(t, n = ft$1) {
      if (n === ft$1) {
        let o = ll('', -201);
        throw ((o.name = '\u0275NotFound'), o);
      }
      return n;
    }
  };
function Ki$2(e) {
  return { ɵproviders: e };
}
function gl(...e) {
  return { ɵproviders: Ji$2(true, e), ɵfromNgModule: true };
}
function Ji$2(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Gr(t, (s) => {
      let a = s;
      Fr$1(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && ml(o, i),
    n
  );
}
function ml(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Xi$2(o, (i) => {
      t(i, r);
    });
  }
}
function Fr$1(e, t, n, r) {
  if (((e = G$1(e)), !e)) return false;
  let o = null,
    i = _i$2(e),
    s = !i && yt$1(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = _i$2(c)), i)) o = c;
    else return false;
  } else {
    if (s && !s.standalone) return false;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return false;
    if ((r.add(o), s.dependencies)) {
      let c = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let l of c) Fr$1(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      (Gr(i.imports, (u) => {
        Fr$1(u, t, n, r) && ((l ||= []), l.push(u));
      }),
        l !== void 0 && ml(l, t));
    }
    if (!a) {
      let l = Zt$1(o) || (() => new o());
      (t({ provide: o, useFactory: l, deps: Z$1 }, o),
        t({ provide: Yi$2, useValue: o, multi: true }, o),
        t({ provide: Et$1, useValue: () => we$1(o), multi: true }, o));
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      Xi$2(c, (u) => {
        t(u, l);
      });
    }
  } else return false;
  return o !== e && e.providers !== void 0;
}
function Xi$2(e, t) {
  for (let n of e) (Hi$2(n) && (n = n.ɵproviders), Array.isArray(n) ? Xi$2(n, t) : t(n));
}
var Dh = S({ provide: String, useValue: S });
function yl(e) {
  return e !== null && typeof e == 'object' && Dh in e;
}
function wh(e) {
  return !!(e && e.useExisting);
}
function Th(e) {
  return !!(e && e.useFactory);
}
function ht$2(e) {
  return typeof e == 'function';
}
function vl(e) {
  return !!e.useClass;
}
var es$1 = new x$1(''),
  Lr = {},
  tl = {},
  Mi$2;
function Rn$2() {
  return (Mi$2 === void 0 && (Mi$2 = new Yt()), Mi$2);
}
var re = class {},
  gt$1 = class gt extends re {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = false;
    injectorDefTypes;
    constructor(t, n, r, o) {
      (super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        ki$2(t, (s) => this.processProvider(s)),
        this.records.set(An$1, Qt(void 0, this)),
        o.has('environment') && this.records.set(re, Qt(void 0, this)));
      let i = this.records.get(es$1);
      (i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Yi$2, Z$1, { self: true }))));
    }
    retrieve(t, n) {
      let r = pt$2(n) || 0;
      try {
        return this.get(t, ft$1, r);
      } catch (o) {
        if (Vt$2(o)) return o;
        throw o;
      }
    }
    destroy() {
      (Tn$1(this), (this._destroyed = true));
      let t = m(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        (this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), m(t));
      }
    }
    onDestroy(t) {
      return (Tn$1(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t));
    }
    runInContext(t) {
      Tn$1(this);
      let n = ve(this),
        r = J$1(void 0);
      try {
        return t();
      } finally {
        (ve(n), J$1(r));
      }
    }
    get(t, n = ft$1, r) {
      if ((Tn$1(this), t.hasOwnProperty(el))) return t[el](this);
      let o = pt$2(r),
        s = ve(this),
        a = J$1(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(t);
          if (l === void 0) {
            let u = Nh(t) && Sn$1(t);
            (u && this.injectableDefInScope(u) ? (l = Qt(Ri$2(t), Lr)) : (l = null),
              this.records.set(t, l));
          }
          if (l != null) return this.hydrate(t, l, o);
        }
        let c = o & 2 ? Rn$2() : this.parent;
        return ((n = o & 8 && n === ft$1 ? null : n), c.get(t, n));
      } catch (c) {
        let l = hh(c);
        throw l === -200 || l === -201 ? new b$1(l, null) : c;
      } finally {
        (J$1(a), ve(s));
      }
    }
    resolveInjectorInitializers() {
      let t = m(null),
        n = ve(this),
        r = J$1(void 0);
      try {
        let i = this.get(Et$1, Z$1, { self: !0 });
        for (let s of i) s();
      } finally {
        (ve(n), J$1(r), m(t));
      }
    }
    toString() {
      return 'R3Injector[...]';
    }
    processProvider(t) {
      t = G$1(t);
      let n = ht$2(t) ? t : G$1(t && t.provide),
        r = bh(t);
      if (!ht$2(t) && t.multi === true) {
        let o = this.records.get(n);
        (o ||
          ((o = Qt(void 0, Lr, true)), (o.factory = () => Ai$2(o.multi)), this.records.set(n, o)),
          (n = t),
          o.multi.push(t));
      }
      this.records.set(n, r);
    }
    hydrate(t, n, r) {
      let o = m(null);
      try {
        if (n.value === tl) throw zi$2('');
        return (
          n.value === Lr && ((n.value = tl), (n.value = n.factory(void 0, r))),
          typeof n.value == 'object' &&
            n.value &&
            _h(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        m(o);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return false;
      let n = G$1(t.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Ri$2(e) {
  let t = Sn$1(e),
    n = t !== null ? t.factory : Zt$1(e);
  if (n !== null) return n;
  if (e instanceof x$1) throw new b$1(-204, false);
  if (e instanceof Function) return Ch(e);
  throw new b$1(-204, false);
}
function Ch(e) {
  if (e.length > 0) throw new b$1(-204, false);
  let n = dh(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function bh(e) {
  if (yl(e)) return Qt(void 0, e.useValue);
  {
    let t = ts$1(e);
    return Qt(t, Lr);
  }
}
function ts$1(e, t, n) {
  let r;
  if (ht$2(e)) {
    let o = G$1(e);
    return Zt$1(o) || Ri$2(o);
  } else if (yl(e)) r = () => G$1(e.useValue);
  else if (Th(e)) r = () => e.useFactory(...Ai$2(e.deps || []));
  else if (wh(e)) r = (o, i) => we$1(G$1(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = G$1(e && (e.useClass || e.provide));
    if (Mh(e)) r = () => new o(...Ai$2(e.deps));
    else return Zt$1(o) || Ri$2(o);
  }
  return r;
}
function Tn$1(e) {
  if (e.destroyed) throw new b$1(-205, false);
}
function Qt(e, t, n = false) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Mh(e) {
  return !!e.deps;
}
function _h(e) {
  return e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function';
}
function Nh(e) {
  return typeof e == 'function' || (typeof e == 'object' && e.ngMetadataName === 'InjectionToken');
}
function ki$2(e, t) {
  for (let n of e) Array.isArray(n) ? ki$2(n, t) : n && Hi$2(n) ? ki$2(n.ɵproviders, t) : t(n);
}
function Zr(e, t) {
  let n;
  e instanceof gt$1 ? (Tn$1(e), (n = e)) : (n = new xi$2(e));
  let o = ve(n),
    i = J$1(void 0);
  try {
    return t();
  } finally {
    (ve(o), J$1(i));
  }
}
function El() {
  return ul() !== void 0 || ur$1() != null;
}
var pe = 0,
  g$1 = 1,
  I = 2,
  U$2 = 3,
  ie$1 = 4,
  z = 5,
  It$1 = 6,
  Jt = 7,
  V = 8,
  Ce = 9,
  be = 10,
  R = 11,
  Xt = 12,
  ns$1 = 13,
  Qe$1 = 14,
  Y = 15,
  Ze$1 = 16,
  Dt$2 = 17,
  Me = 18,
  _e = 19,
  rs$1 = 20,
  Pe = 21,
  Yr = 22,
  ze$2 = 23,
  X$1 = 24,
  wt$1 = 25,
  Ne$1 = 26,
  L = 27,
  Il = 1,
  os$1 = 6,
  Ye = 7,
  kn$1 = 8,
  Tt$1 = 9,
  F = 10;
function Ve$1(e) {
  return Array.isArray(e) && typeof e[Il] == 'object';
}
function se$1(e) {
  return Array.isArray(e) && e[Il] === true;
}
function is$1(e) {
  return (e.flags & 4) !== 0;
}
function He$2(e) {
  return e.componentOffset > -1;
}
function en(e) {
  return (e.flags & 1) === 1;
}
function Ke(e) {
  return !!e.template;
}
function tn(e) {
  return (e[I] & 512) !== 0;
}
function Ct$1(e) {
  return (e[I] & 256) === 256;
}
var ss$1 = 'svg',
  Dl = 'math';
function ae(e) {
  for (; Array.isArray(e); ) e = e[pe];
  return e;
}
function as$1(e, t) {
  return ae(t[e]);
}
function he$1(e, t) {
  return ae(t[e.index]);
}
function Kr(e, t) {
  return e.data[t];
}
function cs$1(e, t) {
  return e[t];
}
function Jr(e, t, n, r) {
  (n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)), (t[n] = r));
}
function ce(e, t) {
  let n = t[e];
  return Ve$1(n) ? n : n[pe];
}
function Xr(e) {
  return (e[I] & 128) === 128;
}
function wl(e) {
  return se$1(e[U$2]);
}
function le(e, t) {
  return t == null ? null : e[t];
}
function ls$1(e) {
  e[Dt$2] = 0;
}
function us$1(e) {
  e[I] & 1024 || ((e[I] |= 1024), Xr(e) && bt$2(e));
}
function Tl(e, t) {
  for (; e > 0; ) ((t = t[Qe$1]), e--);
  return t;
}
function On$2(e) {
  return !!(e[I] & 9216 || e[X$1]?.dirty);
}
function eo$1(e) {
  (e[be].changeDetectionScheduler?.notify(8), e[I] & 64 && (e[I] |= 1024), On$2(e) && bt$2(e));
}
function bt$2(e) {
  e[be].changeDetectionScheduler?.notify(0);
  let t = Fe$1(e);
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !Xr(t))); ) t = Fe$1(t);
}
function to$1(e, t) {
  if (Ct$1(e)) throw new b$1(911, false);
  (e[Pe] === null && (e[Pe] = []), e[Pe].push(t));
}
function Cl(e, t) {
  if (e[Pe] === null) return;
  let n = e[Pe].indexOf(t);
  n !== -1 && e[Pe].splice(n, 1);
}
function Fe$1(e) {
  let t = e[U$2];
  return se$1(t) ? t[U$2] : t;
}
function ds$1(e) {
  return (e[Jt] ??= []);
}
function fs$1(e) {
  return (e.cleanup ??= []);
}
function bl(e, t, n, r) {
  let o = ds$1(t);
  (o.push(n), e.firstCreatePass && fs$1(e).push(r, o.length - 1));
}
var C = { lFrame: jl(null), bindingsEnabled: true, skipHydrationRootTNode: null };
var Oi$2 = false;
function Ml() {
  return C.lFrame.elementDepthCount;
}
function _l() {
  C.lFrame.elementDepthCount++;
}
function ps$1() {
  C.lFrame.elementDepthCount--;
}
function no$1() {
  return C.bindingsEnabled;
}
function hs$1() {
  return C.skipHydrationRootTNode !== null;
}
function gs(e) {
  return C.skipHydrationRootTNode === e;
}
function ms$1() {
  C.skipHydrationRootTNode = null;
}
function v() {
  return C.lFrame.lView;
}
function P$1() {
  return C.lFrame.tView;
}
function Nl(e) {
  return ((C.lFrame.contextLView = e), e[V]);
}
function Sl(e) {
  return ((C.lFrame.contextLView = null), e);
}
function q() {
  let e = ys$1();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ys$1() {
  return C.lFrame.currentTNode;
}
function xl() {
  let e = C.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Mt$1(e, t) {
  let n = C.lFrame;
  ((n.currentTNode = e), (n.isParent = t));
}
function vs$1() {
  return C.lFrame.isParent;
}
function Es$1() {
  C.lFrame.isParent = false;
}
function Is$1() {
  return C.lFrame.contextLView;
}
function Ds$1() {
  return Oi$2;
}
function Cn$1(e) {
  let t = Oi$2;
  return ((Oi$2 = e), t);
}
function nn() {
  let e = C.lFrame,
    t = e.bindingRootIndex;
  return (t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t);
}
function Al(e) {
  return (C.lFrame.bindingIndex = e);
}
function Je$2() {
  return C.lFrame.bindingIndex++;
}
function ws$1(e) {
  let t = C.lFrame,
    n = t.bindingIndex;
  return ((t.bindingIndex = t.bindingIndex + e), n);
}
function Rl() {
  return C.lFrame.inI18n;
}
function kl(e, t) {
  let n = C.lFrame;
  ((n.bindingIndex = n.bindingRootIndex = e), ro$1(t));
}
function Ol() {
  return C.lFrame.currentDirectiveIndex;
}
function ro$1(e) {
  C.lFrame.currentDirectiveIndex = e;
}
function Ll(e) {
  let t = C.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function Pl() {
  return C.lFrame.currentQueryIndex;
}
function oo$1(e) {
  C.lFrame.currentQueryIndex = e;
}
function Sh(e) {
  let t = e[g$1];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[z] : null;
}
function Ts$1(e, t, n) {
  if (n & 4) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & 1); )
      if (((o = Sh(i)), o === null || ((i = i[Qe$1]), o.type & 10))) break;
    if (o === null) return false;
    ((t = o), (e = i));
  }
  let r = (C.lFrame = Fl());
  return ((r.currentTNode = t), (r.lView = e), true);
}
function io$1(e) {
  let t = Fl(),
    n = e[g$1];
  ((C.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = false));
}
function Fl() {
  let e = C.lFrame,
    t = e === null ? null : e.child;
  return t === null ? jl(e) : t;
}
function jl(e) {
  let t = {
    currentTNode: null,
    isParent: true,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: false,
  };
  return (e !== null && (e.child = t), t);
}
function Vl() {
  let e = C.lFrame;
  return ((C.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e);
}
var Cs$1 = Vl;
function so$1() {
  let e = Vl();
  ((e.isParent = true),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0));
}
function Hl(e) {
  return (C.lFrame.contextLView = Tl(e, C.lFrame.contextLView))[V];
}
function Se$1() {
  return C.lFrame.selectedIndex;
}
function Xe$1(e) {
  C.lFrame.selectedIndex = e;
}
function Ln$2() {
  let e = C.lFrame;
  return Kr(e.tView, e.selectedIndex);
}
function Bl() {
  C.lFrame.currentNamespace = ss$1;
}
function bs$1() {
  return C.lFrame.currentNamespace;
}
var $l = true;
function ao$1() {
  return $l;
}
function Pn$2(e) {
  $l = e;
}
function Li$2(e, t = null, n = null, r) {
  let o = Ms$1(e, t, n);
  return (o.resolveInjectorInitializers(), o);
}
function Ms$1(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Z$1, gl(e)];
  return new gt$1(i, t || Rn$2(), null, o);
}
var fe$1 = class e {
    static THROW_IF_NOT_FOUND = ft$1;
    static NULL = new Yt();
    static create(t, n) {
      if (Array.isArray(t)) return Li$2({ name: '' }, n, t);
      {
        let r = t.name ?? '';
        return Li$2({ name: r }, t.parent, t.providers);
      }
    }
    static ɵprov = oe({ token: e, providedIn: 'any', factory: () => we$1(An$1) });
    static __NG_ELEMENT_ID__ = -1;
  },
  co$1 = new x$1(''),
  Be$2 = (() => {
    class e {
      static __NG_ELEMENT_ID__ = xh;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  jr = class extends Be$2 {
    _lView;
    constructor(t) {
      (super(), (this._lView = t));
    }
    get destroyed() {
      return Ct$1(this._lView);
    }
    onDestroy(t) {
      let n = this._lView;
      return (to$1(n, t), () => Cl(n, t));
    }
  };
function xh() {
  return new jr(v());
}
var _s$1 = false,
  Ul = new x$1(''),
  _t$1 = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      destroyed = false;
      pendingTask = new En$1(false);
      debugTaskTracker = E(Ul, { optional: true });
      get hasPendingTasks() {
        return this.destroyed ? false : this.pendingTask.value;
      }
      get hasPendingTasksObservable() {
        return this.destroyed
          ? new M((n) => {
              (n.next(false), n.complete());
            })
          : this.pendingTask;
      }
      add() {
        !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(true);
        let n = this.taskId++;
        return (this.pendingTasks.add(n), this.debugTaskTracker?.add(n), n);
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        (this.pendingTasks.delete(n),
          this.debugTaskTracker?.remove(n),
          this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(false));
      }
      ngOnDestroy() {
        (this.pendingTasks.clear(),
          this.hasPendingTasks && this.pendingTask.next(false),
          (this.destroyed = true),
          this.pendingTask.unsubscribe());
      }
      static ɵprov = oe({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Pi$2 = class Pi extends ke$1 {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = false) {
      (super(),
        (this.__isAsync = t),
        El() &&
          ((this.destroyRef = E(Be$2, { optional: true }) ?? void 0),
          (this.pendingTasks = E(_t$1, { optional: true }) ?? void 0)));
    }
    emit(t) {
      let n = m(null);
      try {
        super.next(t);
      } finally {
        m(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == 'object') {
        let c = t;
        ((o = c.next?.bind(c)), (i = c.error?.bind(c)), (s = c.complete?.bind(c)));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return (t instanceof $ && t.add(a), a);
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            t(n);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  Le$1 = Pi$2;
function Vr(...e) {}
function Ns$1(e) {
  let t, n;
  function r() {
    e = Vr;
    try {
      (n !== void 0 && typeof cancelAnimationFrame == 'function' && cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t));
    } catch (o) {}
  }
  return (
    (t = setTimeout(() => {
      (e(), r());
    })),
    typeof requestAnimationFrame == 'function' &&
      (n = requestAnimationFrame(() => {
        (e(), r());
      })),
    () => r()
  );
}
function ql(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Vr;
    }
  );
}
var Ss$1 = 'isAngularZone',
  bn$1 = Ss$1 + '_ID',
  Ah = 0,
  W = class e {
    hasPendingMacrotasks = false;
    hasPendingMicrotasks = false;
    isStable = true;
    onUnstable = new Le$1(false);
    onMicrotaskEmpty = new Le$1(false);
    onStable = new Le$1(false);
    onError = new Le$1(false);
    constructor(t) {
      let {
        enableLongStackTrace: n = false,
        shouldCoalesceEventChangeDetection: r = false,
        shouldCoalesceRunChangeDetection: o = false,
        scheduleInRootZone: i = _s$1,
      } = t;
      if (typeof Zone > 'u') throw new b$1(908, false);
      Zone.assertZonePatched();
      let s = this;
      ((s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = false),
        (s.scheduleInRootZone = i),
        Oh(s));
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(Ss$1) === true;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new b$1(909, false);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new b$1(909, false);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, Rh, Vr, Vr);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Rh = {};
function xs$1(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      (e._nesting++, e.onMicrotaskEmpty.emit(null));
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = true;
        }
    }
}
function kh(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = true;
  function t() {
    Ns$1(() => {
      ((e.callbackScheduled = false),
        Fi$2(e),
        (e.isCheckStableRunning = true),
        xs$1(e),
        (e.isCheckStableRunning = false));
    });
  }
  (e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Fi$2(e));
}
function Oh(e) {
  let t = () => {
      kh(e);
    },
    n = Ah++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [Ss$1]: true, [bn$1]: n, [bn$1 + n]: true },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (Lh(c)) return r.invokeTask(i, s, a, c);
      try {
        return (nl(e), r.invokeTask(i, s, a, c));
      } finally {
        (((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          rl(e));
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return (nl(e), r.invoke(i, s, a, c, l));
      } finally {
        (e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Ph(c) && t(), rl(e));
      }
    },
    onHasTask: (r, o, i, s) => {
      (r.hasTask(i, s),
        o === i &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), Fi$2(e), xs$1(e))
            : s.change == 'macroTask' && (e.hasPendingMacrotasks = s.macroTask)));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s),
      e.runOutsideAngular(() => e.onError.emit(s)),
      false
    ),
  });
}
function Fi$2(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === true)
    ? (e.hasPendingMicrotasks = true)
    : (e.hasPendingMicrotasks = false);
}
function nl(e) {
  (e._nesting++, e.isStable && ((e.isStable = false), e.onUnstable.emit(null)));
}
function rl(e) {
  (e._nesting--, xs$1(e));
}
var Mn$2 = class Mn {
  hasPendingMicrotasks = false;
  hasPendingMacrotasks = false;
  isStable = true;
  onUnstable = new Le$1();
  onMicrotaskEmpty = new Le$1();
  onStable = new Le$1();
  onError = new Le$1();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function Lh(e) {
  return Wl(e, '__ignore_ng_zone__');
}
function Ph(e) {
  return Wl(e, '__scheduler_tick__');
}
function Wl(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? false : e[0]?.data?.[t] === true;
}
var je$1 = class je {
    _console = console;
    handleError(t) {
      this._console.error('ERROR', t);
    }
  },
  Nt$2 = new x$1('', {
    factory: () => {
      let e = E(W),
        t = E(re),
        n;
      return (r) => {
        e.runOutsideAngular(() => {
          t.destroyed && !n
            ? setTimeout(() => {
                throw r;
              })
            : ((n ??= t.get(je$1)), n.handleError(r));
        });
      };
    },
  }),
  Gl = {
    provide: Et$1,
    useValue: () => {
      E(je$1, { optional: true });
    },
    multi: true,
  };
function lo(e, t) {
  let [n, r, o] = li$2(e, t?.equal),
    i = n;
  i[j];
  return ((i.set = r), (i.update = o), (i.asReadonly = Fn$2.bind(i)), i);
}
function Fn$2() {
  let e = this[j];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    ((t[j] = e), (e.readonlyFn = t));
  }
  return e.readonlyFn;
}
var zl = new x$1('', { factory: () => Fh }),
  Fh = 'ng';
var Ql = new x$1(''),
  jh = new x$1('', { providedIn: 'platform', factory: () => 'unknown' });
var Vh = new x$1('', {
  factory: () => E(co$1).body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
});
var rn = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      ((this.view = n), (this.node = r));
    }
    static __NG_ELEMENT_ID__ = Hh;
  }
  return e;
})();
function Hh() {
  return new rn(v(), q());
}
var Te$2 = class Te {},
  on = new x$1('', { factory: () => true });
var uo$1 = new x$1(''),
  fo$1 = (() => {
    class e {
      static ɵprov = oe({ token: e, providedIn: 'root', factory: () => new ji$2() });
    }
    return e;
  })(),
  ji$2 = class ji {
    dirtyEffectCount = 0;
    queues = new Map();
    add(t) {
      (this.enqueue(t), this.schedule(t));
    }
    schedule(t) {
      t.dirty && this.dirtyEffectCount++;
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), t.dirty && this.dirtyEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || r.add(t);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let t = false;
        for (let [n, r] of this.queues)
          n === null ? (t ||= this.flushQueue(r)) : (t ||= n.run(() => this.flushQueue(r)));
        t || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(t) {
      let n = false;
      for (let r of t) r.dirty && (this.dirtyEffectCount--, (n = true), r.run());
      return n;
    }
  },
  Hr = class {
    [j];
    constructor(t) {
      this[j] = t;
    }
    destroy() {
      this[j].destroy();
    }
  };
function Zl(e, t) {
  let n = E(fe$1),
    r = n.get(Be$2),
    o,
    i = n.get(rn, null, { optional: true }),
    s = n.get(Te$2);
  return (
    i !== null
      ? ((o = Uh(i.view, s, e)), r instanceof jr && r._lView === i.view && (r = null))
      : (o = qh(e, n.get(fo$1), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFns = [r.onDestroy(() => o.destroy())]),
    new Hr(o)
  );
}
var Yl = B$1(H({}, ui$2), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFns: null,
    run() {
      let e = Cn$1(false);
      try {
        di$2(this);
      } finally {
        Cn$1(e);
      }
    },
    cleanup() {
      if (!this.cleanupFns?.length) return;
      let e = m(null);
      try {
        for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
      } finally {
        ((this.cleanupFns = []), m(e));
      }
    },
  }),
  Bh = B$1(H({}, Yl), {
    consumerMarkedDirty() {
      (this.scheduler.schedule(this), this.notifier.notify(12));
    },
    destroy() {
      if ((We(this), this.onDestroyFns !== null)) for (let e of this.onDestroyFns) e();
      (this.cleanup(), this.scheduler.remove(this));
    },
  }),
  $h = B$1(H({}, Yl), {
    consumerMarkedDirty() {
      ((this.view[I] |= 8192), bt$2(this.view), this.notifier.notify(13));
    },
    destroy() {
      if ((We(this), this.onDestroyFns !== null)) for (let e of this.onDestroyFns) e();
      (this.cleanup(), this.view[ze$2]?.delete(this));
    },
  });
function Uh(e, t, n) {
  let r = Object.create($h);
  return (
    (r.view = e),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    (r.notifier = t),
    (r.fn = Kl(r, n)),
    (e[ze$2] ??= new Set()),
    e[ze$2].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function qh(e, t, n) {
  let r = Object.create(Bh);
  return (
    (r.fn = Kl(r, e)),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < 'u' ? Zone.current : null),
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
  );
}
function Kl(e, t) {
  return () => {
    t((n) => (e.cleanupFns ??= []).push(n));
  };
}
function po$1(e) {
  return typeof e == 'function' && e[j] !== void 0;
}
function ho$1(e) {
  return po$1(e) && typeof e.set == 'function';
}
function Vo$1(e) {
  return { toString: e }.toString();
}
var _ = (function (e) {
    return (
      (e[(e.TemplateCreateStart = 0)] = 'TemplateCreateStart'),
      (e[(e.TemplateCreateEnd = 1)] = 'TemplateCreateEnd'),
      (e[(e.TemplateUpdateStart = 2)] = 'TemplateUpdateStart'),
      (e[(e.TemplateUpdateEnd = 3)] = 'TemplateUpdateEnd'),
      (e[(e.LifecycleHookStart = 4)] = 'LifecycleHookStart'),
      (e[(e.LifecycleHookEnd = 5)] = 'LifecycleHookEnd'),
      (e[(e.OutputStart = 6)] = 'OutputStart'),
      (e[(e.OutputEnd = 7)] = 'OutputEnd'),
      (e[(e.BootstrapApplicationStart = 8)] = 'BootstrapApplicationStart'),
      (e[(e.BootstrapApplicationEnd = 9)] = 'BootstrapApplicationEnd'),
      (e[(e.BootstrapComponentStart = 10)] = 'BootstrapComponentStart'),
      (e[(e.BootstrapComponentEnd = 11)] = 'BootstrapComponentEnd'),
      (e[(e.ChangeDetectionStart = 12)] = 'ChangeDetectionStart'),
      (e[(e.ChangeDetectionEnd = 13)] = 'ChangeDetectionEnd'),
      (e[(e.ChangeDetectionSyncStart = 14)] = 'ChangeDetectionSyncStart'),
      (e[(e.ChangeDetectionSyncEnd = 15)] = 'ChangeDetectionSyncEnd'),
      (e[(e.AfterRenderHooksStart = 16)] = 'AfterRenderHooksStart'),
      (e[(e.AfterRenderHooksEnd = 17)] = 'AfterRenderHooksEnd'),
      (e[(e.ComponentStart = 18)] = 'ComponentStart'),
      (e[(e.ComponentEnd = 19)] = 'ComponentEnd'),
      (e[(e.DeferBlockStateStart = 20)] = 'DeferBlockStateStart'),
      (e[(e.DeferBlockStateEnd = 21)] = 'DeferBlockStateEnd'),
      (e[(e.DynamicComponentStart = 22)] = 'DynamicComponentStart'),
      (e[(e.DynamicComponentEnd = 23)] = 'DynamicComponentEnd'),
      (e[(e.HostBindingsUpdateStart = 24)] = 'HostBindingsUpdateStart'),
      (e[(e.HostBindingsUpdateEnd = 25)] = 'HostBindingsUpdateEnd'),
      e
    );
  })(_ || {}),
  Do$1 = class Do {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
      ((this.previousValue = t), (this.currentValue = n), (this.firstChange = r));
    }
    isFirstChange() {
      return this.firstChange;
    }
  };
function Su(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var xu = null,
  rg = (() => {
    xu = Jl;
    let e = () => Jl;
    return ((e.ngInherit = true), e);
  })();
function og() {
  return xu;
}
function Jl(e) {
  return (e.type.prototype.ngOnChanges && (e.setInput = sg), ig);
}
function ig() {
  let e = Au(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === vt$1) e.previous = t;
    else for (let r in t) n[r] = t[r];
    ((e.current = null), this.ngOnChanges(t));
  }
}
function sg(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Au(e) || ag(e, { previous: vt$1, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  ((a[i] = new Do$1(l && l.currentValue, n, c === vt$1)), Su(e, t, o, n));
}
var Hs = '__ngSimpleChanges__';
function Au(e) {
  return (Object.hasOwn(e, Hs) && e[Hs]) || null;
}
function ag(e, t) {
  return (e[Hs] = t);
}
var Xl = [];
var A = function (e, t = null, n) {
  for (let r = 0; r < Xl.length; r++) {
    let o = Xl[r];
    o(e, t, n);
  }
};
function cg(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = og()(t);
    ((n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s));
  }
  (o && (n.preOrderHooks ??= []).push(0 - e, o),
    i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)));
}
function Ru(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    (s && (e.contentHooks ??= []).push(-n, s),
      a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u));
  }
}
function mo$1(e, t, n) {
  ku(e, t, 3, n);
}
function yo$1(e, t, n, r) {
  (e[I] & 3) === n && ku(e, t, n, r);
}
function As$1(e, t) {
  let n = e[I];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[I] = n));
}
function ku(e, t, n, r) {
  let o = r !== void 0 ? e[Dt$2] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == 'number') {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      (t[c] < 0 && (e[Dt$2] += 65536),
        (a < i || i == -1) && (lg(e, n, t, c), (e[Dt$2] = (e[Dt$2] & 4294901760) + c + 2)),
        c++);
}
function eu(e, t) {
  A(_.LifecycleHookStart, e, t);
  let n = m(null);
  try {
    t.call(e);
  } finally {
    (m(n), A(_.LifecycleHookEnd, e, t));
  }
}
function lg(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o ? e[I] >> 14 < e[Dt$2] >> 16 && (e[I] & 3) === t && ((e[I] += 16384), eu(a, i)) : eu(a, i);
}
var an = -1,
  St$1 = class St {
    factory;
    name;
    injectImpl;
    resolving = false;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, o) {
      ((this.factory = t), (this.name = o), (this.canSeeViewProviders = n), (this.injectImpl = r));
    }
  };
function ug(e) {
  return (e.flags & 8) !== 0;
}
function dg(e) {
  return (e.flags & 16) !== 0;
}
function fg(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == 'number') {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      (hg(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++);
    }
  }
  return r;
}
function pg(e) {
  return e === 3 || e === 4 || e === 6;
}
function hg(e) {
  return e.charCodeAt(0) === 64;
}
function Ho$1(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == 'number'
          ? (n = o)
          : n === 0 || (n === -1 || n === 2 ? tu(e, n, o, null, t[++r]) : tu(e, n, o, null, null));
      }
    }
  return e;
}
function tu(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == 'number') {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == 'number') break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    (i++, o !== null && i++);
  }
  (s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o));
}
function Ou(e) {
  return e !== an;
}
function wo$1(e) {
  return e & 32767;
}
function gg(e) {
  return e >> 16;
}
function To$1(e, t) {
  let n = gg(e),
    r = t;
  for (; n > 0; ) ((r = r[Qe$1]), n--);
  return r;
}
var Bs = true;
function nu(e) {
  let t = Bs;
  return ((Bs = e), t);
}
var mg = 256,
  Lu = mg - 1,
  Pu = 5,
  yg = 0,
  xe$1 = {};
function vg(e, t, n) {
  let r;
  (typeof n == 'string' ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(mt$1) && (r = n[mt$1]),
    r == null && (r = n[mt$1] = yg++));
  let o = r & Lu,
    i = 1 << o;
  t.data[e + (o >> Pu)] |= i;
}
function Co$1(e, t) {
  let n = Fu(e, t);
  if (n !== -1) return n;
  let r = t[g$1];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length), Rs$1(r.data, e), Rs$1(t, null), Rs$1(r.blueprint, null));
  let o = ha$1(e, t),
    i = e.injectorIndex;
  if (Ou(o)) {
    let s = wo$1(o),
      a = To$1(o, t),
      c = a[g$1].data;
    for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l];
  }
  return ((t[i + 8] = o), i);
}
function Rs$1(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Fu(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function ha$1(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = $u(o)), r === null)) return an;
    if ((n++, (o = o[Qe$1]), r.injectorIndex !== -1)) return r.injectorIndex | (n << 16);
  }
  return an;
}
function $s(e, t, n) {
  vg(e, t, n);
}
function ju(e, t, n) {
  if (n & 8 || e !== void 0) return e;
  Wr();
}
function Vu(e, t, n, r) {
  if ((n & 8 && r === void 0 && (r = null), (n & 3) === 0)) {
    let o = e[Ce],
      i = J$1(void 0);
    try {
      return o ? o.get(t, r, n & 8) : Qi$2(t, r, n & 8);
    } finally {
      J$1(i);
    }
  }
  return ju(r, t, n);
}
function Hu(e, t, n, r = 0, o) {
  if (e !== null) {
    if (t[I] & 2048 && !(r & 2)) {
      let s = wg(e, t, n, r, xe$1);
      if (s !== xe$1) return s;
    }
    let i = Bu(e, t, n, r, xe$1);
    if (i !== xe$1) return i;
  }
  return Vu(t, n, r, o);
}
function Bu(e, t, n, r, o) {
  let i = Ig(n);
  if (typeof i == 'function') {
    if (!Ts$1(t, e, r)) return r & 1 ? ju(o, n, r) : Vu(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) Wr(n);
      else return s;
    } finally {
      Cs$1();
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = Fu(e, t),
      c = an,
      l = r & 1 ? t[Y][z] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? ha$1(e, t) : t[a + 8]),
      c === an || !ou(r, false) ? (a = -1) : ((s = t[g$1]), (a = wo$1(c)), (t = To$1(c, t))));
      a !== -1;
    ) {
      let u = t[g$1];
      if (ru(i, a, u.data)) {
        let d = Eg(a, t, n, s, r, l);
        if (d !== xe$1) return d;
      }
      ((c = t[a + 8]),
        c !== an && ou(r, t[g$1].data[a + 8] === l) && ru(i, a, t)
          ? ((s = u), (a = wo$1(c)), (t = To$1(c, t)))
          : (a = -1));
    }
  }
  return o;
}
function Eg(e, t, n, r, o, i) {
  let s = t[g$1],
    a = s.data[e + 8],
    c = r == null ? He$2(a) && Bs : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = vo$1(a, s, n, c, l);
  return u !== null ? Bn$2(t, s, u, a, o) : xe$1;
}
function vo$1(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    p = o ? a + u : l;
  for (let f = d; f < p; f++) {
    let h = s[f];
    if ((f < c && n === h) || (f >= c && h.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && Ke(f) && f.type === n) return c;
  }
  return null;
}
function Bn$2(e, t, n, r, o) {
  let i = e[n],
    s = t.data;
  if (i instanceof St$1) {
    let a = i;
    if (a.resolving) throw zi$2();
    let c = nu(a.canSeeViewProviders);
    a.resolving = true;
    s[n].type || s[n];
    let d = a.injectImpl ? J$1(a.injectImpl) : null;
    Ts$1(e, r, 0);
    try {
      ((i = e[n] = a.factory(void 0, o, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && cg(n, s[n], t));
    } finally {
      (d !== null && J$1(d), nu(c), (a.resolving = false), Cs$1());
    }
  }
  return i;
}
function Ig(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(mt$1) ? e[mt$1] : void 0;
  return typeof t == 'number' ? (t >= 0 ? t & Lu : Dg) : t;
}
function ru(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Pu)] & r);
}
function ou(e, t) {
  return !(e & 2) && !(e & 1 && t);
}
var et$2 = class et {
  _tNode;
  _lView;
  constructor(t, n) {
    ((this._tNode = t), (this._lView = n));
  }
  get(t, n, r) {
    return Hu(this._tNode, this._lView, t, pt$2(r), n);
  }
};
function Dg() {
  return new et$2(q(), v());
}
function wg(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[I] & 2048 && !tn(s); ) {
    let a = Bu(i, s, n, r | 2, xe$1);
    if (a !== xe$1) return a;
    let c = i.parent;
    if (!c) {
      let l = s[rs$1];
      if (l) {
        let u = l.get(n, xe$1, r & -5);
        if (u !== xe$1) return u;
      }
      ((c = $u(s)), (s = s[Qe$1]));
    }
    i = c;
  }
  return o;
}
function $u(e) {
  let t = e[g$1],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[z] : null;
}
function Rt$2(e) {
  return {
    token: e.token,
    providedIn: e.autoProvided === false ? null : 'root',
    factory: e.factory,
    value: void 0,
  };
}
function Tg() {
  return pn$1(q(), v());
}
function pn$1(e, t) {
  return new Jn$2(he$1(e, t));
}
var Jn$2 = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Tg;
  }
  return e;
})();
function Cg(e) {
  return e instanceof Jn$2 ? e.nativeElement : e;
}
function bg() {
  return this._results[Symbol.iterator]();
}
var bo$1 = class bo {
  _emitDistinctChangesOnly;
  dirty = true;
  _onDirty = void 0;
  _results = [];
  _changesDetected = false;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new ke$1());
  }
  constructor(t = false) {
    this._emitDistinctChangesOnly = t;
  }
  get(t) {
    return this._results[t];
  }
  map(t) {
    return this._results.map(t);
  }
  filter(t) {
    return this._results.filter(t);
  }
  find(t) {
    return this._results.find(t);
  }
  reduce(t, n) {
    return this._results.reduce(t, n);
  }
  forEach(t) {
    this._results.forEach(t);
  }
  some(t) {
    return this._results.some(t);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(t, n) {
    this.dirty = false;
    let r = fl(t);
    (this._changesDetected = !dl(this._results, r, n)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(t) {
    this._onDirty = t;
  }
  setDirty() {
    ((this.dirty = true), this._onDirty?.());
  }
  destroy() {
    this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = bg;
};
function Uu(e) {
  return (e.flags & 128) === 128;
}
var ga$1 = (function (e) {
    return (
      (e[(e.OnPush = 0)] = 'OnPush'),
      (e[(e.Eager = 1)] = 'Eager'),
      (e[(e.Default = 1)] = 'Default'),
      e
    );
  })(ga$1 || {}),
  qu = new Map(),
  Mg = 0;
function _g() {
  return Mg++;
}
function Ng(e) {
  qu.set(e[_e], e);
}
function Us$1(e) {
  qu.delete(e[_e]);
}
var iu = '__ngContext__';
function cn(e, t) {
  Ve$1(t) ? ((e[iu] = t[_e]), Ng(t)) : (e[iu] = t);
}
function Wu(e) {
  return zu(e[Xt]);
}
function Gu(e) {
  return zu(e[ie$1]);
}
function zu(e) {
  for (; e !== null && !se$1(e); ) e = e[ie$1];
  return e;
}
var qs;
function Sg(e) {
  qs = e;
}
function Qu() {
  if (qs !== void 0) return qs;
  if (typeof document < 'u') return document;
  throw new b$1(210, false);
}
var Zu = 'r';
var Yu = 'di';
var Ku = false,
  Ju = new x$1('', { factory: () => Ku });
var su = new WeakMap();
function xg(e, t) {
  if (e == null || typeof e != 'object') return;
  let n = su.get(e);
  (n || ((n = new WeakSet()), su.set(e, n)), n.add(t));
}
function Bo$1(e) {
  return (e.flags & 32) === 32;
}
var kg = () => null;
function Xu(e, t, n = false) {
  return kg();
}
function ed(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = m(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          (oo$1(i), a.contentQueries(2, t[s], s));
        }
      }
    } finally {
      m(r);
    }
  }
}
function Ws(e, t, n) {
  oo$1(0);
  let r = m(null);
  try {
    t(e, n);
  } finally {
    m(r);
  }
}
function ma$1(e, t, n) {
  if (is$1(t)) {
    let r = m(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      m(r);
    }
  }
}
var xt$1 = (function (e) {
  return (
    (e[(e.Emulated = 0)] = 'Emulated'),
    (e[(e.None = 2)] = 'None'),
    (e[(e.ShadowDom = 3)] = 'ShadowDom'),
    (e[(e.ExperimentalIsolatedShadowDom = 4)] = 'ExperimentalIsolatedShadowDom'),
    e
  );
})(xt$1 || {});
var Gs = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Vi$2})`;
  }
};
function ya$1(e) {
  return e instanceof Gs ? e.changingThisBreaksApplicationSecurity : e;
}
var Og = /^>|^->|<!--|-->|--!>|<!-$/g,
  Lg = /(<|>)/g,
  Pg = '\u200B$1\u200B';
function Fg(e) {
  return e.replace(Og, (t) => t.replace(Lg, Pg));
}
function jg(e, t) {
  return e.createText(t);
}
function Vg(e, t, n) {
  e.setValue(t, n);
}
function Hg(e, t) {
  return e.createComment(Fg(t));
}
function td(e, t, n) {
  return e.createElement(t, n);
}
function Mo$1(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function nd(e, t, n) {
  e.appendChild(t, n);
}
function au(e, t, n, r, o) {
  r !== null ? Mo$1(e, t, n, r, o) : nd(e, t, n);
}
function rd(e, t, n, r) {
  e.removeChild(null, t, n, r);
}
function Bg(e, t, n) {
  e.setAttribute(t, 'style', n);
}
function $g(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n);
}
function od(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  (r !== null && fg(e, t, r), o !== null && $g(e, t, o), i !== null && Bg(e, t, i));
}
function Ug(e) {
  return e.ownerDocument.defaultView;
}
function qg(e) {
  return e.ownerDocument;
}
function Wg(e) {
  return e instanceof Function ? e() : e;
}
function Gg(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var id = 'ng-template';
function zg(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == 'string'; o += 2)
      if (t[o] === 'class' && Gg(t[o + 1].toLowerCase(), n, 0) !== -1) return true;
  } else if (va$1(e)) return false;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == 'string'; )
      if (i.toLowerCase() === n) return true;
  }
  return false;
}
function va$1(e) {
  return e.type === 4 && e.value !== id;
}
function Qg(e, t, n) {
  let r = e.type === 4 && !n ? id : e.value;
  return t === r;
}
function Zg(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Jg(o) : 0,
    s = false;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == 'number') {
      if (!s && !ge$1(r) && !ge$1(c)) return false;
      if (s && ge$1(c)) continue;
      ((s = false), (r = c | (r & 1)));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (((r = 2 | (r & 1)), (c !== '' && !Qg(e, c, n)) || (c === '' && t.length === 1))) {
          if (ge$1(r)) return false;
          s = true;
        }
      } else if (r & 8) {
        if (o === null || !zg(e, o, c, n)) {
          if (ge$1(r)) return false;
          s = true;
        }
      } else {
        let l = t[++a],
          u = Yg(c, o, va$1(e), n);
        if (u === -1) {
          if (ge$1(r)) return false;
          s = true;
          continue;
        }
        if (l !== '') {
          let d;
          if ((u > i ? (d = '') : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)) {
            if (ge$1(r)) return false;
            s = true;
          }
        }
      }
  }
  return ge$1(r) || s;
}
function ge$1(e) {
  return (e & 1) === 0;
}
function Yg(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = false;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = true;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == 'string'; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Xg(t, e);
}
function sd(e, t, n = false) {
  for (let r = 0; r < t.length; r++) if (Zg(e, t[r], n)) return true;
  return false;
}
function Jg(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (pg(n)) return t;
  }
  return e.length;
}
function Xg(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == 'number') return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function cu(e, t) {
  return e ? ':not(' + t.trim() + ')' : t;
}
function tm(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = false;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n];
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s);
    else (o !== '' && !ge$1(s) && ((t += cu(i, o)), (o = '')), (r = s), (i = i || !ge$1(r)));
    n++;
  }
  return (o !== '' && (t += cu(i, o)), t);
}
function nm(e) {
  return e.map(tm).join(',');
}
function rm(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == 'string') o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!ge$1(o)) break;
      o = i;
    }
    r++;
  }
  return (n.length && t.push(1, ...n), t);
}
var te$1 = {},
  _o$1 = (function (e) {
    return ((e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e);
  })(_o$1 || {}),
  om;
function Ea$1(e, t) {
  return om(e, t);
}
typeof document < 'u' && typeof document?.documentElement?.getAnimations == 'function';
var zs = new WeakMap();
function ad(e) {
  return e ? (e[Qe$1] ?? e) : null;
}
var jn$2 = new WeakSet();
function im(e, t, n) {
  let r = zs.get(e);
  if (!r || r.length === 0) return;
  let o = t.parentNode,
    i = t.previousSibling,
    s = ad(n);
  for (let a = r.length - 1; a >= 0; a--) {
    let { el: c, declarationView: l } = r[a],
      u = c.parentNode;
    c === t
      ? (r.splice(a, 1),
        jn$2.add(c),
        c.dispatchEvent(new CustomEvent('animationend', { detail: { cancel: true } })))
      : i && c === i
        ? (r.splice(a, 1),
          c.dispatchEvent(new CustomEvent('animationend', { detail: { cancel: true } })),
          c.parentNode?.removeChild(c))
        : u &&
          o &&
          u !== o &&
          (s === null || l === null || s === l) &&
          (r.splice(a, 1),
          c.dispatchEvent(new CustomEvent('animationend', { detail: { cancel: true } })),
          c.parentNode?.removeChild(c));
  }
}
function sm(e, t, n) {
  let r = ad(n),
    o = zs.get(e);
  o
    ? o.some((i) => i.el === t) || o.push({ el: t, declarationView: r })
    : zs.set(e, [{ el: t, declarationView: r }]);
}
var ln = new Set(),
  $o$1 = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (e[(e.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      e
    );
  })($o$1 || {}),
  kt$2 = new x$1(''),
  lu = new Set();
function $e$2(e) {
  lu.has(e) || (lu.add(e), performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var Uo$1 = (() => {
    class e {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = oe({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  Ia$1 = [0, 1, 2, 3],
  Da$1 = (() => {
    class e {
      ngZone = E(W);
      scheduler = E(Te$2);
      errorHandler = E(je$1, { optional: true });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = false;
      constructor() {
        E(kt$2, { optional: true });
      }
      execute() {
        let n = this.sequences.size > 0;
        (n && A(_.AfterRenderHooksStart), (this.executing = true));
        for (let r of Ia$1)
          for (let o of this.sequences)
            if (!(o.erroredOrDestroyed || !o.hooks[r]))
              try {
                o.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let i = o.hooks[r];
                    return i(o.pipelinedValue);
                  }, o.snapshot),
                );
              } catch (i) {
                ((o.erroredOrDestroyed = true), this.errorHandler?.handleError(i));
              }
        this.executing = false;
        for (let r of this.sequences)
          (r.afterRun(), r.once && (this.sequences.delete(r), r.destroy()));
        for (let r of this.deferredRegistrations) this.sequences.add(r);
        (this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          n && A(_.AfterRenderHooksEnd));
      }
      register(n) {
        let { view: r } = n;
        r !== void 0
          ? ((r[wt$1] ??= []).push(n), bt$2(r), (r[I] |= 8192))
          : this.executing
            ? this.deferredRegistrations.add(n)
            : this.addSequence(n);
      }
      addSequence(n) {
        (this.sequences.add(n), this.scheduler.notify(7));
      }
      unregister(n) {
        this.executing && this.sequences.has(n)
          ? ((n.erroredOrDestroyed = true), (n.pipelinedValue = void 0), (n.once = true))
          : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
      }
      maybeTrace(n, r) {
        return r ? r.run($o$1.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = oe({ token: e, providedIn: 'root', factory: () => new e() });
    }
    return e;
  })(),
  $n$2 = class $n {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = false;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, o, i, s = null) {
      ((this.impl = t),
        (this.hooks = n),
        (this.view = r),
        (this.once = o),
        (this.snapshot = s),
        (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy())));
    }
    afterRun() {
      ((this.erroredOrDestroyed = false),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null));
    }
    destroy() {
      (this.impl.unregister(this), this.unregisterOnDestroy?.());
      let t = this.view?.[wt$1];
      t && (this.view[wt$1] = t.filter((n) => n !== this));
    }
  };
function am(e, t) {
  let n = E(fe$1);
  return ($e$2('NgAfterNextRender'), lm(e, n, t, true));
}
function cm(e) {
  return e instanceof Function
    ? [void 0, void 0, e, void 0]
    : [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function lm(e, t, n, r) {
  let o = t.get(Uo$1);
  o.impl ??= t.get(Da$1);
  let i = t.get(kt$2, null, { optional: true }),
    s = t.get(Be$2),
    a = t.get(rn, null, { optional: true }),
    c = new $n$2(o.impl, cm(e), a?.view, r, s, i?.snapshot(null));
  return (o.impl.register(c), c);
}
var wa$1 = new x$1('', {
  factory: () => {
    let e = E(re),
      t = new Set();
    return (
      e.onDestroy(() => t.clear()),
      { queue: t, isScheduled: false, scheduler: null, injector: e }
    );
  },
});
function cd(e, t, n) {
  let r = e.get(wa$1);
  if (Array.isArray(t)) for (let o of t) (r.queue.add(o), n?.detachedLeaveAnimationFns?.push(o));
  else (r.queue.add(t), n?.detachedLeaveAnimationFns?.push(t));
  r.scheduler && r.scheduler(e);
}
function um(e, t) {
  let n = e.get(wa$1);
  if (Array.isArray(t)) for (let r of t) n.queue.delete(r);
  else n.queue.delete(t);
}
function dm(e, t) {
  let n = e.get(wa$1);
  if (t.detachedLeaveAnimationFns) {
    for (let r of t.detachedLeaveAnimationFns) n.queue.delete(r);
    t.detachedLeaveAnimationFns = void 0;
  }
}
function fm(e, t) {
  for (let [n, r] of t) cd(e, r.animateFns);
}
function uu(e, t, n, r) {
  let o = e?.[Ne$1]?.enter;
  t !== null && o && o.has(n.index) && fm(r, o);
}
function du(e, t, n, r) {
  try {
    n.get(An$1);
  } catch (s) {
    return r(false);
  }
  let o = e?.[Ne$1];
  o?.enter?.has(t.index) && um(n, o.enter.get(t.index).animateFns);
  let i = pm(e, t, o);
  if (i.size === 0) {
    let s = false;
    if (e) {
      let a = [];
      (qo$1(e, t, a), (s = a.length > 0));
    }
    if (!s) return r(false);
  }
  (e && ln.add(e[_e]), cd(n, () => hm(e, t, o || void 0, i, r), o || void 0));
}
function pm(e, t, n) {
  let r = new Map(),
    o = n?.leave;
  if ((o && o.has(t.index) && r.set(t.index, o.get(t.index)), e && o))
    for (let [i, s] of o) {
      if (r.has(i)) continue;
      let c = e[g$1].data[i].parent;
      for (; c; ) {
        if (c === t) {
          r.set(i, s);
          break;
        }
        c = c.parent;
      }
    }
  return r;
}
function hm(e, t, n, r, o) {
  let i = [];
  if (n && n.leave)
    for (let [s] of r) {
      if (!n.leave.has(s)) continue;
      let a = n.leave.get(s);
      for (let c of a.animateFns) {
        let { promise: l } = c();
        i.push(l);
      }
      n.detachedLeaveAnimationFns = void 0;
    }
  if ((e && qo$1(e, t, i), i.length > 0)) {
    let s = n || e?.[Ne$1];
    if (s) {
      let a = s.running;
      (a && i.push(a), (s.running = Promise.allSettled(i)), mm(e, s.running, o));
    } else
      Promise.allSettled(i).then(() => {
        (e && ln.delete(e[_e]), o(true));
      });
  } else (e && ln.delete(e[_e]), o(false));
}
function qo$1(e, t, n) {
  if (t.type & 12) {
    let o = e[t.index];
    if (se$1(o))
      for (let i = F; i < o.length; i++) {
        let s = o[i];
        s[g$1].type === 2 && gm(s, n);
      }
  }
  let r = t.child;
  for (; r; ) (qo$1(e, r, n), (r = r.next));
}
function gm(e, t) {
  let n = e[Ne$1];
  if (n && n.leave)
    for (let o of n.leave.values())
      for (let i of o.animateFns) {
        let { promise: s } = i();
        t.push(s);
      }
  let r = e[g$1].firstChild;
  for (; r; ) (qo$1(e, r, t), (r = r.next));
}
function mm(e, t, n) {
  t.then(() => {
    (e[Ne$1]?.running === t && ((e[Ne$1].running = void 0), ln.delete(e[_e])), n(true));
  });
}
function sn(e, t, n, r, o, i, s, a) {
  if (o != null) {
    let c,
      l = false;
    se$1(o) ? (c = o) : Ve$1(o) && ((l = true), (o = o[pe]));
    let u = ae(o);
    (e === 0 && r !== null
      ? (uu(a, r, i, n), s == null ? nd(t, r, u) : Mo$1(t, r, u, s || null, true))
      : e === 1 && r !== null
        ? (uu(a, r, i, n), Mo$1(t, r, u, s || null, true), im(i, u, a))
        : e === 2
          ? (a?.[Ne$1]?.leave?.has(i.index) && sm(i, u, a),
            jn$2.delete(u),
            du(a, i, n, (d) => {
              if (jn$2.has(u)) {
                jn$2.delete(u);
                return;
              }
              rd(t, u, l, d);
            }))
          : e === 3 &&
            (jn$2.delete(u),
            du(a, i, n, () => {
              t.destroyNode(u);
            })),
      c != null && Mm(t, e, n, c, i, r, s));
  }
}
function ym(e, t) {
  (ld(e, t), (t[pe] = null), (t[z] = null));
}
function vm(e, t, n, r, o, i) {
  ((r[pe] = o), (r[z] = t), Go$1(e, r, n, 1, o, i));
}
function ld(e, t) {
  (t[be].changeDetectionScheduler?.notify(9), Go$1(e, t, t[R], 2, null, null));
}
function Em(e) {
  let t = e[Xt];
  if (!t) return ks$1(e[g$1], e);
  for (; t; ) {
    let n = null;
    if (Ve$1(t)) n = t[Xt];
    else {
      let r = t[F];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[ie$1] && t !== e; ) (Ve$1(t) && ks$1(t[g$1], t), (t = t[U$2]));
      (t === null && (t = e), Ve$1(t) && ks$1(t[g$1], t), (n = t && t[ie$1]));
    }
    t = n;
  }
}
function Ta$1(e, t) {
  let n = e[Tt$1],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Wo$1(e, t) {
  if (Ct$1(t)) return;
  let n = t[R];
  (n.destroyNode && Go$1(e, t, n, 3, null, null), Em(t));
}
function ks$1(e, t) {
  if (Ct$1(t)) return;
  let n = m(null);
  try {
    ((t[I] &= -129),
      (t[I] |= 256),
      t[X$1] && We(t[X$1]),
      Dm(e, t),
      Im(e, t),
      t[g$1].type === 1 && t[R].destroy());
    let r = t[Ze$1];
    if (r !== null && se$1(t[U$2])) {
      r !== t[U$2] && Ta$1(r, t);
      let o = t[Me];
      o !== null && o.detachView(e);
    }
    Us$1(t);
  } finally {
    m(n);
  }
}
function Im(e, t) {
  let n = e.cleanup,
    r = t[Jt];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let a = n[s + 3];
        (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[Jt] = null);
  let o = t[Pe];
  if (o !== null) {
    t[Pe] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[ze$2];
  if (i !== null) {
    t[ze$2] = null;
    for (let s of i) s.destroy();
  }
}
function Dm(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof St$1)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            A(_.LifecycleHookStart, a, c);
            try {
              c.call(a);
            } finally {
              A(_.LifecycleHookEnd, a, c);
            }
          }
        else {
          A(_.LifecycleHookStart, o, i);
          try {
            i.call(o);
          } finally {
            A(_.LifecycleHookEnd, o, i);
          }
        }
      }
    }
}
function ud(e, t, n) {
  return wm(e, t.parent, n);
}
function wm(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) ((t = r), (r = t.parent));
  if (r === null) return n[pe];
  if (He$2(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === xt$1.None || o === xt$1.Emulated) return null;
  }
  return he$1(r, n);
}
function dd(e, t, n) {
  return Cm(e, t, n);
}
function Tm(e, t, n) {
  return e.type & 40 ? he$1(e, n) : null;
}
var Cm = Tm;
function Ca$1(e, t, n, r) {
  let o = ud(e, r, t),
    i = t[R],
    s = r.parent || t[z],
    a = dd(s, r, t);
  if (o != null)
    if (Array.isArray(n)) for (let c = 0; c < n.length; c++) au(i, o, n[c], a, false);
    else au(i, o, n, a, false);
}
function Vn$2(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return he$1(t, e);
    if (n & 4) return Qs(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Vn$2(e, r);
      {
        let o = e[t.index];
        return se$1(o) ? Qs(-1, o) : ae(o);
      }
    } else {
      if (n & 128) return Vn$2(e, t.next);
      if (n & 32) return Ea$1(t, e)() || ae(e[t.index]);
      {
        let r = fd(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Fe$1(e[Y]);
          return Vn$2(o, r);
        } else return Vn$2(e, t.next);
      }
    }
  }
  return null;
}
function fd(e, t) {
  if (t !== null) {
    let r = e[Y][z],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Qs(e, t) {
  let n = F + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[g$1].firstChild;
    if (o !== null) return Vn$2(r, o);
  }
  return t[Ye];
}
function ba$1(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    let a = r[Ce];
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let c = r[n.index],
      l = n.type;
    if ((s && t === 0 && (c && cn(ae(c), r), (n.flags |= 2)), !Bo$1(n)))
      if (l & 8) (ba$1(e, t, n.child, r, o, i, false), sn(t, e, a, o, c, n, i, r));
      else if (l & 32) {
        let u = Ea$1(n, r),
          d;
        for (; (d = u()); ) sn(t, e, a, o, d, n, i, r);
        sn(t, e, a, o, c, n, i, r);
      } else l & 16 ? pd(e, t, r, n, o, i) : sn(t, e, a, o, c, n, i, r);
    n = s ? n.projectionNext : n.next;
  }
}
function Go$1(e, t, n, r, o, i) {
  ba$1(n, r, e.firstChild, t, o, i, false);
}
function bm(e, t, n) {
  let r = t[R],
    o = ud(e, n, t),
    i = n.parent || t[z],
    s = dd(i, n, t);
  pd(r, 0, t, n, o, s);
}
function pd(e, t, n, r, o, i) {
  let s = n[Y],
    c = s[z].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      sn(t, e, n[Ce], o, u, r, i, n);
    }
  else {
    let l = c,
      u = s[U$2];
    (Uu(r) && (l.flags |= 128), ba$1(e, t, l, u, o, i, true));
  }
}
function Mm(e, t, n, r, o, i, s) {
  let a = r[Ye],
    c = ae(r);
  a !== c && sn(t, e, n, i, a, o, s);
  for (let l = F; l < r.length; l++) {
    let u = r[l];
    Go$1(u[g$1], u, e, t, i, a);
  }
}
function _m(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf('-') === -1 ? void 0 : _o$1.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= _o$1.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Ma$1(e, t, n, r, o, i, s, a, c, l, u) {
  let d = L + r,
    p = d + o,
    f = Nm(d, p),
    h = typeof l == 'function' ? l() : l;
  return (f[g$1] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: true,
    firstUpdatePass: true,
    staticViewQueries: false,
    staticContentQueries: false,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: c,
    consts: h,
    incompleteFirstPass: false,
    ssrId: u,
  });
}
function Nm(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : te$1);
  return n;
}
function Sm(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ma$1(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function _a$1(e, t, n, r, o, i, s, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[pe] = o),
    (d[I] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
    ls$1(d),
    (d[U$2] = d[Qe$1] = e),
    (d[V] = n),
    (d[be] = s || (e && e[be])),
    (d[R] = a || (e && e[R])),
    (d[Ce] = c || (e && e[Ce]) || null),
    (d[z] = i),
    (d[_e] = _g()),
    (d[It$1] = u),
    (d[rs$1] = l),
    (d[Y] = t.type == 2 ? e[Y] : d),
    d
  );
}
function xm(e, t, n) {
  let r = he$1(t, e),
    o = Sm(n),
    i = e[be].rendererFactory,
    s = Na$1(e, _a$1(e, o, null, hd(n), r, t, null, i.createRenderer(r, n), null, null, null));
  return (e[t.index] = s);
}
function hd(e) {
  let t = 16;
  return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function gd(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) (t.push(r), e.blueprint.push(r), e.data.push(null));
  return o;
}
function Na$1(e, t) {
  return (e[Xt] ? (e[ns$1][ie$1] = t) : (e[Xt] = t), (e[ns$1] = t), t);
}
function Am(e = 1) {
  md(P$1(), v(), Se$1() + e);
}
function md(e, t, n, r) {
  if ((t[I] & 3) === 3) {
    let i = e.preOrderCheckHooks;
    i !== null && mo$1(t, i, n);
  } else {
    let i = e.preOrderHooks;
    i !== null && yo$1(t, i, 0, n);
  }
  Xe$1(n);
}
var zo$1 = (function (e) {
  return (
    (e[(e.None = 0)] = 'None'),
    (e[(e.SignalBased = 1)] = 'SignalBased'),
    (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
    e
  );
})(zo$1 || {});
function Zs(e, t, n, r) {
  let o = m(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    ((s & zo$1.SignalBased) !== 0 && (c = t[i][j]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : Su(t, c, i, r));
  } finally {
    m(o);
  }
}
function yd(e, t, n, r, o) {
  let i = Se$1(),
    s = r & 2;
  try {
    (Xe$1(-1), s && t.length > L && md(e, t, L, !1));
    let a = s ? _.TemplateUpdateStart : _.TemplateCreateStart;
    (A(a, o, n), n(r, o));
  } finally {
    Xe$1(i);
    let a = s ? _.TemplateUpdateEnd : _.TemplateCreateEnd;
    A(a, o, n);
  }
}
function Qo$1(e, t, n) {
  (Fm(e, t, n), (n.flags & 64) === 64 && jm(e, t, n));
}
function hn(e, t, n = he$1) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Rm(e, t, n, r) {
  let i = r.get(Ju, Ku) || n === xt$1.ShadowDom || n === xt$1.ExperimentalIsolatedShadowDom,
    s = e.selectRootElement(t, i);
  if (s.tagName.toLowerCase() === 'script') throw new b$1(905, false);
  return s;
}
function Lm(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
      ? 'htmlFor'
      : e === 'formaction'
        ? 'formAction'
        : e === 'innerHtml'
          ? 'innerHTML'
          : e === 'readonly'
            ? 'readOnly'
            : e === 'tabindex'
              ? 'tabIndex'
              : e;
}
function vd(e, t, n, r, o, i) {
  let s = t[g$1];
  if (xa$1(e, s, t, n, r)) {
    He$2(e) && Pm(t, e.index);
    return;
  }
  (e.type & 3 && (n = Lm(n)), Ed(e, t, n, r, o, i));
}
function Ed(e, t, n, r, o, i) {
  if (e.type & 3) {
    let s = he$1(e, t);
    ((r = i != null ? i(r, e.value || '', n) : r), o.setProperty(s, n, r));
  } else e.type & 12;
}
function Pm(e, t) {
  let n = ce(t, e);
  n[I] & 16 || (n[I] |= 64);
}
function Fm(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  (He$2(n) && xm(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Co$1(n, t));
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = Bn$2(t, e, s, n);
    if ((cn(c, t), i !== null && $m(t, s - r, c, a, n, i), Ke(a))) {
      let l = ce(n.index, t);
      l[V] = Bn$2(t, e, s, n);
    }
  }
}
function jm(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Ol();
  try {
    Xe$1(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = t[a];
      (ro$1(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && Vm(c, l));
    }
  } finally {
    (Xe$1(-1), ro$1(s));
  }
}
function Vm(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Sa$1(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      sd(t, i.selectors, false) && ((r ??= []), Ke(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function Hm(e, t, n, r, o, i) {
  let s = he$1(e, t);
  Bm(t[R], s, i, e.value, n, r, o);
}
function Bm(e, t, n, r, o, i, s) {
  if (i == null) (s?.(i, r || '', o), e.removeAttribute(t, o, n));
  else {
    let a = s == null ? Gi$2(i) : s(i, r || '', o);
    e.setAttribute(t, o, a, n);
  }
}
function $m(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Zs(r, n, c, l);
    }
}
function Zo$1(e, t, n, r, o) {
  let i = L + n,
    s = t[g$1],
    a = o(s, t, e, r, n);
  ((t[i] = a), Mt$1(e, true));
  let c = e.type === 2;
  return (
    c ? (od(t[R], a, e), (Ml() === 0 || en(e)) && cn(a, t), _l()) : cn(a, t),
    ao$1() && (!c || !Bo$1(e)) && Ca$1(s, t, a, e),
    e
  );
}
function Yo$1(e) {
  let t = e;
  return (vs$1() ? Es$1() : ((t = t.parent), Mt$1(t, false)), t);
}
function Um(e, t) {
  let n = e[Ce];
  if (!n) return;
  let r;
  try {
    r = n.get(Nt$2, null);
  } catch (o) {
    r = null;
  }
  r?.(t);
}
function xa$1(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = false;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = t.data[l];
      (Zs(d, n[l], u, o), (a = true));
    }
  if (i)
    for (let c of i) {
      let l = n[c],
        u = t.data[c];
      (Zs(u, l, r, o), (a = true));
    }
  return a;
}
function qm(e, t) {
  let n = ce(t, e),
    r = n[g$1];
  Wm(r, n);
  let o = n[pe];
  (o !== null && n[It$1] === null && (n[It$1] = Xu(o, n[Ce])), A(_.ComponentStart));
  try {
    Aa$1(r, n, n[V]);
  } finally {
    A(_.ComponentEnd, n[V]);
  }
}
function Wm(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Aa$1(e, t, n) {
  io$1(t);
  try {
    let r = e.viewQuery;
    r !== null && Ws(1, r, n);
    let o = e.template;
    (o !== null && yd(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Me]?.finishViewCreation(e),
      e.staticContentQueries && ed(e, t),
      e.staticViewQueries && Ws(2, e.viewQuery, n));
    let i = e.components;
    i !== null && Gm(t, i);
  } catch (r) {
    throw (e.firstCreatePass && ((e.incompleteFirstPass = true), (e.firstCreatePass = false)), r);
  } finally {
    ((t[I] &= -5), so$1());
  }
}
function Gm(e, t) {
  for (let n = 0; n < t.length; n++) qm(e, t[n]);
}
function Xn$1(e, t, n, r) {
  let o = m(null);
  try {
    let i = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      c = _a$1(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = e[t.index];
    c[Ze$1] = l;
    let u = e[Me];
    return (u !== null && (c[Me] = u.createEmbeddedView(i)), Aa$1(i, c, n), c);
  } finally {
    m(o);
  }
}
function un(e, t) {
  return !t || t.firstChild === null || Uu(e);
}
function Un$2(e, t, n, r, o = false) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    (i !== null && r.push(ae(i)), se$1(i) && Id(i, r));
    let s = n.type;
    if (s & 8) Un$2(e, t, n.child, r);
    else if (s & 32) {
      let a = Ea$1(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = fd(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Fe$1(t[Y]);
        Un$2(c[g$1], c, a, r, true);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Id(e, t) {
  for (let n = F; n < e.length; n++) {
    let r = e[n],
      o = r[g$1].firstChild;
    o !== null && Un$2(r[g$1], r, o, t);
  }
  e[Ye] !== e[pe] && t.push(e[Ye]);
}
function Dd(e) {
  if (e[wt$1] !== null) {
    for (let t of e[wt$1]) t.impl.addSequence(t);
    e[wt$1].length = 0;
  }
}
var wd = [];
function zm(e) {
  return e[X$1] ?? Qm(e);
}
function Qm(e) {
  let t = wd.pop() ?? Object.create(Ym);
  return ((t.lView = e), t);
}
function Zm(e) {
  e.lView[X$1] !== e && ((e.lView = null), wd.push(e));
}
var Ym = B$1(H({}, Ue$1), {
  consumerIsAlwaysLive: true,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    bt$2(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[X$1] = this;
  },
});
function Km(e) {
  let t = e[X$1] ?? Object.create(Jm);
  return ((t.lView = e), t);
}
var Jm = B$1(H({}, Ue$1), {
  consumerIsAlwaysLive: true,
  kind: 'template',
  consumerMarkedDirty: (e) => {
    let t = Fe$1(e.lView);
    for (; t && !Td(t[g$1]); ) t = Fe$1(t);
    t && us$1(t);
  },
  consumerOnSignalRead() {
    this.lView[X$1] = this;
  },
});
function Td(e) {
  return e.type !== 2;
}
function Cd(e) {
  if (e[ze$2] === null) return;
  let t = true;
  for (; t; ) {
    let n = false;
    for (let r of e[ze$2])
      r.dirty &&
        ((n = true),
        r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
    t = n && !!(e[I] & 8192);
  }
}
var Xm = 100;
function bd(e, t = 0) {
  let r = e[be].rendererFactory;
  r.begin?.();
  try {
    ey(e, t);
  } finally {
    r.end?.();
  }
}
function ey(e, t) {
  let n = Ds$1();
  try {
    (Cn$1(!0), Ys(e, t));
    let r = 0;
    for (; On$2(e); ) {
      if (r === Xm) throw new b$1(103, !1);
      (r++, Ys(e, 1));
    }
  } finally {
    Cn$1(n);
  }
}
function ty(e, t, n, r) {
  if (Ct$1(t)) return;
  let o = t[I],
    i = false,
    s = false;
  io$1(t);
  let a = true,
    c = null,
    l = null;
  Td(e)
    ? ((l = zm(t)), (c = Re$1(l)))
    : cr$1() === null
      ? ((a = false), (l = Km(t)), (c = Re$1(l)))
      : t[X$1] && (We(t[X$1]), (t[X$1] = null));
  try {
    (ls$1(t), Al(e.bindingStartIndex), n !== null && yd(e, t, n, 2, r));
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && mo$1(t, f, null);
      } else {
        let f = e.preOrderHooks;
        (f !== null && yo$1(t, f, 0, null), As$1(t, 0));
      }
    if ((s || ny(t), Cd(t), Md(t, 0), e.contentQueries !== null && ed(e, t), !i))
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && mo$1(t, f);
      } else {
        let f = e.contentHooks;
        (f !== null && yo$1(t, f, 1), As$1(t, 1));
      }
    oy(e, t);
    let d = e.components;
    d !== null && Nd(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Ws(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && mo$1(t, f);
      } else {
        let f = e.viewHooks;
        (f !== null && yo$1(t, f, 2), As$1(t, 2));
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Yr])) {
      for (let f of t[Yr]) f();
      t[Yr] = null;
    }
    i || (Dd(t), (t[I] &= -73));
  } catch (u) {
    throw (bt$2(t), u);
  } finally {
    (l !== null && (qe(l, c), a && Zm(l)), so$1());
  }
}
function Md(e, t) {
  for (let n = Wu(e); n !== null; n = Gu(n))
    for (let r = F; r < n.length; r++) {
      let o = n[r];
      _d(o, t);
    }
}
function ny(e) {
  for (let t = Wu(e); t !== null; t = Gu(t)) {
    if (!(t[I] & 2)) continue;
    let n = t[Tt$1];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      us$1(o);
    }
  }
}
function ry(e, t, n) {
  A(_.ComponentStart);
  let r = ce(t, e);
  try {
    _d(r, n);
  } finally {
    A(_.ComponentEnd, r[V]);
  }
}
function _d(e, t) {
  Xr(e) && Ys(e, t);
}
function Ys(e, t) {
  let r = e[g$1],
    o = e[I],
    i = e[X$1],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ft$1(i))),
    (s ||= false),
    i && (i.dirty = false),
    (e[I] &= -9217),
    s)
  )
    ty(r, e, r.template, e[V]);
  else if (o & 8192) {
    let a = m(null);
    try {
      (Cd(e), Md(e, 1));
      let c = r.components;
      (c !== null && Nd(e, c, 1), Dd(e));
    } finally {
      m(a);
    }
  }
}
function Nd(e, t, n) {
  for (let r = 0; r < t.length; r++) ry(e, t[r], n);
}
function oy(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Xe$1(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          kl(s, i);
          let c = t[i];
          A(_.HostBindingsUpdateStart, c);
          try {
            a(2, c);
          } finally {
            A(_.HostBindingsUpdateEnd, c);
          }
        }
      }
    } finally {
      Xe$1(-1);
    }
}
function Ra$1(e, t) {
  let n = Ds$1() ? 64 : 1088;
  for (e[be].changeDetectionScheduler?.notify(t); e; ) {
    e[I] |= n;
    let r = Fe$1(e);
    if (tn(e) && !r) return e;
    e = r;
  }
  return null;
}
function Sd(e, t, n, r) {
  return [e, true, 0, t, null, r, null, n, null, null];
}
function xd(e, t) {
  let n = F + t;
  if (n < e.length) return e[n];
}
function er$2(e, t, n, r = true) {
  let o = t[g$1];
  if ((iy(o, t, e, n), r)) {
    let s = Qs(n, e),
      a = t[R],
      c = a.parentNode(e[Ye]);
    c !== null && vm(o, e[z], a, t, c, s);
  }
  let i = t[It$1];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Ad(e, t) {
  let n = qn$2(e, t);
  return (n !== void 0 && Wo$1(n[g$1], n), n);
}
function qn$2(e, t) {
  if (e.length <= F) return;
  let n = F + t,
    r = e[n];
  if (r) {
    let o = r[Ze$1];
    (o !== null && o !== e && Ta$1(o, r), t > 0 && (e[n - 1][ie$1] = r[ie$1]));
    let i = xn$2(e, F + t);
    ym(r[g$1], r);
    let s = i[Me];
    (s !== null && s.detachView(i[g$1]), (r[U$2] = null), (r[ie$1] = null), (r[I] &= -129));
  }
  return r;
}
function iy(e, t, n, r) {
  let o = F + r,
    i = n.length;
  (r > 0 && (n[o - 1][ie$1] = t),
    r < i - F ? ((t[ie$1] = n[o]), Zi$2(n, F + r, t)) : (n.push(t), (t[ie$1] = null)),
    (t[U$2] = n));
  let s = t[Ze$1];
  s !== null && n !== s && Rd(s, t);
  let a = t[Me];
  (a !== null && a.insertView(e), eo$1(t), (t[I] |= 128));
}
function Rd(e, t) {
  let n = e[Tt$1],
    r = t[U$2];
  if (Ve$1(r)) e[I] |= 2;
  else {
    let o = r[U$2][Y];
    t[Y] !== o && (e[I] |= 2);
  }
  n === null ? (e[Tt$1] = [t]) : n.push(t);
}
var tt$2 = class tt {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = false;
  exhaustive;
  get rootNodes() {
    let t = this._lView,
      n = t[g$1];
    return Un$2(n, t, n.firstChild, []);
  }
  constructor(t, n) {
    ((this._lView = t), (this._cdRefInjectingView = n));
  }
  get context() {
    return this._lView[V];
  }
  set context(t) {
    this._lView[V] = t;
  }
  get destroyed() {
    return Ct$1(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[U$2];
      if (se$1(t)) {
        let n = t[kn$1],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (qn$2(t, r), xn$2(n, r));
      }
      this._attachedToViewContainer = false;
    }
    Wo$1(this._lView[g$1], this._lView);
  }
  onDestroy(t) {
    to$1(this._lView, t);
  }
  markForCheck() {
    Ra$1(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[I] &= -129;
  }
  reattach() {
    (eo$1(this._lView), (this._lView[I] |= 128));
  }
  detectChanges() {
    ((this._lView[I] |= 1024), bd(this._lView));
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new b$1(902, false);
    this._attachedToViewContainer = true;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = tn(this._lView),
      n = this._lView[Ze$1];
    (n !== null && !t && Ta$1(n, this._lView), ld(this._lView[g$1], this._lView));
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new b$1(902, false);
    this._appRef = t;
    let n = tn(this._lView),
      r = this._lView[Ze$1];
    (r !== null && !n && Rd(r, this._lView), eo$1(this._lView));
  }
};
var Wn$2 = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = sy;
    constructor(n, r, o) {
      ((this._declarationLView = n), (this._declarationTContainer = r), (this.elementRef = o));
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(n, r) {
      return this.createEmbeddedViewImpl(n, r);
    }
    createEmbeddedViewImpl(n, r, o) {
      let i = Xn$1(this._declarationLView, this._declarationTContainer, n, {
        embeddedViewInjector: r,
        dehydratedView: o,
      });
      return new tt$2(i);
    }
  }
  return e;
})();
function sy() {
  return Ko$1(q(), v());
}
function Ko$1(e, t) {
  return e.type & 4 ? new Wn$2(t, e, pn$1(e, t)) : null;
}
function Ot$2(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) ((i = ay(e, t, n, r, o)), Rl() && (i.flags |= 32));
  else if (i.type & 64) {
    ((i.type = n), (i.value = r), (i.attrs = o));
    let s = xl();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return (Mt$1(i, true), i);
}
function ay(e, t, n, r, o) {
  let i = ys$1(),
    s = vs$1(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = ly(e, a, n, t, r, o));
  return (cy(e, c, i, s), c);
}
function cy(e, t, n, r) {
  (e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n))));
}
function ly(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    hs$1() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      controlDirectiveIndex: -1,
      customControlIndex: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      namespace: bs$1(),
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function uy(e) {
  let t = e[os$1] ?? [],
    r = e[U$2][R],
    o = [];
  for (let i of t) i.data[Yu] !== void 0 ? o.push(i) : dy(i, r);
  e[os$1] = o;
}
function dy(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[Zu];
    for (; n < o; ) {
      let i = r.nextSibling;
      (rd(t, r, false), (r = i), n++);
    }
  }
}
var fy = () => null,
  py = () => null;
function No$1(e, t) {
  return fy();
}
function kd(e, t, n) {
  return py();
}
var Od = class {},
  Gn$2 = class Gn {},
  hy = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => gy();
    }
    return e;
  })();
function gy() {
  let e = v(),
    t = q(),
    n = ce(t.index, e);
  return (Ve$1(n) ? n : e)[R];
}
var Ld = (() => {
  class e {
    static ɵprov = oe({ token: e, providedIn: 'root', factory: () => null });
  }
  return e;
})();
function Pd(e) {
  return e.debugInfo?.className || e.type.name || null;
}
var Eo$1 = {},
  So$1 = class So {
    injector;
    parentInjector;
    constructor(t, n) {
      ((this.injector = t), (this.parentInjector = n));
    }
    get(t, n, r) {
      let o = this.injector.get(t, Eo$1, r);
      return o !== Eo$1 || n === Eo$1 ? o : this.parentInjector.get(t, n, r);
    }
  };
function ka$1(e) {
  return e !== null && (typeof e == 'function' || typeof e == 'object');
}
function tr$2(e, t, n) {
  return (e[t] = n);
}
function Fd(e, t) {
  return e[t];
}
function ee$1(e, t, n) {
  if (n === te$1) return false;
  let r = e[t];
  return Object.is(r, n) ? false : ((e[t] = n), true);
}
function zn$2(e, t, n, r) {
  let o = ee$1(e, t, n);
  return ee$1(e, t + 1, r) || o;
}
function my(e, t, n, r, o) {
  let i = zn$2(e, t, n, r);
  return ee$1(e, t + 2, o) || i;
}
function yy(e, t, n, r, o, i) {
  let s = zn$2(e, t, n, r);
  return zn$2(e, t + 2, o, i) || s;
}
function Io(e, t, n) {
  return function r(o) {
    let i = r.__ngNativeEl__;
    i !== void 0 && xg(o, i);
    let s = He$2(e) ? ce(e.index, t) : t;
    Ra$1(s, 5);
    let a = t[V],
      c = pu(t, a, n, o),
      l = r.__ngNextListenerFn__;
    for (; l; ) ((c = pu(t, a, l, o) && c), (l = l.__ngNextListenerFn__));
    return c;
  };
}
function pu(e, t, n, r) {
  let o = m(null);
  try {
    return (A(_.OutputStart, t, n), n(r) !== !1);
  } catch (i) {
    return (Um(e, i), false);
  } finally {
    (A(_.OutputEnd, t, n), m(o));
  }
}
function jd(e, t, n, r, o, i, s, a) {
  let c = en(e),
    l = false,
    u = null;
  if ((!r && c && (u = Ey(t, n, i, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    ((d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (l = true));
  } else {
    let d = he$1(e, n),
      p = r ? r(d) : d;
    r || (a.__ngNativeEl__ = d);
    let f = o.listen(p, i, a);
    if (!vy(i)) {
      let h = r ? (D) => r(ae(D[e.index])) : e.index;
      Vd(h, t, n, i, a, f, false);
    }
  }
  return l;
}
function vy(e) {
  return e.startsWith('animation') || e.startsWith('transition');
}
function Ey(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Jt],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == 'string' && (i += 2);
    }
  return null;
}
function Vd(e, t, n, r, o, i, s) {
  let a = t.firstCreatePass ? fs$1(t) : null,
    c = ds$1(n),
    l = c.length;
  (c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1)));
}
function hu(e, t, n, r, o, i) {
  let s = t[n],
    a = t[g$1],
    l = a.data[n].outputs[r],
    d = s[l].subscribe(i);
  Vd(e.index, a, t, o, i, d, true);
}
var Ks = Symbol('BINDING');
var Hd = new x$1('');
function xo(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == 'number') i = a;
      else if (i == 1) o = Br(o, a);
      else if (i == 2) {
        let c = a,
          l = t[++s];
        r = Br(r, c + ': ' + l + ';');
      }
    }
  (n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o));
}
function Jo$1(e, t = 0) {
  let n = v();
  if (n === null) return we$1(e, t);
  let r = q();
  return Hu(r, n, G$1(e), t);
}
function Bd(e, t, n, r, o) {
  let i = r === null ? null : { '': -1 },
    s = o(e, n);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    wy(e, t, n, a, i, c, l);
  }
  i !== null && r !== null && Iy(n, r, i);
}
function Iy(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new b$1(-301, false);
    r.push(t[o], i);
  }
}
function Dy(e, t, n) {
  ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function wy(e, t, n, r, o, i, s) {
  let a = r.length,
    c = null;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    (c === null && Ke(f) && ((c = f), Dy(e, n, p)), $s(Co$1(n, t), e, f.type));
  }
  (Ny(n, e.data.length, a), c?.viewProvidersResolver && c.viewProvidersResolver(c));
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = false,
    u = false,
    d = gd(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((n.mergedAttrs = Ho$1(n.mergedAttrs, f.hostAttrs)),
      Cy(e, n, t, d, f),
      _y(d, f, o),
      s !== null && s.has(f))
    ) {
      let [D, N] = s.get(f);
      n.directiveToIndex.set(f.type, [d, D + n.directiveStart, N + n.directiveStart]);
    } else (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
    (f.contentQueries !== null && (n.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64));
    let h = f.type.prototype;
    (!l &&
      (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (l = true)),
      !u &&
        (h.ngOnChanges || h.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (u = true)),
      d++);
  }
  Ty(e, n, i);
}
function Ty(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) (gu(0, t, o, r), gu(1, t, o, r), yu(t, r, false));
    else {
      let i = n.get(o);
      (mu(0, t, i, r), mu(1, t, i, r), yu(t, r, true));
    }
  }
}
function gu(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        $d(t, i));
    }
}
function mu(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      (e === 0 ? (a = t.hostDirectiveInputs ??= {}) : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        $d(t, s));
    }
}
function $d(e, t) {
  t === 'class' ? (e.flags |= 8) : t === 'style' && (e.flags |= 16);
}
function yu(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || va$1(e)) {
    ((e.initialInputs ??= []), e.initialInputs.push(null));
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == 'number') break;
    if (!n && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === t) {
          ((s ??= []), s.push(c, r[a + 1]));
          break;
        }
    } else if (n && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === t) {
          ((s ??= []), s.push(l[u + 1], r[a + 1]));
          break;
        }
    }
    a += 2;
  }
  ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function Cy(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Zt$1(o.type)),
    s = new St$1(i, Ke(o), Jo$1, null);
  ((e.blueprint[r] = s), (n[r] = s), by(e, t, r, gd(e, n, o.hostVars, te$1), o));
}
function by(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    (My(s) != a && s.push(a), s.push(n, r, i));
  }
}
function My(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function _y(e, t, n) {
  if (n) {
    if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Ke(t) && (n[''] = e);
  }
}
function Ny(e, t, n) {
  ((e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t));
}
function Oa$1(e, t, n, r, o, i, s, a) {
  let c = t[g$1],
    l = c.consts,
    u = le(l, s),
    d = Ot$2(c, e, n, r, u);
  return (
    Bd(c, t, d, le(l, a), o),
    (d.mergedAttrs = Ho$1(d.mergedAttrs, d.attrs)),
    d.attrs !== null && xo(d, d.attrs, false),
    d.mergedAttrs !== null && xo(d, d.mergedAttrs, true),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function La$1(e, t) {
  (Ru(e, t), is$1(t) && e.queries.elementEnd(t));
}
function Ud(e, t, n, r, o, i) {
  let s = t.consts,
    a = le(s, o),
    c = Ot$2(t, e, n, r, a);
  if (((c.mergedAttrs = Ho$1(c.mergedAttrs, c.attrs)), i != null)) {
    let l = le(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && xo(c, c.attrs, false),
    c.mergedAttrs !== null && xo(c, c.mergedAttrs, true),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
var qd = typeof ShadowRoot < 'u',
  Sy = typeof Document < 'u';
function xy(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = { propName: n, templateName: t, isSignal: (r & zo$1.SignalBased) !== 0 };
    return (o && (i.transform = o), i);
  });
}
function Ay(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function Ry(e, t, n) {
  let r = t instanceof re ? t : t?.injector;
  return (
    r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new So$1(n, r) : n
  );
}
function ky(e) {
  let t = e.get(Gn$2, null);
  if (t === null) throw new b$1(407, false);
  let n = e.get(Ld, null),
    r = e.get(Te$2, null),
    o = e.get(kt$2, null, { optional: true });
  return {
    rendererFactory: t,
    sanitizer: n,
    changeDetectionScheduler: r,
    ngReflect: false,
    tracingService: o,
  };
}
function Oy(e, t) {
  let n = Wd(e);
  return td(t, n, n === 'svg' ? ss$1 : n === 'math' ? Dl : null);
}
function Wd(e) {
  return (e.selectors[0][0] || 'div').toLowerCase();
}
var Qn$1 = class Qn {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return ((this.cachedInputs ??= xy(this.componentDef.inputs)), this.cachedInputs);
  }
  get outputs() {
    return ((this.cachedOutputs ??= Ay(this.componentDef.outputs)), this.cachedOutputs);
  }
  constructor(t, n) {
    ((this.componentDef = t),
      (this.ngModule = n),
      (this.componentType = t.type),
      (this.selector = nm(t.selectors)),
      (this.ngContentSelectors = t.ngContentSelectors ?? []),
      (this.isBoundToModule = !!n));
  }
  create(t, n, r, o, i, s) {
    A(_.DynamicComponentStart);
    let a = m(null);
    try {
      let c = this.componentDef,
        l = Ry(c, o || this.ngModule, t),
        u = ky(l),
        d = u.tracingService;
      return d && d.componentCreate
        ? d.componentCreate(Pd(c), () => this.createComponentRef(u, l, n, r, i, s))
        : this.createComponentRef(u, l, n, r, i, s);
    } finally {
      m(a);
    }
  }
  createComponentRef(t, n, r, o, i, s) {
    let a = this.componentDef,
      c = Ly(o, a, s, i),
      l = t.rendererFactory.createRenderer(null, a),
      u = o ? Rm(l, o, a.encapsulation, n) : Oy(a, l),
      d = n.get(Hd, null),
      p = Py(u, () => n.get(co$1, null) ?? Qu());
    d && d.addHost(p);
    let f = s?.some(vu) || i?.some((N) => typeof N != 'function' && N.bindings.some(vu)),
      h = _a$1(null, c, null, 512 | hd(a), null, null, t, l, n, null, Xu(u, n, true));
    (d &&
      qd &&
      p instanceof ShadowRoot &&
      to$1(h, () => {
        d.removeHost(p);
      }),
      (h[L] = u),
      io$1(h));
    let D = null;
    try {
      let N = Oa$1(L, h, 2, '#host', () => c.directiveRegistry, !0, 0);
      (od(l, u, N),
        cn(u, h),
        Qo$1(c, h, N),
        ma$1(c, N, h),
        La$1(c, N),
        r !== void 0 && jy(N, this.ngContentSelectors, r),
        (D = ce(N.index, h)),
        (h[V] = D[V]),
        Aa$1(c, h, null));
    } catch (N) {
      throw (D !== null && Us$1(D), Us$1(h), N);
    } finally {
      (A(_.DynamicComponentEnd), so$1());
    }
    return new Ao$1(this.componentType, h, !!f);
  }
};
function Ly(e, t, n, r) {
  let o = e ? ['ng-version', '22.0.4'] : rm(t.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (n)
    for (let u of n)
      ((a += u[Ks].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u)));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != 'function')
        for (let p of d.bindings) {
          a += p[Ks].requiredVars;
          let f = u + 1;
          (p.create && ((p.targetIdx = f), (i ??= []).push(p)),
            p.update && ((p.targetIdx = f), (s ??= []).push(p)));
        }
    }
  let c = [t];
  if (r)
    for (let u of r) {
      let d = typeof u == 'function' ? u : u.type,
        p = Wi$2(d);
      c.push(p);
    }
  return Ma$1(0, null, Fy(i, s), 1, a, c, null, null, null, [o], null);
}
function Py(e, t) {
  let n = e.getRootNode?.();
  return Sy && n instanceof Document ? n.head : n && qd && n instanceof ShadowRoot ? n : t().head;
}
function Fy(e, t) {
  return !e && !t
    ? null
    : (n) => {
        if (n & 1 && e) for (let r of e) r.create();
        if (n & 2 && t) for (let r of t) r.update();
      };
}
function vu(e) {
  let t = e[Ks].kind;
  return t === 'input' || t === 'twoWay';
}
var Ao$1 = class Ao extends Od {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(t, n, r) {
    (super(),
      (this._rootLView = n),
      (this._hasInputBindings = r),
      (this._tNode = Kr(n[g$1], L)),
      (this.location = pn$1(this._tNode, n)),
      (this.instance = ce(this._tNode.index, n)[V]),
      (this.hostView = this.changeDetectorRef = new tt$2(n, void 0)),
      (this.componentType = t));
  }
  setInput(t, n) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
    )
      return;
    let o = this._rootLView;
    xa$1(r, o[g$1], o, t, n);
    this.previousInputValues.set(t, n);
    let s = ce(r.index, o);
    Ra$1(s, 1);
  }
  get injector() {
    return new et$2(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(t) {
    this.hostView.onDestroy(t);
  }
};
function jy(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var Xo$1 = (() => {
  class e {
    static __NG_ELEMENT_ID__ = Vy;
  }
  return e;
})();
function Vy() {
  let e = q();
  return Gd(e, v());
}
var Js = class e extends Xo$1 {
  _lContainer;
  _hostTNode;
  _hostLView;
  constructor(t, n, r) {
    (super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r));
  }
  get element() {
    return pn$1(this._hostTNode, this._hostLView);
  }
  get injector() {
    return new et$2(this._hostTNode, this._hostLView);
  }
  get parentInjector() {
    let t = ha$1(this._hostTNode, this._hostLView);
    if (Ou(t)) {
      let n = To$1(t, this._hostLView),
        r = wo$1(t),
        o = n[g$1].data[r + 8];
      return new et$2(o, n);
    } else return new et$2(null, this._hostLView);
  }
  clear() {
    for (; this.length > 0; ) this.remove(this.length - 1);
  }
  get(t) {
    let n = Eu(this._lContainer);
    return (n !== null && n[t]) || null;
  }
  get length() {
    return this._lContainer.length - F;
  }
  createEmbeddedView(t, n, r) {
    let o, i;
    typeof r == 'number' ? (o = r) : r != null && ((o = r.index), (i = r.injector));
    let s = No$1(this._lContainer, t.ssrId),
      a = t.createEmbeddedViewImpl(n || {}, i, s);
    return (this.insertImpl(a, o, un(this._hostTNode, s)), a);
  }
  createComponent(t, n, r, o, i, s, a) {
    let c,
      l = n || {};
    ((c = l.index),
      (r = l.injector),
      (o = l.projectableNodes),
      (i = l.environmentInjector || l.ngModuleRef),
      (s = l.directives),
      (a = l.bindings));
    let u = new Qn$1(yt$1(t)),
      d = r || this.parentInjector;
    if (!i && u.ngModule == null) {
      let k = this.parentInjector.get(re, null);
      k && (i = k);
    }
    let p = yt$1(u.componentType ?? {}),
      f = No$1(this._lContainer, p?.id ?? null),
      h = null,
      D = u.create(d, o, h, i, s, a);
    return (this.insertImpl(D.hostView, c, un(this._hostTNode, f)), D);
  }
  insert(t, n) {
    return this.insertImpl(t, n, true);
  }
  insertImpl(t, n, r) {
    let o = t._lView;
    if (wl(o)) {
      let a = this.indexOf(t);
      if (a !== -1) this.detach(a);
      else {
        let c = o[U$2],
          l = new e(c, c[z], c[U$2]);
        l.detach(l.indexOf(t));
      }
    }
    let i = this._adjustIndex(n),
      s = this._lContainer;
    return (er$2(s, o, i, r), t.attachToViewContainerRef(), Zi$2(Os$1(s), i, t), t);
  }
  move(t, n) {
    return this.insert(t, n);
  }
  indexOf(t) {
    let n = Eu(this._lContainer);
    return n !== null ? n.indexOf(t) : -1;
  }
  remove(t) {
    let n = this._adjustIndex(t, -1),
      r = qn$2(this._lContainer, n);
    r && (xn$2(Os$1(this._lContainer), n), Wo$1(r[g$1], r));
  }
  detach(t) {
    let n = this._adjustIndex(t, -1),
      r = qn$2(this._lContainer, n);
    return r && xn$2(Os$1(this._lContainer), n) != null ? new tt$2(r) : null;
  }
  _adjustIndex(t, n = 0) {
    return t ?? this.length + n;
  }
};
function Eu(e) {
  return e[kn$1];
}
function Os$1(e) {
  return e[kn$1] || (e[kn$1] = []);
}
function Gd(e, t) {
  let n,
    r = t[e.index];
  return (
    se$1(r) ? (n = r) : ((n = Sd(r, t, null, e)), (t[e.index] = n), Na$1(t, n)),
    By(n, t, e, r),
    new Js(n, e, t)
  );
}
function Hy(e, t) {
  let n = e[R],
    r = n.createComment(''),
    o = he$1(t, e),
    i = n.parentNode(o);
  return (Mo$1(n, i, r, n.nextSibling(o), false), r);
}
var By = qy;
function qy(e, t, n, r) {
  if (e[Ye]) return;
  let o;
  (n.type & 8 ? (o = ae(r)) : (o = Hy(t, n)), (e[Ye] = o));
}
var Xs = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  ea$1 = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        Kd(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  Ro$1 = class Ro {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      ((this.flags = n),
        (this.read = r),
        typeof t == 'string' ? (this.predicate = Ky(t)) : (this.predicate = t));
    }
  },
  ta$1 = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i && ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  na$1 = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = false;
    _declarationNodeIndex;
    _appliesToNextNode = true;
    constructor(t, n = -1) {
      ((this.metadata = t), (this._declarationNodeIndex = n));
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = false);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = true), this.addMatch(-t.index, n), new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          (this.matchTNodeWithReadOption(t, n, Wy(n, i)),
            this.matchTNodeWithReadOption(t, n, vo$1(n, t, i, false, false)));
        }
      else
        r === Wn$2
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, vo$1(n, t, r, false, false));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === Jn$2 || o === Xo$1 || (o === Wn$2 && n.type & 4)) this.addMatch(n.index, -2);
          else {
            let i = vo$1(n, t, o, false, false);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function Wy(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function Gy(e, t) {
  return e.type & 11 ? pn$1(e, t) : e.type & 4 ? Ko$1(e, t) : null;
}
function zy(e, t, n, r) {
  return n === -1 ? Gy(t, e) : n === -2 ? Qy(e, t, r) : Bn$2(e, e[g$1], n, t);
}
function Qy(e, t, n) {
  if (n === Jn$2) return pn$1(t, e);
  if (n === Wn$2) return Ko$1(t, e);
  if (n === Xo$1) return Gd(t, e);
}
function zd(e, t, n, r) {
  let o = t[Me].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(zy(t, u, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function ra$1(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = zd(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = t[-c];
        for (let d = F; d < u.length; d++) {
          let p = u[d];
          p[Ze$1] === p[U$2] && ra$1(p[g$1], p, l, r);
        }
        if (u[Tt$1] !== null) {
          let d = u[Tt$1];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            ra$1(f[g$1], f, l, r);
          }
        }
      }
    }
  }
  return r;
}
function Qd(e, t) {
  return e[Me].queries[t].queryList;
}
function Zd(e, t, n) {
  let r = new bo$1((n & 4) === 4);
  return (bl(e, t, r, r.destroy), (t[Me] ??= new ea$1()).queries.push(new Xs(r)) - 1);
}
function Zy(e, t, n) {
  let r = P$1();
  return (
    r.firstCreatePass &&
      (Yd(r, new Ro$1(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = true)),
    Zd(r, v(), t)
  );
}
function Yy(e, t, n, r) {
  let o = P$1();
  if (o.firstCreatePass) {
    let i = q();
    (Yd(o, new Ro$1(t, n, r), i.index), Jy(o, e), (n & 2) === 2 && (o.staticContentQueries = true));
  }
  return Zd(o, v(), n);
}
function Ky(e) {
  return e.split(',').map((t) => t.trim());
}
function Yd(e, t, n) {
  (e.queries === null && (e.queries = new ta$1()), e.queries.track(new na$1(t, n)));
}
function Jy(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function Kd(e, t) {
  return e.queries.getByIndex(t);
}
function Xy(e, t) {
  let n = e[g$1],
    r = Kd(n, t);
  return r.crossesNgTemplate ? ra$1(n, e, t, []) : zd(n, e, r, t);
}
function Pa$2(e, t, n) {
  let r,
    o = yn$1(() => {
      r._dirtyCounter();
      let i = ev(r, e);
      if (t && i === void 0) throw new b$1(-951, false);
      return i;
    });
  return ((r = o[j]), (r._dirtyCounter = lo(0)), (r._flatValue = void 0), o);
}
function Fa$1(e) {
  return Pa$2(true, false);
}
function ja$1(e) {
  return Pa$2(true, true);
}
function Jd(e) {
  return Pa$2(false, false);
}
function Xd(e, t) {
  let n = e[j];
  ((n._lView = v()),
    (n._queryIndex = t),
    (n._queryList = Qd(n._lView, t)),
    n._queryList.onDirty(() => n._dirtyCounter.update((r) => r + 1)));
}
function ev(e, t) {
  let n = e._lView,
    r = e._queryIndex;
  if (n === void 0 || r === void 0 || n[I] & 4) return t ? void 0 : Z$1;
  let o = Qd(n, r),
    i = Xy(n, r);
  return (
    o.reset(i, Cg),
    t
      ? o.first
      : o._changesDetected || e._flatValue === void 0
        ? (e._flatValue = o.toArray())
        : e._flatValue
  );
}
function Va$1(e) {
  return !!e && typeof e.then == 'function';
}
function ef(e) {
  return !!e && typeof e.subscribe == 'function';
}
var dn = class {},
  tf = class {};
var ko$1 = class ko extends dn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    constructor(t, n, r, o = true) {
      (super(), (this.ngModuleType = t), (this._parent = n));
      let i = sl(t);
      ((this._bootstrapComponents = Wg(i.bootstrap)),
        (this._r3Injector = Ms$1(
          t,
          n,
          [{ provide: dn, useValue: this }, ...r],
          Nn$2(t),
          new Set(['environment']),
        )),
        o && this.resolveInjectorInitializers());
    }
    resolveInjectorInitializers() {
      (this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType)));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      (!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null));
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Oo$1 = class Oo extends tf {
    moduleType;
    constructor(t) {
      (super(), (this.moduleType = t));
    }
    create(t) {
      return new ko$1(this.moduleType, t, []);
    }
  };
var Zn$2 = class Zn extends dn {
  injector;
  instance = null;
  constructor(t) {
    super();
    let n = new gt$1(
      [...t.providers, { provide: dn, useValue: this }],
      t.parent || Rn$2(),
      t.debugName,
      new Set(['environment']),
    );
    ((this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers());
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function nf(e, t, n = null) {
  return new Zn$2({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: true })
    .injector;
}
var tv = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Ji$2(false, n.type),
          o = r.length > 0 ? nf([r], this._injector, '') : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = oe({ token: e, providedIn: 'environment', factory: () => new e(we$1(re)) });
  }
  return e;
})();
function nv(e) {
  return Vo$1(() => {
    let t = rf(e),
      n = B$1(H({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection !== ga$1.Eager,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(tv).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? false,
        data: e.data || {},
        encapsulation: e.encapsulation || xt$1.Emulated,
        styles: e.styles || Z$1,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    (t.standalone && $e$2('NgStandalone'), of(n));
    let r = e.dependencies;
    return ((n.directiveDefs = Iu(r, rv)), (n.pipeDefs = Iu(r, al)), (n.id = cv(n)), n);
  });
}
function rv(e) {
  return yt$1(e) || Wi$2(e);
}
function ov(e) {
  return Vo$1(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Z$1,
    declarations: e.declarations || Z$1,
    imports: e.imports || Z$1,
    exports: e.exports || Z$1,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function iv(e, t) {
  if (e == null) return vt$1;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      (Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = zo$1.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s));
    }
  return n;
}
function sv(e) {
  if (e == null) return vt$1;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function av(e) {
  return Vo$1(() => {
    let t = rf(e);
    return (of(t), t);
  });
}
function rf(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    viewProvidersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || vt$1,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? true,
    signals: e.signals === true,
    selectors: e.selectors || Z$1,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    controlDef: null,
    signalFormsInputPresence: null,
    inputs: iv(e.inputs, t),
    outputs: sv(e.outputs),
    debugInfo: null,
  };
}
function of(e) {
  e.features?.forEach((t) => t(e));
}
function Iu(e, t) {
  return e
    ? () => {
        let n = typeof e == 'function' ? e() : e,
          r = [];
        for (let o of n) {
          let i = t(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function cv(e) {
  let t = 0,
    n = typeof e.consts == 'function' ? '' : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join('|')) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return ((t += 2147483648), 'c' + t);
}
var sf = new x$1('');
var Ha$1 = (() => {
  class e {
    resolve;
    reject;
    initialized = false;
    done = false;
    donePromise = new Promise((n, r) => {
      ((this.resolve = n), (this.reject = r));
    });
    appInits = E(sf, { optional: true }) ?? [];
    injector = E(fe$1);
    constructor() {}
    runInitializers() {
      if (this.initialized) return;
      let n = [];
      for (let o of this.appInits) {
        let i = Zr(this.injector, o);
        if (Va$1(i)) n.push(i);
        else if (ef(i)) {
          let s = new Promise((a, c) => {
            i.subscribe({ complete: a, error: c });
          });
          n.push(s);
        }
      }
      let r = () => {
        ((this.done = true), this.resolve());
      };
      (Promise.all(n)
        .then(() => {
          r();
        })
        .catch((o) => {
          this.reject(o);
        }),
        n.length === 0 && r(),
        (this.initialized = true));
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function af(e, t, n, r, o, i, s, a) {
  if (n.firstCreatePass) {
    e.mergedAttrs = Ho$1(e.mergedAttrs, e.attrs);
    let u = (e.tView = Ma$1(
      2,
      e,
      o,
      i,
      s,
      n.directiveRegistry,
      n.pipeRegistry,
      null,
      n.schemas,
      n.consts,
      null,
    ));
    n.queries !== null && (n.queries.template(n, e), (u.queries = n.queries.embeddedTView(e)));
  }
  (a && (e.flags |= a), Mt$1(e, false));
  let c = uv(n, t);
  (ao$1() && Ca$1(n, t, c, e), cn(c, t));
  let l = Sd(c, t, c, e);
  ((t[r + L] = l), Na$1(t, l));
}
function lv(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + L,
    p;
  return (
    t.firstCreatePass
      ? ((p = Ot$2(t, d, 4, s || null, a || null)), Bd(t, e, p, le(t.consts, l), Sa$1), Ru(t, p))
      : (p = t.data[d]),
    af(p, e, t, n, r, o, i, c),
    en(p) && Qo$1(t, e, p),
    l != null && hn(e, p, u),
    p
  );
}
function Yn$2(e, t, n, r, o, i, s, a, c, l, u) {
  let d = n + L,
    p;
  if (t.firstCreatePass) {
    if (((p = Ot$2(t, d, 4, s || null, a || null)), l != null)) {
      let f = le(t.consts, l);
      p.localNames = [];
      for (let h = 0; h < f.length; h += 2) p.localNames.push(f[h], -1);
    }
  } else p = t.data[d];
  return (af(p, e, t, n, r, o, i, c), l != null && hn(e, p, u), p);
}
function cf(e, t, n, r, o, i, s, a) {
  let c = v(),
    l = P$1(),
    u = le(l.consts, i);
  return (lv(c, l, e, t, n, r, o, u, void 0, s, a), cf);
}
var uv = dv;
function dv(e, t, n, r) {
  return (Pn$2(true), t[R].createComment(''));
}
var fv = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = oe({ token: e, factory: e.ɵfac, providedIn: 'platform' });
  }
  return e;
})();
var lf = new x$1('');
var uf = new x$1('');
function df() {
  ci$2(() => {
    let e = '';
    throw new b$1(600, e);
  });
}
var pv = 10;
var nr$2 = (() => {
  class e {
    _runningTick = false;
    _destroyed = false;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = E(Nt$2);
    afterRenderManager = E(Uo$1);
    zonelessEnabled = E(on);
    rootEffectScheduler = E(fo$1);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = false;
    afterTick = new ke$1();
    get allViews() {
      return [
        ...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = E(_t$1);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(De$1((n) => !n));
    }
    constructor() {
      E(kt$2, { optional: true });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = E(re);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = fe$1.NULL) {
      return this._injector.get(W).run(() => {
        if ((A(_.BootstrapComponentStart), !this._injector.get(Ha$1).done)) {
          let k = '';
          throw new b$1(405, k);
        }
        let a = yt$1(n),
          c = this._injector.get(dn),
          l = new Qn$1(a, c);
        this.componentTypes.push(n);
        let { hostElement: u, directives: d, bindings: p } = hv(r),
          f = u || l.selector,
          h = l.create(o, [], f, c.injector, d, p),
          D = h.location.nativeElement,
          N = h.injector.get(lf, null);
        return (
          N?.registerApplication(D),
          h.onDestroy(() => {
            (this.detachView(h.hostView), Hn$2(this.components, h), N?.unregisterApplication(D));
          }),
          this._loadComponent(h),
          A(_.BootstrapComponentEnd, h),
          h
        );
      });
    }
    tick() {
      (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
    }
    _tick() {
      (A(_.ChangeDetectionStart),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run($o$1.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl());
    }
    tickImpl = () => {
      if (this._runningTick) throw (A(_.ChangeDetectionEnd), new b$1(101, false));
      let n = m(null);
      try {
        ((this._runningTick = !0), this.synchronize());
      } finally {
        ((this._runningTick = false),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          m(n),
          this.afterTick.next(),
          A(_.ChangeDetectionEnd));
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Gn$2, null, { optional: true }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < pv; ) {
        A(_.ChangeDetectionSyncStart);
        try {
          this.synchronizeOnce();
        } finally {
          A(_.ChangeDetectionSyncEnd);
        }
      }
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 && ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let n = false;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
        for (let { _lView: o } of this.allViews) {
          if (!r && !On$2(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          (bd(o, i), (n = true));
        }
        if (((this.dirtyFlags &= -5), this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)) return;
      }
      (n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 && ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews());
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => On$2(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      (this._views.push(r), r.attachToAppRef(this));
    }
    detachView(n) {
      let r = n;
      (Hn$2(this._views, r), r.detachFromAppRef());
    }
    _loadComponent(n) {
      this.attachView(n.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      (this.components.push(n), this._injector.get(uf, []).forEach((o) => o(n)));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          (this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy()));
        } finally {
          ((this._destroyed = true), (this._views = []), (this._destroyListeners = []));
        }
    }
    onDestroy(n) {
      return (this._destroyListeners.push(n), () => Hn$2(this._destroyListeners, n));
    }
    destroy() {
      if (this._destroyed) throw new b$1(406, false);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function hv(e) {
  return e === void 0 || typeof e == 'string' || e instanceof Element ? { hostElement: e } : e;
}
function Hn$2(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function ff(e, t, n, r) {
  let o = v(),
    i = Je$2();
  if (ee$1(o, i, t)) {
    P$1();
    let a = Ln$2();
    Hm(a, o, e, t, n, r);
  }
  return ff;
}
var oa$1 = class oa {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      (this.attach(r, i), this.attach(o, s));
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function Ls$1(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function gv(e, t, n, r) {
  let o,
    i,
    s = 0,
    a = e.length - 1;
  if (Array.isArray(t)) {
    m(r);
    let l = t.length - 1;
    for (m(null); s <= a && s <= l; ) {
      let u = e.at(s),
        d = t[s],
        p = Ls$1(s, u, s, d, n);
      if (p !== 0) {
        (p < 0 && e.updateValue(s, d), s++);
        continue;
      }
      let f = e.at(a),
        h = t[l],
        D = Ls$1(a, f, l, h, n);
      if (D !== 0) {
        (D < 0 && e.updateValue(a, h), a--, l--);
        continue;
      }
      let N = n(s, u),
        k = n(a, f),
        Lt = n(s, d);
      if (Object.is(Lt, k)) {
        let ri = n(l, h);
        (Object.is(ri, N) ? (e.swap(s, a), e.updateValue(a, h), l--, a--) : e.move(a, s),
          e.updateValue(s, d),
          s++);
        continue;
      }
      if (((o ??= new Lo$1()), (i ??= wu(e, s, a, n)), ia$1(e, o, s, Lt)))
        (e.updateValue(s, d), s++, a++);
      else if (i.has(Lt)) (o.set(N, e.detach(s)), a--);
      else {
        let ri = e.create(s, t[s]);
        (e.attach(s, ri), s++, a++);
      }
    }
    for (; s <= l; ) (Du(e, o, n, s, t[s]), s++);
  } else if (t != null) {
    m(r);
    let l = t[Symbol.iterator]();
    m(null);
    let u = l.next();
    for (; !u.done && s <= a; ) {
      let d = e.at(s),
        p = u.value,
        f = Ls$1(s, d, s, p, n);
      if (f !== 0) (f < 0 && e.updateValue(s, p), s++, (u = l.next()));
      else {
        ((o ??= new Lo$1()), (i ??= wu(e, s, a, n)));
        let h = n(s, p);
        if (ia$1(e, o, s, h)) (e.updateValue(s, p), s++, a++, (u = l.next()));
        else if (!i.has(h)) (e.attach(s, e.create(s, p)), s++, a++, (u = l.next()));
        else {
          let D = n(s, d);
          (o.set(D, e.detach(s)), a--);
        }
      }
    }
    for (; !u.done; ) (Du(e, o, n, e.length, u.value), (u = l.next()));
  }
  for (; s <= a; ) e.destroy(e.detach(a--));
  o?.forEach((l) => {
    e.destroy(l);
  });
}
function ia$1(e, t, n, r) {
  return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), true) : false;
}
function Du(e, t, n, r, o) {
  if (ia$1(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function wu(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var Lo$1 = class Lo {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return false;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      true
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) ((r = o.get(r)), t(r, n));
      }
  }
};
function mv(e, t, n, r, o, i, s, a) {
  $e$2('NgControlFlow');
  let c = v(),
    l = P$1(),
    u = le(l.consts, i);
  return (Yn$2(c, l, e, t, n, r, o, u, 256, s, a), Ba$1);
}
function Ba$1(e, t, n, r, o, i, s, a) {
  $e$2('NgControlFlow');
  let c = v(),
    l = P$1(),
    u = le(l.consts, i);
  return (Yn$2(c, l, e, t, n, r, o, u, 512, s, a), Ba$1);
}
function yv(e, t) {
  $e$2('NgControlFlow');
  let n = v(),
    r = Je$2(),
    o = n[r] !== te$1 ? n[r] : -1,
    i = o !== -1 ? Po$1(n, L + o) : void 0,
    s = 0;
  if (ee$1(n, r, e)) {
    let a = m(null);
    try {
      if ((i !== void 0 && Ad(i, s), e !== -1)) {
        let c = L + e,
          l = Po$1(n, c),
          u = la$1(n[g$1], c),
          d = kd(l, u, n),
          p = Xn$1(n, u, t, { dehydratedView: d });
        er$2(l, p, s, un(u, d));
      }
    } finally {
      m(a);
    }
  } else if (i !== void 0) {
    let a = xd(i, s);
    a !== void 0 && (a[V] = t);
  }
}
var sa$1 = class sa {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    ((this.lContainer = t), (this.$implicit = n), (this.$index = r));
  }
  get $count() {
    return this.lContainer.length - F;
  }
};
function vv(e, t) {
  return t;
}
var aa$1 = class aa {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    ((this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r));
  }
};
function Ev(e, t, n, r, o, i, s, a, c, l, u, d, p) {
  $e$2('NgControlFlow');
  let f = v(),
    h = P$1(),
    D = c !== void 0,
    N = v(),
    k = a ? s.bind(N[Y][V]) : s,
    Lt = new aa$1(D, k);
  ((N[L + e] = Lt),
    Yn$2(f, h, e + 1, t, n, r, o, le(h.consts, i), 256),
    D && Yn$2(f, h, e + 2, c, l, u, d, le(h.consts, p), 512));
}
var ca$1 = class ca extends oa$1 {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = false;
  constructor(t, n, r) {
    (super(), (this.lContainer = t), (this.hostLView = n), (this.templateTNode = r));
  }
  get length() {
    return this.lContainer.length - F;
  }
  at(t) {
    return this.getLView(t)[V].$implicit;
  }
  attach(t, n) {
    let r = n[It$1];
    ((this.needsIndexUpdate ||= t !== this.length),
      er$2(this.lContainer, n, t, un(this.templateTNode, r)),
      Dv(this.lContainer, t));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1),
      wv(this.lContainer, t),
      Tv(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = No$1(this.lContainer, this.templateTNode.tView.ssrId);
    return Xn$1(this.hostLView, this.templateTNode, new sa$1(this.lContainer, n, t), {
      dehydratedView: r,
    });
  }
  destroy(t) {
    Wo$1(t[g$1], t);
  }
  updateValue(t, n) {
    this.getLView(t)[V].$implicit = n;
  }
  reset() {
    this.needsIndexUpdate = false;
  }
  updateIndexes() {
    if (this.needsIndexUpdate) for (let t = 0; t < this.length; t++) this.getLView(t)[V].$index = t;
  }
  getLView(t) {
    return Cv(this.lContainer, t);
  }
};
function Iv(e) {
  let t = m(null),
    n = Se$1();
  try {
    let r = v(),
      o = r[g$1],
      i = r[n],
      s = n + 1,
      a = Po$1(r, s);
    if (i.liveCollection === void 0) {
      let l = la$1(o, s);
      i.liveCollection = new ca$1(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((gv(c, e, i.trackByFn, t), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = Je$2(),
        u = c.length === 0;
      if (ee$1(r, l, u)) {
        let d = n + 2,
          p = Po$1(r, d);
        if (u) {
          let f = la$1(o, d),
            h = kd(p, f, r),
            D = Xn$1(r, f, void 0, { dehydratedView: h });
          er$2(p, D, 0, un(f, h));
        } else (o.firstUpdatePass && uy(p), Ad(p, 0));
      }
    }
  } finally {
    m(t);
  }
}
function Po$1(e, t) {
  return e[t];
}
function Dv(e, t) {
  if (e.length <= F) return;
  let n = F + t,
    r = e[n],
    o = r ? r[Ne$1] : void 0;
  if (r && o && o.detachedLeaveAnimationFns && o.detachedLeaveAnimationFns.length > 0) {
    let i = r[Ce];
    (dm(i, o), ln.delete(r[_e]), (o.detachedLeaveAnimationFns = void 0));
  }
}
function wv(e, t) {
  if (e.length <= F) return;
  let n = F + t,
    r = e[n],
    o = r ? r[Ne$1] : void 0;
  o && o.leave && o.leave.size > 0 && (o.detachedLeaveAnimationFns = []);
}
function Tv(e, t) {
  return qn$2(e, t);
}
function Cv(e, t) {
  return xd(e, t);
}
function la$1(e, t) {
  return Kr(e, t);
}
function pf(e, t, n) {
  let r = v(),
    o = Je$2();
  if (ee$1(r, o, t)) {
    P$1();
    let s = Ln$2();
    vd(s, r, e, t, r[R], n);
  }
  return pf;
}
function ua$1(e, t, n, r, o) {
  xa$1(t, e, n, o ? 'class' : 'style', r);
}
function Fo$1(e, t, n, r) {
  let o = v(),
    i = o[g$1],
    s = e + L,
    a = i.firstCreatePass ? Oa$1(s, o, 2, t, Sa$1, no$1(), n, r) : i.data[s];
  if (He$2(a)) {
    let c = o[be].tracingService;
    if (c && c.componentCreate) {
      let l = i.data[a.directiveStart + a.componentOffset];
      return c.componentCreate(Pd(l), () => (Tu(e, t, o, a, r), Fo$1));
    }
  }
  return (Tu(e, t, o, a, r), Fo$1);
}
function Tu(e, t, n, r, o) {
  if ((Zo$1(r, n, e, t, mf), en(r))) {
    let i = n[g$1];
    (Qo$1(i, n, r), ma$1(i, r, n));
  }
  o != null && hn(n, r);
}
function $a$1() {
  let e = P$1(),
    t = q(),
    n = Yo$1(t);
  return (
    e.firstCreatePass && La$1(e, n),
    gs(n) && ms$1(),
    ps$1(),
    n.classesWithoutHost != null && ug(n) && ua$1(e, n, v(), n.classesWithoutHost, true),
    n.stylesWithoutHost != null && dg(n) && ua$1(e, n, v(), n.stylesWithoutHost, false),
    $a$1
  );
}
function hf(e, t, n, r) {
  return (Fo$1(e, t, n, r), $a$1(), hf);
}
function Ua$1(e, t, n, r) {
  let o = v(),
    i = o[g$1],
    s = e + L,
    a = i.firstCreatePass ? Ud(s, i, 2, t, n, r) : i.data[s];
  return (Zo$1(a, o, e, t, mf), r != null && hn(o, a), Ua$1);
}
function qa$1() {
  let e = q(),
    t = Yo$1(e);
  return (gs(t) && ms$1(), ps$1(), qa$1);
}
function gf(e, t, n, r) {
  return (Ua$1(e, t, n, r), qa$1(), gf);
}
var mf = (e, t, n, r, o) => (Pn$2(true), td(t[R], r, bs$1()));
function Wa$1(e, t, n) {
  let r = v(),
    o = r[g$1],
    i = e + L,
    s = o.firstCreatePass ? Oa$1(i, r, 8, 'ng-container', Sa$1, no$1(), t, n) : o.data[i];
  if ((Zo$1(s, r, e, 'ng-container', If), en(s))) {
    let a = r[g$1];
    (Qo$1(a, r, s), ma$1(a, s, r));
  }
  return (n != null && hn(r, s), Wa$1);
}
function ei$1() {
  let e = P$1(),
    t = q(),
    n = Yo$1(t);
  return (e.firstCreatePass && La$1(e, n), ei$1);
}
function yf(e, t, n) {
  return (Wa$1(e, t, n), ei$1(), yf);
}
function Ga$1(e, t, n) {
  let r = v(),
    o = r[g$1],
    i = e + L,
    s = o.firstCreatePass ? Ud(i, o, 8, 'ng-container', t, n) : o.data[i];
  return (Zo$1(s, r, e, 'ng-container', If), n != null && hn(r, s), Ga$1);
}
function vf() {
  let e = q();
  Yo$1(e);
  return ei$1;
}
function Ef(e, t, n) {
  return (Ga$1(e, t, n), vf(), Ef);
}
var If = (e, t, n, r, o) => (Pn$2(true), Hg(t[R], ''));
function bv() {
  return v();
}
function Df(e, t, n) {
  let r = v(),
    o = Je$2();
  if (ee$1(r, o, t)) {
    P$1();
    let s = Ln$2();
    Ed(s, r, e, t, r[R], n);
  }
  return Df;
}
var rr$2 = 'en-US';
function wf(e) {
  typeof e == 'string' && e.toLowerCase().replace(/_/g, '-');
}
function Tf(e, t, n) {
  let r = v(),
    o = P$1(),
    i = q();
  return (bf(o, r, r[R], i, e, t, n), Tf);
}
function Cf(e, t, n) {
  let r = v(),
    o = P$1(),
    i = q();
  return ((i.type & 3 || n) && jd(i, o, r, n, r[R], e, t, Io(i, r, t)), Cf);
}
function bf(e, t, n, r, o, i, s) {
  let a = true,
    c = null;
  if (((r.type & 3 || s) && ((c ??= Io(r, t, i)), jd(r, e, t, s, n, o, i, c) && (a = false)), a)) {
    let l = r.outputs?.[o],
      u = r.hostDirectiveOutputs?.[o];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let p = u[d],
          f = u[d + 1];
        ((c ??= Io(r, t, i)), hu(r, t, p, f, o, c));
      }
    if (l && l.length) for (let d of l) ((c ??= Io(r, t, i)), hu(r, t, d, o, o, c));
  }
}
function _v(e = 1) {
  return Hl(e);
}
function Sv(e) {
  let t = v()[Y][z];
  if (!t.projection) {
    let n = 1,
      r = (t.projection = pl(n, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null; ) {
      if (i.type !== 128) {
        let s = 0;
        (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i));
      }
      i = i.next;
    }
  }
}
function xv(e, t = 0, n, r, o, i) {
  let s = v(),
    a = P$1(),
    c = null;
  let l = Ot$2(a, L + e, 16, null, null);
  (l.projection === null && (l.projection = t), Es$1());
  let d = !s[It$1] || hs$1();
  s[Y][z].projection[l.projection] === null && c !== null
    ? Av(s, a, c)
    : d && !Bo$1(l) && bm(a, s, l);
}
function Av(e, t, n) {
  let r = L + n,
    o = t.data[r],
    i = e[r],
    s = No$1(i, o.tView.ssrId),
    a = Xn$1(e, o, void 0, { dehydratedView: s });
  er$2(i, a, 0, un(o, s));
}
function Mf(e, t, n, r, o) {
  return (Xd(t, Yy(e, n, r, o)), Mf);
}
function _f(e, t, n, r) {
  return (Xd(e, Zy(t, n, r)), _f);
}
function Rv(e = 1) {
  oo$1(Pl() + e);
}
function kv(e) {
  let t = Is$1();
  return cs$1(t, L + e);
}
function go$1(e, t) {
  return (e << 17) | (t << 2);
}
function At$1(e) {
  return (e >> 17) & 32767;
}
function Ov(e) {
  return (e & 2) == 2;
}
function Lv(e, t) {
  return (e & 131071) | (t << 17);
}
function da$1(e) {
  return e | 2;
}
function fn$1(e) {
  return (e & 131068) >> 2;
}
function Ps$1(e, t) {
  return (e & -131069) | (t << 2);
}
function Pv(e) {
  return (e & 1) === 1;
}
function fa$1(e) {
  return e | 1;
}
function Fv(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = At$1(s),
    c = fn$1(s);
  e[r] = n;
  let l = false,
    u;
  if (Array.isArray(n)) {
    let d = n;
    ((u = d[1]), (u === null || Kt$1(d, u) > 0) && (l = true));
  } else u = n;
  if (o)
    if (c !== 0) {
      let p = At$1(e[a + 1]);
      ((e[r + 1] = go$1(p, a)),
        p !== 0 && (e[p + 1] = Ps$1(e[p + 1], r)),
        (e[a + 1] = Lv(e[a + 1], r)));
    } else ((e[r + 1] = go$1(a, 0)), a !== 0 && (e[a + 1] = Ps$1(e[a + 1], r)), (a = r));
  else ((e[r + 1] = go$1(c, 0)), a === 0 ? (a = r) : (e[c + 1] = Ps$1(e[c + 1], r)), (c = r));
  (l && (e[r + 1] = da$1(e[r + 1])),
    Cu(e, u, r, true),
    Cu(e, u, r, false),
    jv(t, u, e, r, i),
    (s = go$1(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s));
}
function jv(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null && typeof t == 'string' && Kt$1(i, t) >= 0 && (n[r + 1] = fa$1(n[r + 1]));
}
function Cu(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? At$1(o) : fn$1(o),
    a = false;
  for (; s !== 0 && (a === false || i); ) {
    let c = e[s],
      l = e[s + 1];
    (Vv(c, t) && ((a = true), (e[s + 1] = r ? fa$1(l) : da$1(l))), (s = r ? At$1(l) : fn$1(l)));
  }
  a && (e[n + 1] = r ? da$1(o) : fa$1(o));
}
function Vv(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? true
    : Array.isArray(e) && typeof t == 'string'
      ? Kt$1(e, t) >= 0
      : false;
}
var me$1 = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function Hv(e) {
  return e.substring(me$1.key, me$1.keyEnd);
}
function Bv(e) {
  return ($v(e), Nf(e, Sf(e, 0, me$1.textEnd)));
}
function Nf(e, t) {
  let n = me$1.textEnd;
  return n === t ? -1 : ((t = me$1.keyEnd = Uv(e, (me$1.key = t), n)), Sf(e, t, n));
}
function $v(e) {
  ((me$1.key = 0),
    (me$1.keyEnd = 0),
    (me$1.value = 0),
    (me$1.valueEnd = 0),
    (me$1.textEnd = e.length));
}
function Sf(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function Uv(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function xf(e, t, n) {
  return (Rf(e, t, n, false), xf);
}
function Af(e, t) {
  return (Rf(e, t, null, true), Af);
}
function qv(e) {
  Gv(Jv, Wv, e, true);
}
function Wv(e, t) {
  for (let n = Bv(t); n >= 0; n = Nf(t, n)) zr(e, Hv(t), true);
}
function Rf(e, t, n, r) {
  let o = v(),
    i = P$1(),
    s = ws$1(2);
  if ((i.firstUpdatePass && Of(i, e, s, r), t !== te$1 && ee$1(o, s, t))) {
    let a = i.data[Se$1()];
    Lf(i, a, o, o[R], e, (o[s + 1] = eE(t, n)), r, s);
  }
}
function Gv(e, t, n, r) {
  let o = P$1(),
    i = ws$1(2);
  o.firstUpdatePass && Of(o, null, i, r);
  let s = v();
  if (n !== te$1 && ee$1(s, i, n)) {
    let a = o.data[Se$1()];
    if (Pf(a, r) && !kf(o, i)) {
      let c = a.classesWithoutHost;
      (c !== null && (n = Br(c, n || '')), ua$1(o, a, s, n, r));
    } else Xv(o, a, s, s[R], s[i + 1], (s[i + 1] = Kv(e, t, n)), r, i);
  }
}
function kf(e, t) {
  return t >= e.expandoStartIndex;
}
function Of(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[Se$1()],
      s = kf(e, n);
    (Pf(i, r) && t === null && !s && (t = false), (t = zv(o, i, t, r)), Fv(o, i, t, n, s, r));
  }
}
function zv(e, t, n, r) {
  let o = Ll(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Fs(null, e, t, n, r)), (n = Kn$1(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Fs(o, e, t, n, r)), i === null)) {
        let c = Qv(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Fs(null, e, t, c[1], r)), (c = Kn$1(c, t.attrs, r)), Zv(e, t, r, c));
      } else i = Yv(e, t, r);
  }
  return (i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n);
}
function Qv(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (fn$1(r) !== 0) return e[At$1(r)];
}
function Zv(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[At$1(o)] = r;
}
function Yv(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Kn$1(r, s, n);
  }
  return Kn$1(r, t.attrs, n);
}
function Fs(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Kn$1(r, i.hostAttrs, o)), i !== e);
  )
    a++;
  return (e !== null && (n.directiveStylingLast = a), r);
}
function Kn$1(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]), zr(e, s, n ? true : t[++i]));
    }
  return e === void 0 ? null : e;
}
function Kv(e, t, n) {
  if (n == null || n === '') return Z$1;
  let r = [],
    o = ya$1(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], true);
  else if (o instanceof Set) for (let i of o) e(r, i, true);
  else if (typeof o == 'object') for (let i in o) Object.hasOwn(o, i) && e(r, i, o[i]);
  else typeof o == 'string' && t(r, o);
  return r;
}
function Jv(e, t, n) {
  let r = String(t);
  r !== '' && !r.includes(' ') && zr(e, r, n);
}
function Xv(e, t, n, r, o, i, s, a) {
  o === te$1 && (o = Z$1);
  let c = 0,
    l = 0,
    u = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; u !== null || d !== null; ) {
    let p = c < o.length ? o[c + 1] : void 0,
      f = l < i.length ? i[l + 1] : void 0,
      h = null,
      D;
    (u === d
      ? ((c += 2), (l += 2), p !== f && ((h = d), (D = f)))
      : d === null || (u !== null && u < d)
        ? ((c += 2), (h = u))
        : ((l += 2), (h = d), (D = f)),
      h !== null && Lf(e, t, n, r, h, D, s, a),
      (u = c < o.length ? o[c] : null),
      (d = l < i.length ? i[l] : null));
  }
}
function Lf(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = Pv(l) ? bu(c, t, n, o, fn$1(l), s) : void 0;
  if (!jo$1(u)) {
    jo$1(i) || (Ov(l) && (i = bu(c, null, n, o, a, s)));
    let d = as$1(Se$1(), n);
    _m(r, s, d, o, i);
  }
}
function bu(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = n[o + 1];
    p === te$1 && (p = d ? Z$1 : void 0);
    let f = d ? Qr(p, r) : u === r ? p : void 0;
    if ((l && !jo$1(f) && (f = Qr(c, r)), jo$1(f) && ((a = f), s))) return a;
    let h = e[o + 1];
    o = s ? At$1(h) : fn$1(h);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Qr(c, r));
  }
  return a;
}
function jo$1(e) {
  return e !== void 0;
}
function eE(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string' ? (e = e + t) : typeof e == 'object' && (e = Nn$2(ya$1(e)))),
    e
  );
}
function Pf(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function tE(e, t = '') {
  let n = v(),
    r = P$1(),
    o = e + L,
    i = r.firstCreatePass ? Ot$2(r, o, 1, t, null) : r.data[o],
    s = nE(r, n, i, t);
  ((n[o] = s), ao$1() && Ca$1(r, n, s, i), Mt$1(i, false));
}
var nE = (e, t, n, r) => (Pn$2(true), jg(t[R], r));
function Ff(e, t, n, r = '') {
  return ee$1(e, Je$2(), n) ? t + Gi$2(n) + r : te$1;
}
function jf(e) {
  return (za$1('', e), jf);
}
function za$1(e, t, n) {
  let r = v(),
    o = Ff(r, e, t, n);
  return (o !== te$1 && rE(r, Se$1(), o), za$1);
}
function rE(e, t, n) {
  let r = as$1(t, e);
  Vg(e[R], r, n);
}
function Vf(e, t, n) {
  ho$1(t) && (t = t());
  let r = v(),
    o = Je$2();
  if (ee$1(r, o, t)) {
    P$1();
    let s = Ln$2();
    vd(s, r, e, t, r[R], n);
  }
  return Vf;
}
function oE(e, t) {
  let n = ho$1(e);
  return (n && e.set(t), n);
}
function Hf(e, t) {
  let n = v(),
    r = P$1(),
    o = q();
  return (bf(r, n, n[R], o, e, t), Hf);
}
var Bf = {};
function $f(e) {
  $e$2('NgLet');
  let t = P$1(),
    n = v(),
    r = e + L,
    o = Ot$2(t, r, 128, null, null);
  return (Mt$1(o, false), Jr(t, n, r, Bf), $f);
}
function iE(e) {
  let t = P$1(),
    n = v(),
    r = Se$1();
  return (Jr(t, n, r, e), e);
}
function sE(e) {
  let t = Is$1(),
    n = cs$1(t, L + e);
  if (n === Bf) throw new b$1(314, false);
  return n;
}
function aE(e, t, n = '') {
  return Ff(v(), e, t, n);
}
function Mu(e, t, n) {
  let r = P$1();
  r.firstCreatePass && Uf(t, r.data, r.blueprint, Ke(e), n);
}
function Uf(e, t, n, r, o) {
  if (((e = G$1(e)), Array.isArray(e))) for (let i = 0; i < e.length; i++) Uf(e[i], t, n, r, o);
  else {
    let i = P$1(),
      s = v(),
      a = q(),
      c = ht$2(e) ? e : G$1(e.provide),
      l = ts$1(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (ht$2(e) || !e.multi) {
      let f = new St$1(l, o, Jo$1, null),
        h = Vs(c, t, u + p, d);
      h === -1
        ? ($s(Co$1(a, s), i, c),
          js(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          n.push(f),
          s.push(f))
        : ((n[h] = f), (s[h] = f));
    } else {
      let f = Vs(c, t, u + p, d),
        h = Vs(c, t, u, u + p),
        D = f >= 0 && n[f],
        N = h >= 0 && n[h];
      if (!D) {
        $s(Co$1(a, s), i, c);
        let k = uE(cE, n.length, o, r, l);
        (N && (n[h].providerFactory = k),
          js(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          n.push(k),
          s.push(k));
      } else {
        let k = qf(n[f], l, r);
        js(i, e, f > -1 ? f : h, k);
      }
      r && N && n[h].componentProviders++;
    }
  }
}
function js(e, t, n, r) {
  let o = ht$2(t),
    i = vl(t);
  if (o || i) {
    let c = (i ? G$1(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function qf(e, t, n) {
  return (n && e.componentProviders++, e.multi.push(t) - 1);
}
function Vs(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function cE(e, t, n, r, o) {
  return pa$1(this.multi, []);
}
function pa$1(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function uE(e, t, n, r, o, i) {
  let s = new St$1(e, n, Jo$1, null);
  return ((s.multi = []), (s.index = t), (s.componentProviders = 0), qf(s, o, r && !n), s);
}
function dE(e, t) {
  return (n) => {
    n.providersResolver = (r, o) => Mu(r, o ? o(e) : e, false);
  };
}
function fE(e, t) {
  let n = nn() + e,
    r = v();
  return r[n] === te$1 ? tr$2(r, n, t()) : Fd(r, n);
}
function pE(e, t, n) {
  return yE(v(), nn(), e, t, n);
}
function hE(e, t, n, r) {
  return vE(v(), nn(), e, t, n, r);
}
function gE(e, t, n, r, o) {
  return EE(v(), nn(), e, t, n, r, o);
}
function mE(e, t, n, r, o, i, s, a) {
  let c = nn() + e,
    l = v(),
    u = yy(l, c, n, r, o, i);
  return zn$2(l, c + 4, s, a) || u ? tr$2(l, c + 6, t(n, r, o, i, s, a)) : Fd(l, c + 6);
}
function Qa$1(e, t) {
  let n = e[t];
  return n === te$1 ? void 0 : n;
}
function yE(e, t, n, r, o, i) {
  let s = t + n;
  return ee$1(e, s, o) ? tr$2(e, s + 1, r(o)) : Qa$1(e, s + 1);
}
function vE(e, t, n, r, o, i, s) {
  let a = t + n;
  return zn$2(e, a, o, i) ? tr$2(e, a + 2, r(o, i)) : Qa$1(e, a + 2);
}
function EE(e, t, n, r, o, i, s, a) {
  let c = t + n;
  return my(e, c, o, i, s) ? tr$2(e, c + 3, r(o, i, s)) : Qa$1(e, c + 3);
}
function IE(e, t) {
  return Ko$1(e, t);
}
var Wf = (() => {
  class e {
    applicationErrorHandler = E(Nt$2);
    appRef = E(nr$2);
    taskService = E(_t$1);
    ngZone = E(W);
    zonelessEnabled = E(on);
    tracing = E(kt$2, { optional: true });
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: true } }];
    subscriptions = new $();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(bn$1) : null;
    scheduleInRootZone =
      !this.zonelessEnabled && this.zoneIsDefined && (E(uo$1, { optional: true }) ?? false);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = false;
    runningTick = false;
    pendingRenderTaskId = null;
    constructor() {
      (this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          let n = this.taskService.add();
          if (
            !this.runningTick &&
            (this.cleanup(), !this.zonelessEnabled || this.appRef.includeAllTestViews)
          ) {
            this.taskService.remove(n);
            return;
          }
          (this.switchToMicrotaskScheduler(), this.taskService.remove(n));
        }),
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ));
    }
    switchToMicrotaskScheduler() {
      this.ngZone.runOutsideAngular(() => {
        let n = this.taskService.add();
        ((this.useMicrotaskScheduler = true),
          queueMicrotask(() => {
            ((this.useMicrotaskScheduler = false), this.taskService.remove(n));
          }));
      });
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 0:
        case 2: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 12: {
          this.appRef.dirtyFlags |= 16;
          break;
        }
        case 13: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 11:
          break;
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick())
      )
        return;
      let r = this.useMicrotaskScheduler ? ql : Ns$1;
      ((this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() => r(() => this.tick())))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            )));
    }
    shouldScheduleTick() {
      return !(
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(bn$1 + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            ((this.runningTick = !0), this.appRef._tick());
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        this.applicationErrorHandler(r);
      } finally {
        (this.taskService.remove(n), this.cleanup());
      }
    }
    ngOnDestroy() {
      (this.subscriptions.unsubscribe(), this.cleanup());
    }
    cleanup() {
      if (
        ((this.runningTick = false),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        ((this.pendingRenderTaskId = null), this.taskService.remove(n));
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function Gf() {
  return [
    { provide: Te$2, useExisting: Wf },
    { provide: W, useClass: Mn$2 },
    { provide: on, useValue: true },
  ];
}
var DE = (() => {
  class e {
    compileModuleSync(n) {
      return new Oo$1(n);
    }
    compileModuleAsync(n) {
      return Promise.resolve(this.compileModuleSync(n));
    }
    clearCache() {}
    clearCacheFor(n) {}
    getModuleId(n) {}
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function wE() {
  return (typeof $localize < 'u' && $localize.locale) || rr$2;
}
var Za$1 = new x$1('', { factory: () => E(Za$1, { optional: true, skipSelf: true }) || wE() });
var or$2 = class or {
  destroyed = false;
  listeners = null;
  errorHandler = E(je$1, { optional: true });
  isEmitting = false;
  hasNullListeners = false;
  destroyRef = E(Be$2);
  constructor() {
    this.destroyRef.onDestroy(() => {
      ((this.destroyed = true), (this.listeners = null));
    });
  }
  subscribe(t) {
    if (this.destroyed) throw new b$1(953, false);
    return (
      (this.listeners ??= []).push(t),
      {
        unsubscribe: () => {
          let n = this.listeners ? this.listeners.indexOf(t) : -1;
          n > -1 &&
            (this.isEmitting
              ? ((this.hasNullListeners = true), (this.listeners[n] = null))
              : this.listeners.splice(n, 1));
        },
      }
    );
  }
  emit(t) {
    if (this.destroyed) {
      console.warn(_n$1(953, false));
      return;
    }
    if (this.listeners === null) return;
    this.isEmitting = true;
    let n = m(null);
    try {
      for (let r of this.listeners)
        try {
          r !== null && r(t);
        } catch (o) {
          this.errorHandler?.handleError(o);
        }
    } finally {
      (this.hasNullListeners &&
        ((this.hasNullListeners = false), this.listeners && TE(this.listeners)),
        m(n),
        (this.isEmitting = false));
    }
  }
};
function TE(e) {
  let t = e.length - 1;
  for (; t > -1; ) (e[t] === null && e.splice(t, 1), t--);
}
function CE(e, t) {
  return yn$1(e);
}
function bE(e) {
  return gc(e);
}
var ME = (e) => e;
function _E(e, t) {
  if (typeof e == 'function') {
    let n = pi$2(e, ME, t?.equal);
    return zf(n);
  } else {
    let n = pi$2(e.source, e.computation, e.equal);
    return zf(n, e.debugName);
  }
}
function zf(e, t) {
  let n = e[j],
    r = e;
  return (
    (r.set = (o) => pc(n, o)),
    (r.update = (o) => hc(n, o)),
    (r.asReadonly = Fn$2.bind(e)),
    r
  );
}
var ni$1 = Symbol('InputSignalNode#UNSET'),
  ep = B$1(H({}, vn$1), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      Ge(e, t);
    },
  });
function tp(e, t) {
  let n = Object.create(ep);
  ((n.value = e), (n.transformFn = t?.transform));
  function r() {
    if ((Ae(n), n.value === ni$1)) {
      let o = null;
      throw new b$1(-950, o);
    }
    return n.value;
  }
  return ((r[j] = n), r);
}
function QO(e) {
  return NE(e) ? e.default : e;
}
function NE(e) {
  return e && typeof e == 'object' && 'default' in e;
}
function ZO(e) {
  return new or$2();
}
function Qf(e, t) {
  return tp(e, t);
}
function SE(e) {
  return tp(ni$1, e);
}
var YO = ((Qf.required = SE), Qf);
function np(e, t) {
  let n = Object.create(ep),
    r = new or$2();
  n.value = e;
  function o() {
    return (Ae(n), Zf(n.value), n.value);
  }
  return (
    (o[j] = n),
    (o.asReadonly = Fn$2.bind(o)),
    (o.set = (i) => {
      n.equal(n.value, i) || (Ge(n, i), r.emit(i));
    }),
    (o.update = (i) => {
      (Zf(n.value), o.set(i(n.value)));
    }),
    (o.subscribe = r.subscribe.bind(r)),
    (o.destroyRef = r.destroyRef),
    o
  );
}
function Zf(e) {
  if (e === ni$1) throw new b$1(952, false);
}
function Yf(e, t) {
  return np(e);
}
function xE(e) {
  return np(ni$1);
}
var KO = ((Yf.required = xE), Yf);
function Kf(e, t) {
  return Fa$1();
}
function AE(e, t) {
  return ja$1();
}
var JO = ((Kf.required = AE), Kf);
function Jf(e, t) {
  return Fa$1();
}
function RE(e, t) {
  return ja$1();
}
var XO = ((Jf.required = RE), Jf);
function eL(e, t) {
  return Jd();
}
var Ka$1 = class Ka {
    supports(t) {
      return t instanceof Map || ka$1(t);
    }
    create() {
      return new Ja$1();
    }
  },
  Ja$1 = class Ja {
    _records = new Map();
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    get isDirty() {
      return (
        this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null
      );
    }
    forEachItem(t) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) t(n);
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachChangedItem(t) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    diff(t) {
      if (!t) t = new Map();
      else if (!(t instanceof Map || ka$1(t))) throw new b$1(900, false);
      return this.check(t) ? this : null;
    }
    check(t) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(t, (r, o) => {
          if (n && n.key === o)
            (this._maybeAddToChanges(n, r), (this._appendAfter = n), (n = n._next));
          else {
            let i = this._getOrCreateRecordForKey(o, r);
            n = this._insertBeforeOrAppend(n, i);
          }
        }),
        n)
      ) {
        (n._prev && (n._prev._next = null), (this._removalsHead = n));
        for (let r = n; r !== null; r = r._nextRemoved)
          (r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null));
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(t, n) {
      if (t) {
        let r = t._prev;
        return (
          (n._next = t),
          (n._prev = r),
          (t._prev = n),
          r && (r._next = n),
          t === this._mapHead && (this._mapHead = n),
          (this._appendAfter = t),
          t
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(t, n) {
      if (this._records.has(t)) {
        let o = this._records.get(t);
        this._maybeAddToChanges(o, n);
        let i = o._prev,
          s = o._next;
        return (i && (i._next = s), s && (s._prev = i), (o._next = null), (o._prev = null), o);
      }
      let r = new Xa$1(t);
      return (this._records.set(t, r), (r.currentValue = n), this._addToAdditions(r), r);
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (
          this._previousMapHead = this._mapHead, t = this._previousMapHead;
          t !== null;
          t = t._next
        )
          t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
          t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded) t.previousValue = t.currentValue;
        ((this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null));
      }
    }
    _maybeAddToChanges(t, n) {
      Object.is(n, t.currentValue) ||
        ((t.previousValue = t.currentValue), (t.currentValue = n), this._addToChanges(t));
    }
    _addToAdditions(t) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = t)
        : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
    }
    _addToChanges(t) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = t)
        : ((this._changesTail._nextChanged = t), (this._changesTail = t));
    }
    _forEach(t, n) {
      t instanceof Map ? t.forEach(n) : Object.keys(t).forEach((r) => n(t[r], r));
    }
  },
  Xa$1 = class Xa {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) {
      this.key = t;
    }
  };
function Xf() {
  return new OE([new Ka$1()]);
}
var OE = (() => {
    class e {
      static ɵprov = oe({ token: e, providedIn: 'root', factory: Xf });
      factories;
      constructor(n) {
        this.factories = n;
      }
      static create(n, r) {
        if (r) {
          let o = r.factories.slice();
          n = n.concat(o);
        }
        return new e(n);
      }
      static extend(n) {
        return {
          provide: e,
          useFactory: () => {
            let r = E(e, { optional: true, skipSelf: true });
            return e.create(n, r || Xf());
          },
        };
      }
      find(n) {
        let r = this.factories.find((o) => o.supports(n));
        if (r) return r;
        throw new b$1(901, false);
      }
    }
    return e;
  })(),
  nL = (() => {
    class e {
      static __NG_ELEMENT_ID__ = LE;
    }
    return e;
  })();
function LE(e) {
  return PE(q(), v(), (e & 16) === 16);
}
function PE(e, t, n) {
  if (He$2(e) && !n) {
    let r = ce(e.index, t);
    return new tt$2(r, r);
  } else if (e.type & 175) {
    let r = t[Y];
    return new tt$2(r, t);
  }
  return null;
}
var FE = (() => {
    class e {
      zone = E(W);
      changeDetectionScheduler = E(Te$2);
      applicationRef = E(nr$2);
      applicationErrorHandler = E(Nt$2);
      _onMicrotaskEmptySubscription;
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  try {
                    ((this.applicationRef.dirtyFlags |= 1), this.applicationRef._tick());
                  } catch (n) {
                    this.applicationErrorHandler(n);
                  }
                });
            },
          }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  jE = new x$1('', { factory: () => false });
function VE({ ngZoneFactory: e, scheduleInRootZone: t }) {
  return (
    (e ??= () => new W(B$1(H({}, rp()), { scheduleInRootZone: t }))),
    [
      { provide: on, useValue: false },
      { provide: W, useFactory: e },
      {
        provide: Et$1,
        multi: true,
        useFactory: () => {
          let n = E(FE, { optional: true });
          return () => n.initialize();
        },
      },
      {
        provide: Et$1,
        multi: true,
        useFactory: () => {
          let n = E(HE);
          return () => {
            n.initialize();
          };
        },
      },
      { provide: uo$1, useValue: t ?? _s$1 },
    ]
  );
}
function rL(e) {
  let t = e?.scheduleInRootZone,
    n = VE({
      ngZoneFactory: () => {
        let r = rp(e);
        return (
          (r.scheduleInRootZone = t),
          r.shouldCoalesceEventChangeDetection && $e$2('NgZone_CoalesceEvent'),
          new W(r)
        );
      },
      scheduleInRootZone: t,
    });
  return Ki$2([{ provide: jE, useValue: true }, n]);
}
function rp(e) {
  return {
    enableLongStackTrace: false,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? false,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? false,
  };
}
var HE = (() => {
  class e {
    subscription = new $();
    initialized = false;
    zone = E(W);
    pendingTasks = E(_t$1);
    initialize() {
      if (this.initialized) return;
      this.initialized = true;
      let n = null;
      (!this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              (W.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                }));
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            (W.assertInAngularZone(), (n ??= this.pendingTasks.add()));
          }),
        ));
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = Rt$2({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var ec = new x$1(''),
  BE = new x$1('');
function ir$2(e) {
  return !e.moduleRef;
}
function $E(e) {
  let t = ir$2(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(W);
  return n.run(() => {
    ir$2(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Nt$2),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: r });
      }),
      ir$2(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(ec);
      (s.add(i),
        t.onDestroy(() => {
          (o.unsubscribe(), s.delete(i));
        }));
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(ec);
      (s.add(i),
        e.moduleRef.onDestroy(() => {
          (Hn$2(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i));
        }));
    }
    return qE(r, n, () => {
      let i = t.get(_t$1),
        s = i.add(),
        a = t.get(Ha$1);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = t.get(Za$1, rr$2);
            if ((wf(c || rr$2), !t.get(BE, !0)))
              return ir$2(e) ? t.get(nr$2) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (ir$2(e)) {
              let u = t.get(nr$2);
              return (e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u);
            } else return (UE?.(e.moduleRef, e.allPlatformModules), e.moduleRef);
          })
          .finally(() => {
            i.remove(s);
          })
      );
    });
  });
}
var UE;
function qE(e, t, n) {
  try {
    let r = n();
    return Va$1(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e(r)), r);
  }
}
var ti$1 = null;
function WE(e = [], t) {
  return fe$1.create({
    name: t,
    providers: [
      { provide: es$1, useValue: 'platform' },
      { provide: ec, useValue: new Set([() => (ti$1 = null)]) },
      ...e,
    ],
  });
}
function GE(e = []) {
  if (ti$1) return ti$1;
  let t = WE(e);
  return ((ti$1 = t), df(), zE(t), t);
}
function zE(e) {
  let t = e.get(Ql, null);
  Zr(e, () => {
    t?.forEach((n) => n());
  });
}
function oL(e) {
  let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
  A(_.BootstrapApplicationStart);
  try {
    let i = o?.injector ?? GE(r),
      s = [Gf(), Gl, ...(n || [])],
      a = new Zn$2({ providers: s, parent: i, debugName: '', runEnvironmentInitializers: !1 });
    return $E({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
  } catch (i) {
    return Promise.reject(i);
  } finally {
    A(_.BootstrapApplicationEnd);
  }
}
function iL(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false';
}
function sL(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
var Ya$1 = Symbol('NOT_SET'),
  op = new Set(),
  QE = B$1(H({}, vn$1), {
    kind: 'afterRenderEffectPhase',
    consumerIsAlwaysLive: true,
    consumerAllowSignalWrites: true,
    value: Ya$1,
    cleanup: null,
    consumerMarkedDirty() {
      if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase) return;
        this.sequence.erroredOrDestroyed = true;
      }
      this.sequence.scheduler.notify(7);
    },
    phaseFn(e) {
      if (((this.sequence.lastPhase = this.phase), !this.dirty)) return this.signal;
      if (((this.dirty = false), this.value !== Ya$1 && !Ft$1(this))) return this.signal;
      try {
        for (let o of this.cleanup ?? op) o();
      } finally {
        this.cleanup?.clear();
      }
      let t = [];
      (e !== void 0 && t.push(e), t.push(this.registerCleanupFn));
      let n = Re$1(this),
        r;
      try {
        r = this.userFn.apply(null, t);
      } finally {
        qe(this, n);
      }
      return (
        (this.value === Ya$1 || !this.equal(this.value, r)) && ((this.value = r), this.version++),
        this.signal
      );
    },
  }),
  tc = class extends $n$2 {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    onDestroyFns = null;
    constructor(t, n, r, o, i, s = null) {
      (super(t, [void 0, void 0, void 0, void 0], r, false, i.get(Be$2), s), (this.scheduler = o));
      for (let a of Ia$1) {
        let c = n[a];
        if (c === void 0) continue;
        let l = Object.create(QE);
        ((l.sequence = this),
          (l.phase = a),
          (l.userFn = c),
          (l.dirty = true),
          (l.signal = () => (Ae(l), l.value)),
          (l.signal[j] = l),
          (l.registerCleanupFn = (u) => (l.cleanup ??= new Set()).add(u)),
          (this.nodes[a] = l),
          (this.hooks[a] = (u) => l.phaseFn(u)));
      }
    }
    afterRun() {
      (super.afterRun(), (this.lastPhase = null));
    }
    destroy() {
      if (this.onDestroyFns !== null) for (let t of this.onDestroyFns) t();
      super.destroy();
      for (let t of this.nodes)
        if (t)
          try {
            for (let n of t.cleanup ?? op) n();
          } finally {
            We(t);
          }
    }
  };
function aL(e, t) {
  let n = E(fe$1),
    r = n.get(Te$2),
    o = n.get(Uo$1),
    i = n.get(kt$2, null, { optional: true });
  o.impl ??= n.get(Da$1);
  let s = e;
  typeof s == 'function' && (s = { mixedReadWrite: e });
  let a = n.get(rn, null, { optional: true }),
    c = new tc(
      o.impl,
      [s.earlyRead, s.write, s.mixedReadWrite, s.read],
      a?.view,
      r,
      n,
      i?.snapshot(null),
    );
  return (o.impl.register(c), c);
}
var ee = new x$1('MANAGER'),
  Je$1 = new x$1('GUTTER_SIZE'),
  Ot$1 = new x$1('NDL_LAYOUT_MANAGER'),
  xn$1 = {
    allTabsTooltip: 'All tabs',
    newTabTooltip: 'New tab',
    newTabDefaultTitle: 'New Tab',
    editTabTooltip: 'Edit Tab',
    splitColumnTooltip: 'Split Column',
    splitRowTooltip: 'Split Row',
    closePaneTooltip: 'Close Pane',
    closeTabTooltip: 'Close tab',
  },
  he = new x$1('NDL_LABELS', { factory: () => xn$1 }),
  Lt$1 = new x$1('NDL_TAB_CONTEXT'),
  et$1 = new x$1('EMPTY_PANE_TEMPLATE'),
  tt$1 = new x$1('DRAG_PREVIEW_TEMPLATE');
var U$1 = class n {
  #e = lo({});
  getTabComponent(i) {
    return this.#e()[i]?.componentRef;
  }
  getTabContext(i) {
    return this.#e()[i]?.context;
  }
  addTabComponent(i, e, t, r) {
    (this.#e.update((o) =>
      B$1(H({}, o), { [i]: { componentRef: e, viewContainerRef: r, context: t } }),
    ),
      e.onDestroy(() => this.deleteTabComponent(i)));
  }
  deleteTabComponent(i) {
    this.#e.update((e) => {
      let o = e,
        { [i]: t } = o;
      return cp(o, [ZE(i)]);
    });
  }
  detachTabComponent(i) {
    let e = this.#e()[i];
    if (e) {
      let t = e.viewContainerRef.indexOf(e.componentRef.hostView);
      t !== -1 && e.viewContainerRef.detach(t);
    }
  }
  attachTabComponent(i, e) {
    let t = this.#e()[i];
    t &&
      (e.insert(t.componentRef.hostView),
      this.#e.update((r) => B$1(H({}, r), { [i]: B$1(H({}, t), { viewContainerRef: e }) })));
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵprov = oe({ token: n, factory: n.ɵfac });
};
var G = class n {
  currentDragData = lo(void 0);
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵprov = oe({ token: n, factory: n.ɵfac });
};
function Fr() {
  return [U$1, G];
}
var Fn$1 = null;
function nt$1() {
  return Fn$1;
}
function Jn$1(n) {
  Fn$1 ??= n;
}
var kt$1 = class kt {},
  it$1 = (() => {
    class n {
      historyGo(e) {
        throw new Error('');
      }
      static ɵfac = function (t) {
        return new (t || n)();
      };
      static ɵprov = oe({ token: n, factory: () => E(Mn$1), providedIn: 'platform' });
    }
    return n;
  })();
var Mn$1 = (() => {
  class n extends it$1 {
    _location;
    _history;
    _doc = E(co$1);
    constructor() {
      (super(), (this._location = window.location), (this._history = window.history));
    }
    getBaseHrefFromDOM() {
      return nt$1().getBaseHref(this._doc);
    }
    onPopState(e) {
      let t = nt$1().getGlobalEventTarget(this._doc, 'window');
      return (t.addEventListener('popstate', e, false), () => t.removeEventListener('popstate', e));
    }
    onHashChange(e) {
      let t = nt$1().getGlobalEventTarget(this._doc, 'window');
      return (
        t.addEventListener('hashchange', e, false),
        () => t.removeEventListener('hashchange', e)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(e) {
      this._location.pathname = e;
    }
    pushState(e, t, r) {
      this._history.pushState(e, t, r);
    }
    replaceState(e, t, r) {
      this._history.replaceState(e, t, r);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(e = 0) {
      this._history.go(e);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (t) {
      return new (t || n)();
    };
    static ɵprov = oe({ token: n, factory: () => new n(), providedIn: 'platform' });
  }
  return n;
})();
function On$1(n, i) {
  return n
    ? i
      ? n.endsWith('/')
        ? i.startsWith('/')
          ? n + i.slice(1)
          : n + i
        : i.startsWith('/')
          ? n + i
          : `${n}/${i}`
      : n
    : i;
}
function Pn$1(n) {
  let i = n.search(/#|\?|$/);
  return n[i - 1] === '/' ? n.slice(0, i - 1) + n.slice(i) : n;
}
function te(n) {
  return n && n[0] !== '?' ? `?${n}` : n;
}
var rt$1 = (() => {
    class n {
      historyGo(e) {
        throw new Error('');
      }
      static ɵfac = function (t) {
        return new (t || n)();
      };
      static ɵprov = oe({ token: n, factory: () => E(ti), providedIn: 'root' });
    }
    return n;
  })(),
  ei = new x$1(''),
  ti = (() => {
    class n extends rt$1 {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(e, t) {
        (super(),
          (this._platformLocation = e),
          (this._baseHref =
            t ?? this._platformLocation.getBaseHrefFromDOM() ?? E(co$1).location?.origin ?? ''));
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(e) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(e),
          this._platformLocation.onHashChange(e),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(e) {
        return On$1(this._baseHref, e);
      }
      path(e = false) {
        let t = this._platformLocation.pathname + te(this._platformLocation.search),
          r = this._platformLocation.hash;
        return r && e ? `${t}${r}` : t;
      }
      pushState(e, t, r, o) {
        let a = this.prepareExternalUrl(r + te(o));
        this._platformLocation.pushState(e, t, a);
      }
      replaceState(e, t, r, o) {
        let a = this.prepareExternalUrl(r + te(o));
        this._platformLocation.replaceState(e, t, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(e = 0) {
        this._platformLocation.historyGo?.(e);
      }
      static ɵfac = function (t) {
        return new (t || n)(we$1(it$1), we$1(ei, 8));
      };
      static ɵprov = oe({ token: n, factory: n.ɵfac, providedIn: 'root' });
    }
    return n;
  })();
var Ln$1 = (() => {
  class n {
    _subject = new ke$1();
    _basePath;
    _locationStrategy;
    _urlChangeListeners = [];
    _urlChangeSubscription = null;
    constructor(e) {
      this._locationStrategy = e;
      let t = this._locationStrategy.getBaseHref();
      ((this._basePath = ri(Pn$1(In$1(t)))),
        this._locationStrategy.onPopState((r) => {
          this._subject.next({ url: this.path(true), pop: true, state: r.state, type: r.type });
        }));
    }
    ngOnDestroy() {
      (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []));
    }
    path(e = false) {
      return this.normalize(this._locationStrategy.path(e));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(e, t = '') {
      return this.path() == this.normalize(e + te(t));
    }
    normalize(e) {
      return n.stripTrailingSlash(ii$1(this._basePath, In$1(e)));
    }
    prepareExternalUrl(e) {
      return (e && e[0] !== '/' && (e = '/' + e), this._locationStrategy.prepareExternalUrl(e));
    }
    go(e, t = '', r = null) {
      (this._locationStrategy.pushState(r, '', e, t),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(e + te(t)), r));
    }
    replaceState(e, t = '', r = null) {
      (this._locationStrategy.replaceState(r, '', e, t),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(e + te(t)), r));
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(e = 0) {
      this._locationStrategy.historyGo?.(e);
    }
    onUrlChange(e) {
      return (
        this._urlChangeListeners.push(e),
        (this._urlChangeSubscription ??= this.subscribe((t) => {
          this._notifyUrlChangeListeners(t.url, t.state);
        })),
        () => {
          let t = this._urlChangeListeners.indexOf(e);
          (this._urlChangeListeners.splice(t, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null)));
        }
      );
    }
    _notifyUrlChangeListeners(e = '', t) {
      this._urlChangeListeners.forEach((r) => r(e, t));
    }
    subscribe(e, t, r) {
      return this._subject.subscribe({ next: e, error: t ?? void 0, complete: r ?? void 0 });
    }
    static normalizeQueryParams = te;
    static joinWithSlash = On$1;
    static stripTrailingSlash = Pn$1;
    static ɵfac = function (t) {
      return new (t || n)(we$1(rt$1));
    };
    static ɵprov = oe({ token: n, factory: () => ni(), providedIn: 'root' });
  }
  return n;
})();
function ni() {
  return new Ln$1(we$1(rt$1));
}
function ii$1(n, i) {
  if (!n || !i.startsWith(n)) return i;
  let e = i.substring(n.length);
  return e === '' || ['/', ';', '?', '#'].includes(e[0]) ? e : i;
}
function In$1(n) {
  return n.replace(/\/index\.html$/, '');
}
function ri(n) {
  if (new RegExp('^(https?:)?//').test(n)) {
    let [, e] = n.split(/\/\/[^\/]+/);
    return e;
  }
  return n;
}
var Rt$1 = (() => {
    class n {
      _ngEl;
      _differs;
      _renderer;
      _ngStyle = null;
      _differ = null;
      constructor(e, t, r) {
        ((this._ngEl = e), (this._differs = t), (this._renderer = r));
      }
      set ngStyle(e) {
        ((this._ngStyle = e),
          !this._differ && e && (this._differ = this._differs.find(e).create()));
      }
      ngDoCheck() {
        if (this._differ) {
          let e = this._differ.diff(this._ngStyle);
          e && this._applyChanges(e);
        }
      }
      _setStyle(e, t) {
        let [r, o] = e.split('.'),
          a = r.indexOf('-') === -1 ? void 0 : _o$1.DashCase;
        t != null
          ? this._renderer.setStyle(this._ngEl.nativeElement, r, o ? `${t}${o}` : t, a)
          : this._renderer.removeStyle(this._ngEl.nativeElement, r, a);
      }
      _applyChanges(e) {
        (e.forEachRemovedItem((t) => this._setStyle(t.key, null)),
          e.forEachAddedItem((t) => this._setStyle(t.key, t.currentValue)),
          e.forEachChangedItem((t) => this._setStyle(t.key, t.currentValue)));
      }
      static ɵfac = function (t) {
        return new (t || n)(Jo$1(Jn$2), Jo$1(OE), Jo$1(hy));
      };
      static ɵdir = av({
        type: n,
        selectors: [['', 'ngStyle', '']],
        inputs: { ngStyle: 'ngStyle' },
      });
    }
    return n;
  })(),
  me = (() => {
    class n {
      _viewContainerRef;
      _viewRef = null;
      ngTemplateOutletContext = null;
      ngTemplateOutlet = null;
      ngTemplateOutletInjector = null;
      injector = E(fe$1);
      constructor(e) {
        this._viewContainerRef = e;
      }
      ngOnChanges(e) {
        if (this._shouldRecreateView(e)) {
          let t = this._viewContainerRef;
          if ((this._viewRef && t.remove(t.indexOf(this._viewRef)), !this.ngTemplateOutlet)) {
            this._viewRef = null;
            return;
          }
          let r = this._createContextForwardProxy();
          this._viewRef = t.createEmbeddedView(this.ngTemplateOutlet, r, {
            injector: this._getInjector(),
          });
        }
      }
      _getInjector() {
        return this.ngTemplateOutletInjector === 'outlet'
          ? this.injector
          : (this.ngTemplateOutletInjector ?? void 0);
      }
      _shouldRecreateView(e) {
        return !!e.ngTemplateOutlet || !!e.ngTemplateOutletInjector;
      }
      _createContextForwardProxy() {
        return new Proxy(
          {},
          {
            set: (e, t, r) =>
              this.ngTemplateOutletContext
                ? Reflect.set(this.ngTemplateOutletContext, t, r)
                : false,
            get: (e, t, r) => {
              if (this.ngTemplateOutletContext)
                return Reflect.get(this.ngTemplateOutletContext, t, r);
            },
          },
        );
      }
      static ɵfac = function (t) {
        return new (t || n)(Jo$1(Xo$1));
      };
      static ɵdir = av({
        type: n,
        selectors: [['', 'ngTemplateOutlet', '']],
        inputs: {
          ngTemplateOutletContext: 'ngTemplateOutletContext',
          ngTemplateOutlet: 'ngTemplateOutlet',
          ngTemplateOutletInjector: 'ngTemplateOutletInjector',
        },
        features: [rg],
      });
    }
    return n;
  })();
var Be$1 = (() => {
  class n {
    static ɵfac = function (t) {
      return new (t || n)();
    };
    static ɵmod = ov({ type: n });
    static ɵinj = il({});
  }
  return n;
})();
function ai$1(n, i) {
  i = encodeURIComponent(i);
  for (let e of n.split(';')) {
    let t = e.indexOf('='),
      [r, o] = t == -1 ? [e, ''] : [e.slice(0, t), e.slice(t + 1)];
    if (r.trim() === i) return decodeURIComponent(o);
  }
  return null;
}
var Pa$1 = 'browser';
function ze$1(n) {
  n || (n = E(Be$2));
  let i = new M((e) => {
    if (n.destroyed) {
      e.next();
      return;
    }
    return n.onDestroy(e.next.bind(e));
  });
  return (e) => e.pipe(Jc(i));
}
var $n$1 = ['*'],
  ui$1 = (n, i, e, t, r, o) => ({
    areaBefore: n,
    areaAfter: i,
    gutterNum: e,
    first: t,
    last: r,
    isDragged: o,
  });
function di$1(n, i) {
  n & 1 && yf(0);
}
function li$1(n, i) {
  if ((n & 1 && (Wa$1(0), cf(1, di$1, 1, 0, 'ng-container', 5), ei$1()), n & 2)) {
    let e = i.$implicit,
      t = _v(3),
      r = t.$implicit,
      o = t.$index,
      a = t.$index,
      l = _v();
    (Am(),
      pf('ngTemplateOutlet', l.customGutter().template)(
        'ngTemplateOutletContext',
        mE(
          3,
          ui$1,
          r,
          l._areas()[o + 1],
          o + 1,
          a === 0,
          o === l._areas().length - 2,
          l.draggedGutterIndex() === o,
        ),
      )('ngTemplateOutletInjector', e));
  }
}
function ci$1(n, i) {
  if ((n & 1 && cf(0, li$1, 2, 10, 'ng-container', 4), n & 2)) {
    let e = _v(2).$index;
    pf('asSplitGutterDynamicInjector', e + 1);
  }
}
function gi$1(n, i) {
  n & 1 && hf(0, 'div', 3);
}
function pi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'div', 2, 0),
      Tf('asSplitCustomClick', function () {
        Nl(e);
        let r = _v().$index,
          o = _v();
        return Sl(o.gutterClicked(r));
      })('asSplitCustomDblClick', function () {
        Nl(e);
        let r = _v().$index,
          o = _v();
        return Sl(o.gutterDoubleClicked(r));
      })('asSplitCustomMouseDown', function (r) {
        Nl(e);
        let o = kv(1),
          a = _v().$index,
          l = _v();
        return Sl(l.gutterMouseDown(r, o, a, a, a + 1));
      })('asSplitCustomKeyDown', function (r) {
        Nl(e);
        let o = _v().$index,
          a = _v();
        return Sl(a.gutterKeyDown(r, o, o, o + 1));
      }),
      mv(2, ci$1, 1, 1, 'ng-container')(3, gi$1, 1, 0, 'div', 3),
      $a$1());
  }
  if (n & 2) {
    let e,
      t = _v(),
      r = t.$implicit,
      o = t.$index,
      a = _v();
    (Af('as-dragged', a.draggedGutterIndex() === o),
      pf('ngStyle', a.getGutterGridStyle(o + 1))(
        'asSplitCustomMultiClickThreshold',
        a.gutterDblClickDuration(),
      )('asSplitCustomClickDeltaInPx', a.gutterClickDeltaPx()),
      ff('aria-label', a.gutterAriaLabel())('aria-orientation', a.direction())(
        'aria-valuemin',
        a.getAriaValue(r.minSize()),
      )('aria-valuemax', a.getAriaValue(r.maxSize()))(
        'aria-valuenow',
        a.getAriaValue(r._internalSize()),
      )('aria-valuetext', a.getAriaAreaSizeText(r)),
      Am(2),
      yv((e = a.customGutter()) != null && e.template ? 2 : 3));
  }
}
function fi$1(n, i) {
  if ((n & 1 && mv(0, pi$1, 4, 12, 'div', 1), n & 2)) {
    let e = i.$index,
      t = i.$count;
    yv(e !== t - 1 ? 0 : -1);
  }
}
function hi$1(n, i) {
  n & 1 && gf(0, 'div', 0);
}
var mi$1 = {
    dir: 'ltr',
    direction: 'horizontal',
    disabled: false,
    gutterDblClickDuration: 0,
    gutterSize: 11,
    gutterStep: 1,
    gutterClickDeltaPx: 2,
    restrictMove: false,
    unit: 'percent',
    useTransition: false,
  },
  Di$1 = new x$1('angular-split-global-config', { providedIn: 'root', factory: () => mi$1 });
var Rn$1 = (() => {
    class n {
      constructor() {
        ((this.template = E(Wn$2)),
          (this._gutterToHandleElementMap = new Map()),
          (this._gutterToExcludeDragElementMap = new Map()));
      }
      _canStartDragging(e, t) {
        return this._gutterToExcludeDragElementMap.has(t) &&
          this._gutterToExcludeDragElementMap.get(t).some((o) => o.nativeElement.contains(e))
          ? false
          : this._gutterToHandleElementMap.has(t)
            ? this._gutterToHandleElementMap.get(t).some((r) => r.nativeElement.contains(e))
            : true;
      }
      _addToMap(e, t, r) {
        e.has(t) ? e.get(t).push(r) : e.set(t, [r]);
      }
      _removedFromMap(e, t, r) {
        let o = e.get(t);
        (o.splice(o.indexOf(r), 1), o.length === 0 && e.delete(t));
      }
      static ngTemplateContextGuard(e, t) {
        return true;
      }
      static {
        this.ɵfac = function (t) {
          return new (t || n)();
        };
      }
      static {
        this.ɵdir = av({ type: n, selectors: [['', 'asSplitGutter', '']] });
      }
    }
    return n;
  })(),
  _i$1 = new x$1('Gutter num');
var bi$1 = (() => {
  class n {
    constructor() {
      ((this.vcr = E(Xo$1)),
        (this.templateRef = E(Wn$2)),
        (this.gutterNum = YO.required({ alias: 'asSplitGutterDynamicInjector' })),
        Zl(() => {
          this.vcr.clear();
          let e = fe$1.create({
            providers: [{ provide: _i$1, useValue: this.gutterNum() }],
            parent: this.vcr.injector,
          });
          this.vcr.createEmbeddedView(this.templateRef, { $implicit: e });
        }));
    }
    static ngTemplateContextGuard(e, t) {
      return true;
    }
    static {
      this.ɵfac = function (t) {
        return new (t || n)();
      };
    }
    static {
      this.ɵdir = av({
        type: n,
        selectors: [['', 'asSplitGutterDynamicInjector', '']],
        inputs: { gutterNum: [1, 'asSplitGutterDynamicInjector', 'gutterNum'] },
      });
    }
  }
  return n;
})();
function $e$1(n) {
  if (((e) => window.TouchEvent && n instanceof TouchEvent)()) {
    if (n.changedTouches.length === 0) return;
    let { clientX: e, clientY: t } = n.changedTouches[0];
    return { x: e, y: t };
  }
  if (n instanceof KeyboardEvent) {
    let e = n.target;
    return { x: e.offsetLeft + e.offsetWidth / 2, y: e.offsetTop + e.offsetHeight / 2 };
  }
  return { x: n.clientX, y: n.clientY };
}
function Hn$1(n, i, e, t) {
  if (!t.contains(n.target) || !t.contains(i.target)) return false;
  let r = $e$1(n),
    o = $e$1(i);
  return Math.abs(o.x - r.x) <= e && Math.abs(o.y - r.y) <= e;
}
function Nn$1(n) {
  return Zp(
    Ti$2(n, 'mousedown').pipe(Or((i) => i.button === 0)),
    Ti$2(n, 'touchstart', { passive: false }),
  );
}
function Nt$1(n) {
  return Zp(Ti$2(n, 'mousemove'), Ti$2(n, 'touchmove'));
}
function at$1(n, i = false) {
  let e = Zp(Ti$2(n, 'mouseup'), Ti$2(n, 'touchend'));
  return i ? Zp(e, Ti$2(n, 'touchcancel')) : e;
}
function Bt$1(n, i) {
  return n.reduce((e, t) => e + i(t), 0);
}
function Ci$1(n, i) {
  return n.reduce((e, t, r) => {
    let [o, a] = i(t, r);
    return ((e[o] = a), e);
  }, {});
}
function Vn$1(n) {
  return Object.entries(n)
    .filter(([, i]) => i)
    .map(([i]) => i)
    .join(' ');
}
function zt$1() {
  return (n) => new M((i) => E(W).runOutsideAngular(() => n.subscribe(i)));
}
var ot$1 = (n) => (i) => sL(i, n),
  yi$1 = (n, i) => {
    throw new Error(`as-split: unknown value "${n}" for "${i}"`);
  },
  vi$1 = (() => {
    class n {
      constructor() {
        ((this.elementRef = E(Jn$2)),
          (this.document = E(co$1)),
          (this.multiClickThreshold = YO.required({ alias: 'asSplitCustomMultiClickThreshold' })),
          (this.deltaInPx = YO.required({ alias: 'asSplitCustomClickDeltaInPx' })),
          (this.mouseDown = ZO()),
          (this.click = ZO()),
          (this.dblClick = ZO()),
          (this.keyDown = ZO()),
          Ti$2(this.elementRef.nativeElement, 'keydown')
            .pipe(zt$1(), ze$1())
            .subscribe((t) => this.keyDown.emit(t)));
        let e = Nn$1(this.elementRef.nativeElement).pipe(
          Kc((t) =>
            Nt$1(this.document).pipe(
              Or((r) => !Hn$1(t, r, this.deltaInPx(), this.elementRef.nativeElement)),
              dt$2(1),
              De$1(() => true),
              Jc(at$1(this.document)),
            ),
          ),
        );
        Nn$1(this.elementRef.nativeElement)
          .pipe(
            Xc((t) => this.mouseDown.emit(t)),
            sh(),
            oh((t, { interval: r }) => (r >= this.multiClickThreshold() ? 1 : t + 1), 0),
            Kc((t) =>
              at$1(this.elementRef.nativeElement).pipe(
                sh(),
                dt$2(1),
                t === 2
                  ? De$1(() => t)
                  : ne$1(({ interval: r }) =>
                      r >= this.multiClickThreshold()
                        ? xp(t)
                        : xp(t).pipe(Kp(this.multiClickThreshold() - r)),
                    ),
              ),
            ),
            Jc(e),
            rh(),
            zt$1(),
            ze$1(),
          )
          .subscribe((t) => {
            t === 1 ? this.click.emit() : t === 2 && this.dblClick.emit();
          });
      }
      static {
        this.ɵfac = function (t) {
          return new (t || n)();
        };
      }
      static {
        this.ɵdir = av({
          type: n,
          selectors: [['', 'asSplitCustomEventsBehavior', '']],
          inputs: {
            multiClickThreshold: [1, 'asSplitCustomMultiClickThreshold', 'multiClickThreshold'],
            deltaInPx: [1, 'asSplitCustomClickDeltaInPx', 'deltaInPx'],
          },
          outputs: {
            mouseDown: 'asSplitCustomMouseDown',
            click: 'asSplitCustomClick',
            dblClick: 'asSplitCustomDblClick',
            keyDown: 'asSplitCustomKeyDown',
          },
        });
      }
    }
    return n;
  })();
function Bn$1(n, i, e) {
  if (n.length === 0) return true;
  let t = n.map((a) => {
      let l = a.size();
      return l === 'auto' ? '*' : l;
    }),
    r = t.filter((a) => a === '*');
  if (r.length > 1) return false;
  if (i === 'pixel') return r.length === 1 ? true : false;
  let o = Bt$1(t, (a) => (a === '*' ? 0 : a));
  return r.length === 1 ? (o <= 100.1 ? true : false) : o < 99.9 || o > 100.1 ? false : true;
}
var $t$1 = new x$1('Split Area Contract'),
  Ht$1 = (() => {
    class n {
      get hostClassesBinding() {
        return this.hostClasses();
      }
      get hostDirBinding() {
        return this.dir();
      }
      constructor() {
        ((this.document = E(co$1)),
          (this.elementRef = E(Jn$2)),
          (this.ngZone = E(W)),
          (this.defaultOptions = E(Di$1)),
          (this.gutterMouseDownSubject = new ke$1()),
          (this.dragProgressSubject = new ke$1()),
          (this._areas = eL()),
          (this.customGutter = XO(Rn$1)),
          (this.gutterSize = YO(this.defaultOptions.gutterSize, {
            transform: ot$1(this.defaultOptions.gutterSize),
          })),
          (this.gutterStep = YO(this.defaultOptions.gutterStep, {
            transform: ot$1(this.defaultOptions.gutterStep),
          })),
          (this.disabled = YO(this.defaultOptions.disabled, { transform: iL })),
          (this.gutterClickDeltaPx = YO(this.defaultOptions.gutterClickDeltaPx, {
            transform: ot$1(this.defaultOptions.gutterClickDeltaPx),
          })),
          (this.direction = YO(this.defaultOptions.direction)),
          (this.dir = YO(this.defaultOptions.dir)),
          (this.unit = YO(this.defaultOptions.unit)),
          (this.gutterAriaLabel = YO()),
          (this.restrictMove = YO(this.defaultOptions.restrictMove, { transform: iL })),
          (this.useTransition = YO(this.defaultOptions.useTransition, { transform: iL })),
          (this.gutterDblClickDuration = YO(this.defaultOptions.gutterDblClickDuration, {
            transform: ot$1(this.defaultOptions.gutterDblClickDuration),
          })),
          (this.gutterClick = ZO()),
          (this.gutterDblClick = ZO()),
          (this.dragStart = ZO()),
          (this.dragEnd = ZO()),
          (this.transitionEnd = ZO()),
          (this.dragProgress$ = this.dragProgressSubject.asObservable()),
          (this._visibleAreas = CE(() => this._areas().filter((e) => e.visible()))),
          (this.gridTemplateColumnsStyle = CE(() => this.createGridTemplateColumnsStyle())),
          (this.hostClasses = CE(() =>
            Vn$1({
              [`as-${this.direction()}`]: true,
              [`as-${this.unit()}`]: true,
              'as-disabled': this.disabled(),
              'as-dragging': this._isDragging(),
              'as-transition': this.useTransition() && !this._isDragging(),
            }),
          )),
          (this.draggedGutterIndex = lo(void 0)),
          (this._isDragging = CE(() => this.draggedGutterIndex() !== void 0)),
          (this._alignedVisibleAreasSizes = CE(() => this.createAlignedVisibleAreasSize())),
          aL({
            write: () => {
              this.elementRef.nativeElement.style.gridTemplate = this.gridTemplateColumnsStyle();
            },
          }),
          this.gutterMouseDownSubject
            .pipe(
              Or(
                (e) =>
                  !this.customGutter() ||
                  this.customGutter()._canStartDragging(e.mouseDownEvent.target, e.gutterIndex + 1),
              ),
              Kc((e) =>
                Nt$1(this.document).pipe(
                  Yc(e.mouseDownEvent),
                  nh(),
                  ih(([, t]) =>
                    Hn$1(e.mouseDownEvent, t, this.gutterClickDeltaPx(), e.gutterElement),
                  ),
                  dt$2(1),
                  Jc(Zp(at$1(this.document, true), Ti$2(this.document, 'blur'))),
                  Xc(() => {
                    this.ngZone.run(() => {
                      (this.dragStart.emit(this.createDragInteractionEvent(e.gutterIndex)),
                        this.draggedGutterIndex.set(e.gutterIndex));
                    });
                  }),
                  De$1(([t]) =>
                    this.createDragStartContext(t, e.areaBeforeGutterIndex, e.areaAfterGutterIndex),
                  ),
                  Kc((t) =>
                    Nt$1(this.document).pipe(
                      Xc((r) => this.mouseDragMove(r, t)),
                      Jc(at$1(this.document, true)),
                      Xc({
                        complete: () =>
                          this.ngZone.run(() => {
                            (this.dragEnd.emit(
                              this.createDragInteractionEvent(this.draggedGutterIndex()),
                            ),
                              this.draggedGutterIndex.set(void 0));
                          }),
                      }),
                    ),
                  ),
                ),
              ),
              ze$1(),
            )
            .subscribe(),
          Ti$2(this.elementRef.nativeElement, 'transitionend')
            .pipe(
              Or((e) => e.propertyName.startsWith('grid-template')),
              zt$1(),
              ze$1(),
            )
            .subscribe(() =>
              this.ngZone.run(() => this.transitionEnd.emit(this.createAreaSizes())),
            ));
      }
      gutterClicked(e) {
        this.ngZone.run(() => this.gutterClick.emit(this.createDragInteractionEvent(e)));
      }
      gutterDoubleClicked(e) {
        this.ngZone.run(() => this.gutterDblClick.emit(this.createDragInteractionEvent(e)));
      }
      gutterMouseDown(e, t, r, o, a) {
        (e.preventDefault(),
          e.stopPropagation(),
          !this.disabled() &&
            this.gutterMouseDownSubject.next({
              mouseDownEvent: e,
              gutterElement: t,
              gutterIndex: r,
              areaBeforeGutterIndex: o,
              areaAfterGutterIndex: a,
            }));
      }
      gutterKeyDown(e, t, r, o) {
        if (this.disabled()) return;
        let a = 50,
          l = 10,
          _ = 0,
          y = 0;
        if (this.direction() === 'horizontal')
          switch (e.key) {
            case 'ArrowLeft':
              _ -= a;
              break;
            case 'ArrowRight':
              _ += a;
              break;
            case 'PageUp':
              this.dir() === 'rtl' ? (_ -= a * l) : (_ += a * l);
              break;
            case 'PageDown':
              this.dir() === 'rtl' ? (_ += a * l) : (_ -= a * l);
              break;
            default:
              return;
          }
        else
          switch (e.key) {
            case 'ArrowUp':
              y -= a;
              break;
            case 'ArrowDown':
              y += a;
              break;
            case 'PageUp':
              y -= a * l;
              break;
            case 'PageDown':
              y += a * l;
              break;
            default:
              return;
          }
        (e.preventDefault(), e.stopPropagation());
        let E = $e$1(e),
          A = this.createDragStartContext(e, r, o);
        (this.ngZone.run(() => {
          (this.dragStart.emit(this.createDragInteractionEvent(t)), this.draggedGutterIndex.set(t));
        }),
          this.dragMoveToPoint({ x: E.x + _, y: E.y + y }, A),
          this.ngZone.run(() => {
            (this.dragEnd.emit(this.createDragInteractionEvent(t)),
              this.draggedGutterIndex.set(void 0));
          }));
      }
      getGutterGridStyle(e) {
        let t = e * 2,
          r = `${t} / ${t}`;
        return {
          'grid-column': this.direction() === 'horizontal' ? r : '1',
          'grid-row': this.direction() === 'vertical' ? r : '1',
        };
      }
      getAriaAreaSizeText(e) {
        let t = e._internalSize();
        if (t !== '*') return `${t.toFixed(0)} ${this.unit()}`;
      }
      getAriaValue(e) {
        return e === '*' ? void 0 : e;
      }
      createDragInteractionEvent(e) {
        return { gutterNum: e + 1, sizes: this.createAreaSizes() };
      }
      createAreaSizes() {
        return this._visibleAreas().map((e) => e._internalSize());
      }
      createDragStartContext(e, t, r) {
        let o = this.elementRef.nativeElement.getBoundingClientRect(),
          l =
            (this.direction() === 'horizontal' ? o.width : o.height) -
            (this._visibleAreas().length - 1) * this.gutterSize(),
          _ = this._areas().map((A) => {
            if (this.unit() === 'pixel') return A._internalSize();
            {
              let $ = A._internalSize();
              return $ === '*' ? $ : ($ / 100) * l;
            }
          }),
          y = Math.max(0, l - Bt$1(_, (A) => (A === '*' ? 0 : A))),
          E = _.map((A) => (A === '*' ? y : A));
        return {
          startEvent: e,
          areaBeforeGutterIndex: t,
          areaAfterGutterIndex: r,
          areasPixelSizes: E,
          totalAreasPixelSize: l,
          areaIndexToBoundaries: Ci$1(this._areas(), (A, $) => {
            let X = (Fe) => (Fe / 100) * l,
              _e =
                this.unit() === 'pixel'
                  ? { min: A._normalizedMinSize(), max: A._normalizedMaxSize() }
                  : { min: X(A._normalizedMinSize()), max: X(A._normalizedMaxSize()) };
            return [$.toString(), _e];
          }),
        };
      }
      mouseDragMove(e, t) {
        (e.preventDefault(), e.stopPropagation());
        let r = $e$1(e);
        this.dragMoveToPoint(r, t);
      }
      dragMoveToPoint(e, t) {
        let r = $e$1(t.startEvent),
          o = this.direction() === 'horizontal' ? e.x - r.x : e.y - r.y,
          a = this.direction() === 'horizontal' && this.dir() === 'rtl' ? -o : o,
          l = a > 0,
          _ = Math.abs(Math.round(a / this.gutterStep()) * this.gutterStep()),
          y = [...t.areasPixelSizes],
          E = y.map((k, Z) => Z),
          A = this.restrictMove()
            ? [t.areaBeforeGutterIndex]
            : E.slice(0, t.areaBeforeGutterIndex + 1)
                .filter((k) => this._areas()[k].visible())
                .reverse(),
          $ = this.restrictMove()
            ? [t.areaAfterGutterIndex]
            : E.slice(t.areaAfterGutterIndex).filter((k) => this._areas()[k].visible()),
          X = l ? $ : A,
          _e = l ? A : $,
          Fe = _,
          St = 0,
          wt = 0;
        for (; Fe !== 0 && St < X.length && wt < _e.length; ) {
          let k = X[St],
            Z = _e[wt],
            At = y[k],
            Kn = y[Z],
            Wt = t.areaIndexToBoundaries[k].min,
            Yt = t.areaIndexToBoundaries[Z].max,
            Xn = At - Wt,
            Qn = Yt - Kn,
            Et = Math.min(Xn, Qn, Fe);
          ((y[k] -= Et), (y[Z] += Et), (Fe -= Et), y[k] === Wt && St++, y[Z] === Yt && wt++);
        }
        (this._areas().forEach((k, Z) => {
          if (k._internalSize() !== '*')
            if (this.unit() === 'pixel') k._internalSize.set(y[Z]);
            else {
              let At = (y[Z] / t.totalAreasPixelSize) * 100;
              k._internalSize.set(parseFloat(At.toFixed(10)));
            }
        }),
          this.dragProgressSubject.next(
            this.createDragInteractionEvent(this.draggedGutterIndex()),
          ));
      }
      createGridTemplateColumnsStyle() {
        let e = [],
          t = Bt$1(this._visibleAreas(), (a) => {
            let l = a._internalSize();
            return l === '*' ? 0 : l;
          }),
          r = this._visibleAreas().length,
          o = 0;
        return (
          this._areas().forEach((a, l, _) => {
            let y = this.unit(),
              E = a._internalSize();
            if (!a.visible()) e.push(y === 'percent' || E === '*' ? '0fr' : '0px');
            else {
              if (y === 'pixel') {
                let X = E === '*' ? '1fr' : `${E}px`;
                e.push(X);
              } else {
                let _e = `${E === '*' ? 100 - t : E}fr`;
                e.push(_e);
              }
              o++;
            }
            if (l === _.length - 1) return;
            let $ = r - o;
            a.visible() && $ > 0 ? e.push(`${this.gutterSize()}px`) : e.push('0px');
          }),
          this.direction() === 'horizontal' ? `1fr / ${e.join(' ')}` : `${e.join(' ')} / 1fr`
        );
      }
      createAlignedVisibleAreasSize() {
        let e = this._visibleAreas().map((o) => {
          let a = o.size();
          return a === 'auto' ? '*' : a;
        });
        if (Bn$1(this._visibleAreas(), this.unit())) return e;
        let r = this.unit();
        if (r === 'percent') {
          let o = 100 / e.length;
          return e.map(() => o);
        }
        if (r === 'pixel') {
          if (e.filter((a) => a === '*').length === 0) return ['*', ...e.slice(1)];
          {
            let a = e.findIndex((_) => _ === '*'),
              l = 100;
            return e.map((_, y) => (y === a || _ !== '*' ? _ : l));
          }
        }
        return yi$1(r, 'SplitUnit');
      }
      static {
        this.ɵfac = function (t) {
          return new (t || n)();
        };
      }
      static {
        this.ɵcmp = nv({
          type: n,
          selectors: [['as-split']],
          contentQueries: function (t, r, o) {
            (t & 1 && Mf(o, r._areas, $t$1, 4)(o, r.customGutter, Rn$1, 5), t & 2 && Rv(2));
          },
          hostVars: 3,
          hostBindings: function (t, r) {
            t & 2 && (Df('dir', r.hostDirBinding), qv(r.hostClassesBinding));
          },
          inputs: {
            gutterSize: [1, 'gutterSize'],
            gutterStep: [1, 'gutterStep'],
            disabled: [1, 'disabled'],
            gutterClickDeltaPx: [1, 'gutterClickDeltaPx'],
            direction: [1, 'direction'],
            dir: [1, 'dir'],
            unit: [1, 'unit'],
            gutterAriaLabel: [1, 'gutterAriaLabel'],
            restrictMove: [1, 'restrictMove'],
            useTransition: [1, 'useTransition'],
            gutterDblClickDuration: [1, 'gutterDblClickDuration'],
          },
          outputs: {
            gutterClick: 'gutterClick',
            gutterDblClick: 'gutterDblClick',
            dragStart: 'dragStart',
            dragEnd: 'dragEnd',
            transitionEnd: 'transitionEnd',
          },
          exportAs: ['asSplit'],
          ngContentSelectors: $n$1,
          decls: 3,
          vars: 0,
          consts: [
            ['gutter', ''],
            [
              'role',
              'separator',
              'tabindex',
              '0',
              'asSplitCustomEventsBehavior',
              '',
              1,
              'as-split-gutter',
              3,
              'ngStyle',
              'as-dragged',
              'asSplitCustomMultiClickThreshold',
              'asSplitCustomClickDeltaInPx',
            ],
            [
              'role',
              'separator',
              'tabindex',
              '0',
              'asSplitCustomEventsBehavior',
              '',
              1,
              'as-split-gutter',
              3,
              'asSplitCustomClick',
              'asSplitCustomDblClick',
              'asSplitCustomMouseDown',
              'asSplitCustomKeyDown',
              'ngStyle',
              'asSplitCustomMultiClickThreshold',
              'asSplitCustomClickDeltaInPx',
            ],
            [1, 'as-split-gutter-icon'],
            [4, 'asSplitGutterDynamicInjector'],
            [4, 'ngTemplateOutlet', 'ngTemplateOutletContext', 'ngTemplateOutletInjector'],
          ],
          template: function (t, r) {
            (t & 1 && (Sv(), xv(0), Ev(1, fi$1, 1, 1, null, null, vv)),
              t & 2 && (Am(), Iv(r._areas())));
          },
          dependencies: [Rt$1, vi$1, bi$1, me],
          styles: [
            '@property --as-gutter-background-color{syntax: "<color>"; inherits: true; initial-value: #eeeeee;}@property --as-gutter-icon-horizontal{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-gutter-icon-vertical{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);}@property --as-gutter-icon-disabled{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-transition-duration{syntax: "<time>"; inherits: true; initial-value: .3s;}@property --as-gutter-disabled-cursor{syntax: "*"; inherits: true; initial-value: default;}[_nghost-%COMP%]{--_as-gutter-background-color: var(--as-gutter-background-color, #eeeeee);--_as-gutter-icon-horizontal: var( --as-gutter-icon-horizontal, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-gutter-icon-vertical: var( --as-gutter-icon-vertical, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC) );--_as-gutter-icon-disabled: var( --as-gutter-icon-disabled, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==) );--_as-transition-duration: var(--as-transition-duration, .3s);--_as-gutter-disabled-cursor: var(--as-gutter-disabled-cursor, default)}[_nghost-%COMP%]{display:grid;overflow:hidden;height:100%;width:100%}.as-transition[_nghost-%COMP%]{transition:grid-template var(--_as-transition-duration)}.as-split-gutter[_ngcontent-%COMP%]{background-color:var(--_as-gutter-background-color);display:flex;align-items:center;justify-content:center;touch-action:none}.as-horizontal[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:col-resize;height:100%}.as-vertical[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:row-resize;width:100%}.as-disabled[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%]{cursor:var(--_as-gutter-disabled-cursor)}.as-split-gutter-icon[_ngcontent-%COMP%]{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}.as-horizontal[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-horizontal)}.as-vertical[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-vertical)}.as-disabled[_nghost-%COMP%] > .as-split-gutter[_ngcontent-%COMP%] > .as-split-gutter-icon[_ngcontent-%COMP%]{background-image:var(--_as-gutter-icon-disabled)}',
          ],
        });
      }
    }
    return n;
  })(),
  jn$1 = (n) => (n == null || n === '*' ? '*' : +n),
  Si$1 = (n) => jn$1(n),
  zn$1 = (n) => jn$1(n),
  Un$1 = (() => {
    class n {
      constructor() {
        ((this.split = E(Ht$1)),
          (this.size = YO('auto', { transform: Si$1 })),
          (this.minSize = YO('*', { transform: zn$1 })),
          (this.maxSize = YO('*', { transform: zn$1 })),
          (this.lockSize = YO(false, { transform: iL })),
          (this.visible = YO(true, { transform: iL })),
          (this._internalSize = _E(() => {
            if (!this.visible()) return 0;
            let e = this.split._visibleAreas().findIndex((t) => t === this);
            return this.split._alignedVisibleAreasSizes()[e];
          })),
          (this._normalizedMinSize = CE(() => this.normalizeMinSize())),
          (this._normalizedMaxSize = CE(() => this.normalizeMaxSize())),
          (this.index = CE(() => this.split._areas().findIndex((e) => e === this))),
          (this.gridAreaNum = CE(() => this.index() * 2 + 1)),
          (this.hostClasses = CE(() =>
            Vn$1({
              'as-split-area': true,
              'as-min': this.visible() && this._internalSize() === this._normalizedMinSize(),
              'as-max': this.visible() && this._internalSize() === this._normalizedMaxSize(),
              'as-hidden': !this.visible(),
            }),
          )));
      }
      get hostClassesBinding() {
        return this.hostClasses();
      }
      get hostGridColumnStyleBinding() {
        return this.split.direction() === 'horizontal'
          ? `${this.gridAreaNum()} / ${this.gridAreaNum()}`
          : void 0;
      }
      get hostGridRowStyleBinding() {
        return this.split.direction() === 'vertical'
          ? `${this.gridAreaNum()} / ${this.gridAreaNum()}`
          : void 0;
      }
      get hostPositionStyleBinding() {
        return this.split._isDragging() ? 'relative' : void 0;
      }
      normalizeMinSize() {
        if (!this.visible()) return 0;
        let t = this.normalizeSizeBoundary(this.minSize, 0),
          r = this.size();
        return r !== '*' && r !== 'auto' && r < t ? 0 : t;
      }
      normalizeMaxSize() {
        if (!this.visible()) return 1 / 0;
        let t = this.normalizeSizeBoundary(this.maxSize, 1 / 0),
          r = this.size();
        return r !== '*' && r !== 'auto' && r > t ? 1 / 0 : t;
      }
      normalizeSizeBoundary(e, t) {
        let r = this.size(),
          o = this.lockSize(),
          a = e();
        return o
          ? r === '*' || r === 'auto'
            ? t
            : r
          : a === '*'
            ? t
            : r === '*' || r === 'auto'
              ? t
              : a;
      }
      static {
        this.ɵfac = function (t) {
          return new (t || n)();
        };
      }
      static {
        this.ɵcmp = nv({
          type: n,
          selectors: [['as-split-area']],
          hostVars: 8,
          hostBindings: function (t, r) {
            t & 2 &&
              (qv(r.hostClassesBinding),
              xf('grid-column', r.hostGridColumnStyleBinding)(
                'grid-row',
                r.hostGridRowStyleBinding,
              )('position', r.hostPositionStyleBinding));
          },
          inputs: {
            size: [1, 'size'],
            minSize: [1, 'minSize'],
            maxSize: [1, 'maxSize'],
            lockSize: [1, 'lockSize'],
            visible: [1, 'visible'],
          },
          exportAs: ['asSplitArea'],
          features: [dE([{ provide: $t$1, useExisting: n }])],
          ngContentSelectors: $n$1,
          decls: 2,
          vars: 1,
          consts: [[1, 'as-iframe-fix']],
          template: function (t, r) {
            (t & 1 && (Sv(), xv(0), mv(1, hi$1, 1, 0, 'div', 0)),
              t & 2 && (Am(), yv(r.split._isDragging() ? 1 : -1)));
          },
          styles: [
            '[_nghost-%COMP%]{overflow-x:hidden;overflow-y:auto}.as-horizontal > [_nghost-%COMP%]{height:100%}.as-vertical > [_nghost-%COMP%]{width:100%}.as-iframe-fix[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%}',
          ],
        });
      }
    }
    return n;
  })(),
  st$1 = (() => {
    class n {
      static {
        this.ɵfac = function (t) {
          return new (t || n)();
        };
      }
      static {
        this.ɵmod = ov({ type: n });
      }
      static {
        this.ɵinj = il({});
      }
    }
    return n;
  })();
var Ai$1 = ['container'],
  ut$1 = class n {
    tab = YO.required();
    ndlLayoutComponent = E(dt$1);
    dockLayoutService = E(U$1);
    tabContext = YO.required();
    viewContainerRef = JO('container', { read: Xo$1 });
    #e;
    constructor() {
      Zl(() => {
        let i = this.tab(),
          e = this.viewContainerRef();
        bE(() =>
          oi$1(this, null, function* () {
            let t = this.tabContext(),
              r = this.dockLayoutService.getTabComponent(i.id);
            if (!e) return;
            if (r) {
              (this.dockLayoutService.getTabContext(i.id)?.set(t),
                this.dockLayoutService.attachTabComponent(i.id, e));
              return;
            }
            if (this.#e) return;
            let o = yield i.component?.load();
            if (o) {
              let a = lo(t);
              ((this.#e = e.createComponent(o, {
                injector: fe$1.create({
                  providers: [
                    { provide: Ot$1, useValue: this.ndlLayoutComponent.layoutManager },
                    { provide: Lt$1, useValue: a.asReadonly() },
                  ],
                }),
              })),
                this.dockLayoutService.addTabComponent(i.id, this.#e, a, e),
                Object.entries(i.component?.inputs || {}).forEach(([l, _]) => {
                  this.#e?.setInput(l, _);
                }));
            }
          }),
        );
      });
    }
    static ɵfac = function (e) {
      return new (e || n)();
    };
    static ɵcmp = nv({
      type: n,
      selectors: [['ndl-content']],
      viewQuery: function (e, t) {
        (e & 1 && _f(t.viewContainerRef, Ai$1, 5, Xo$1), e & 2 && Rv());
      },
      hostAttrs: [1, 'ndl-content'],
      inputs: { tab: [1, 'tab'], tabContext: [1, 'tabContext'] },
      decls: 2,
      vars: 0,
      consts: [['container', '']],
      template: function (e, t) {
        e & 1 && Ef(0, null, 0);
      },
      styles: [
        '[_nghost-%COMP%]{height:100%;width:100%;display:block;position:absolute;color:var(--ndl-color-text)}',
      ],
    });
  };
var Ei$1 = () => ({
    xs: 'ndl-icon--xs',
    sm: 'ndl-icon--sm',
    md: 'ndl-icon--md',
    lg: 'ndl-icon--lg',
    custom: 'ndl-icon--custom',
  }),
  Ti$1 = {
    close:
      'M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z',
    add: 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z',
    edit: 'M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z',
    splitscreen_add:
      'M200-200v-160 4-4 160Zm0 80q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360H200v160h400v80H200Zm0-400q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0-80h560v-160H200v160Zm0 0v-160 160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z',
    splitscreen_vertical_add:
      'M760-760H599h5-4 160Zm-240 0q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v400h-80v-400H600v640q-33 0-56.5-23.5T520-200v-560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm160-640H200v560h160v-560Zm0 0H200h160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z',
    arrow_drop_down: 'M480-360 280-560h400L480-360Z',
  },
  ie = class n {
    icon = YO.required();
    size = YO('sm');
    path = CE(() => Ti$1[this.icon()]);
    static ɵfac = function (e) {
      return new (e || n)();
    };
    static ɵcmp = nv({
      type: n,
      selectors: [['ndl-icon']],
      inputs: { icon: [1, 'icon'], size: [1, 'size'] },
      decls: 2,
      vars: 4,
      consts: [['xmlns', 'http://www.w3.org/2000/svg', 'viewBox', '0 -960 960 960']],
      template: function (e, t) {
        (e & 1 && (Bl(), Ua$1(0, 'svg', 0), gf(1, 'path'), qa$1()),
          e & 2 && (qv(fE(3, Ei$1)[t.size()]), Am(), ff('d', t.path())));
      },
      styles: [
        '[_nghost-%COMP%]{display:flex;align-items:center;justify-content:center}svg[_ngcontent-%COMP%]{fill:currentColor}.ndl-icon--xs[_ngcontent-%COMP%]{width:var(--ndl-icon-xs);height:var(--ndl-icon-xs)}.ndl-icon--sm[_ngcontent-%COMP%]{width:var(--ndl-icon-sm);height:var(--ndl-icon-sm)}.ndl-icon--md[_ngcontent-%COMP%]{width:var(--ndl-icon-md);height:var(--ndl-icon-md)}.ndl-icon--lg[_ngcontent-%COMP%]{width:var(--ndl-icon-lg);height:var(--ndl-icon-lg)}',
      ],
    });
  };
var xi$1 = ['*'];
function Fi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 4),
      Tf('click', function () {
        Nl(e);
        let r = _v(),
          o = sE(0);
        return Sl(r.editTab.emit(o));
      }),
      hf(1, 'ndl-icon', 5),
      $a$1());
  }
  if (n & 2) {
    let e = _v();
    pf('title', e.labels.editTabTooltip);
  }
}
function Mi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 6),
      Tf('click', function () {
        Nl(e);
        let r = _v(),
          o = sE(0);
        return Sl(r.closeTab.emit(o));
      }),
      hf(1, 'ndl-icon', 7),
      $a$1());
  }
  if (n & 2) {
    let e = _v();
    pf('title', e.labels.closeTabTooltip);
  }
}
var lt$1 = class n {
  tab = YO.required();
  labels = E(he);
  activeTab = ZO();
  closeTab = ZO();
  editTab = ZO();
  dragStart = ZO();
  dragEnd = ZO();
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ndl-tab']],
    hostAttrs: [1, 'ndl-tab'],
    hostVars: 2,
    hostBindings: function (e, t) {
      e & 2 && Af('ndl-tab--active', t.tab().isActive);
    },
    inputs: { tab: [1, 'tab'] },
    outputs: {
      activeTab: 'activeTab',
      closeTab: 'closeTab',
      editTab: 'editTab',
      dragStart: 'dragStart',
      dragEnd: 'dragEnd',
    },
    ngContentSelectors: xi$1,
    decls: 7,
    vars: 5,
    consts: [
      [1, 'ndl-tab__title', 3, 'click', 'title'],
      [1, 'ndl-tab__actions'],
      [1, 'ndl-tab__edit', 3, 'title'],
      [1, 'ndl-tab__close', 3, 'title'],
      [1, 'ndl-tab__edit', 3, 'click', 'title'],
      ['icon', 'edit', 'size', 'xs'],
      [1, 'ndl-tab__close', 3, 'click', 'title'],
      ['icon', 'close', 'size', 'xs'],
    ],
    template: function (e, t) {
      if (e & 1) {
        let r = bv();
        (Sv(),
          $f(0),
          Fo$1(1, 'button', 0),
          Tf('click', function () {
            Nl(r);
            let a = sE(0);
            return Sl(t.activeTab.emit(a));
          }),
          tE(2),
          $a$1(),
          Fo$1(3, 'div', 1),
          mv(4, Fi$1, 2, 1, 'button', 2),
          mv(5, Mi$1, 2, 1, 'button', 3),
          $a$1(),
          xv(6));
      }
      if (e & 2) {
        let r = iE(t.tab());
        (Am(),
          pf('title', r.title),
          Am(),
          za$1(' ', r.title, ' '),
          Am(2),
          yv(r.isEditable ? 4 : -1),
          Am(),
          yv(r.isClosable ? 5 : -1));
      }
    },
    dependencies: [ie],
    styles: [
      '[_nghost-%COMP%]{--ndl-tab-bg: var(--ndl-color-base);--ndl-tab-bg-active: var(--ndl-color-surface);--ndl-tab-color: var(--ndl-color-text);--ndl-tab-radius: var(--ndl-radius-sm);--ndl-tab-min-width: 100px;--ndl-tab-max-width: 150px;color:var(--ndl-tab-color);display:flex;align-items:center;min-width:var(--ndl-tab-min-width);max-width:var(--ndl-tab-max-width);height:100%}[_nghost-%COMP%]{background-color:var(--ndl-tab-bg)}.ndl-dragging[_nghost-%COMP%]{opacity:.4;background-color:color-mix(in srgb,var(--ndl-tab-bg) 60%,black)}.ndl-tab--active[_nghost-%COMP%]{background-color:var(--ndl-tab-bg-active)}[_nghost-%COMP%]:not(.ndl-tab--active):hover{background-color:color-mix(in srgb,var(--ndl-tab-bg-active) 40%,transparent)}.ndl-tab__title[_ngcontent-%COMP%]{height:100%;width:100%;cursor:pointer;background-color:transparent;padding:0 5px;color:inherit;border:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ndl-tab__actions[_ngcontent-%COMP%]{display:flex;align-items:center}.ndl-tab__edit[_ngcontent-%COMP%], .ndl-tab__close[_ngcontent-%COMP%]{background-color:transparent;color:inherit;cursor:pointer;border:none;padding:var(--ndl-spacing-sm)}[_nghost-%COMP%]:not(.ndl-tab--active)   .ndl-tab__edit[_ngcontent-%COMP%], [_nghost-%COMP%]:not(.ndl-tab--active)   .ndl-tab__close[_ngcontent-%COMP%]{opacity:.7}[_nghost-%COMP%]   .ndl-tab__edit[_ngcontent-%COMP%]:hover, [_nghost-%COMP%]   .ndl-tab__close[_ngcontent-%COMP%]:hover, .ndl-tab--active[_nghost-%COMP%]   .ndl-tab__edit[_ngcontent-%COMP%], .ndl-tab--active[_nghost-%COMP%]   .ndl-tab__close[_ngcontent-%COMP%]{opacity:1}',
    ],
  });
};
function Te$1(n, i) {
  if (n(i)) return i;
  if (i.type === 'row' || i.type === 'column')
    for (let e of i.children) {
      let t = Te$1(n, e);
      if (t) return t;
    }
  if (i.type === 'pane') return i.header ? Te$1(n, i.header) : void 0;
  if (i.type === 'header')
    for (let e of i.tabs) {
      let t = Te$1(n, e);
      if (t) return t;
    }
}
function xe(n, i) {
  return n(i)
    ? i.type === 'row' || i.type === 'column'
      ? i.children.every((e) => xe(n, e))
      : i.type === 'pane'
        ? i.header
          ? xe(n, i.header)
          : true
        : i.type === 'header'
          ? i.tabs.every((e) => xe(n, e))
          : true
    : false;
}
function Gn$1(n, i) {
  let e = Te$1((t) => t.id === n, i);
  if (!e) throw new Error(`Item with id ${n} not found`);
  return e;
}
function Pi$1(n, i, e) {
  return e === -1 ? [...n, i] : [...n.slice(0, e), i, ...n.slice(e)];
}
function N(n, i) {
  let e = H({}, i.item?.(n) ?? n);
  if (e.type === 'row' || e.type === 'column') {
    let t = H({}, i.rowOrColumn?.(e) ?? e);
    return B$1(H({}, t), { children: t.children.map((r) => N(r, i)) });
  }
  if (e.type === 'pane') {
    let t = H({}, i.pane?.(e) ?? e);
    return B$1(H({}, t), { header: t.header ? N(t.header, i) : void 0 });
  }
  if (e.type === 'header') {
    let t = H({}, i.header?.(e) ?? e);
    return B$1(H({}, t), { tabs: t.tabs.map((r) => N(r, i)) });
  }
  return H({}, i.tab?.(e) ?? e);
}
function ct$1(n, i) {
  let e = n.filter((t) => t.isActive);
  return n.map((t, r) => {
    let o = n.slice(r + 1).some(({ isActive: l }) => l);
    if (i) return B$1(H({}, t), { isActive: t.id === i });
    let a = e.length > 0 ? t.isActive && !o : r === 0;
    return B$1(H({}, t), { isActive: a, mustBeLoaded: a });
  });
}
function Zn$1(n, i, e) {
  return N(n, {
    rowOrColumn: (t) =>
      t.id !== i
        ? t
        : B$1(H({}, t), { children: t.children.map((r, o) => B$1(H({}, r), { size: e[o] })) }),
  });
}
function Wn$1(n, i, e) {
  return N(n, {
    header: (t) =>
      t.id !== i
        ? t
        : B$1(H({}, t), {
            tabs: t.tabs.map((r) =>
              B$1(H({}, r), { isActive: r.id === e, mustBeLoaded: r.mustBeLoaded || r.id === e }),
            ),
          }),
  });
}
function gt(n, i, e, t = -1) {
  return N(n, {
    header: (r) => {
      if (r.id !== i) return r;
      let o = r.tabs.filter(({ id: a }) => a !== e.id);
      return B$1(H({}, r), { tabs: ct$1(Pi$1(o, e, t), e.isActive ? e.id : void 0) });
    },
  });
}
function Vt$1(n, i, e) {
  return N(n, { pane: (t) => (t.id === i ? B$1(H({}, t), { header: e }) : t) });
}
function jt$1(n, i, e, t) {
  return N(n, {
    header: (r) =>
      r.id !== i
        ? r
        : B$1(H({}, r), { tabs: r.tabs.map((o) => (o.id === e ? H(H({}, o), t) : o)) }),
  });
}
function Ut$1(n, i, e) {
  return N(n, {
    header: (t) =>
      t.id !== i ? t : B$1(H({}, t), { tabs: ct$1(t.tabs.filter((r) => r.id !== e)) }),
  });
}
function Gt$1(n, i) {
  let e = (t) =>
    N(t, { rowOrColumn: (r) => B$1(H({}, r), { children: r.children.filter((o) => o.id !== i) }) });
  return N(n, {
    rowOrColumn: (t) => {
      let r = e(t);
      return B$1(H({}, r), {
        children: r.children.filter((o) => !xe((a) => a.type === 'row' || a.type === 'column', o)),
      });
    },
  });
}
function Zt(n, i, e, t, r, o) {
  return N(n, {
    rowOrColumn: (a) =>
      a.id !== i
        ? a
        : B$1(H({}, a), {
            children: a.children.map((l) => {
              if (l.type !== 'pane' || l.id !== e) return l;
              let _ = { id: crypto.randomUUID(), type: t, size: l.size },
                y = r === 0 ? [o, B$1(H({}, l), { size: 50 })] : [B$1(H({}, l), { size: 50 }), o];
              return B$1(H({}, _), { children: y });
            }),
          }),
  });
}
function He$1(n, i, e) {
  let t = Object.entries(i).find(([o]) => o === n.component?.id)?.[1],
    r = B$1(H({}, n), {
      id: n.id ?? crypto.randomUUID(),
      isClosable: n.isClosable ?? e?.panes?.headers?.tabs?.isClosable ?? true,
      isDraggable: n.isDraggable ?? e?.panes?.headers?.tabs?.isDraggable ?? true,
      isEditable: n.isEditable ?? e?.panes?.headers?.tabs?.isEditable ?? false,
    });
  return B$1(H({}, r), {
    component: n.component && H({ load: () => t() }, n.component),
    mustBeLoaded: n.isActive ?? false,
  });
}
function pt$1(n, i, e) {
  let t = ct$1(n.tabs);
  return B$1(H({}, n), {
    id: n.id ?? crypto.randomUUID(),
    isVisible: n.isVisible ?? e?.panes?.headers?.isVisible ?? true,
    canAddTab: n.canAddTab ?? e?.panes?.headers?.canAddTab ?? false,
    tabs: t.map((r) => He$1(r, i, e)),
  });
}
function ft(n, i, e) {
  return B$1(H({}, n), {
    id: n.id ?? crypto.randomUUID(),
    header: n.header ? pt$1(n.header, i, e) : void 0,
    isSplittable: n.isSplittable ?? e?.panes?.isSplittable ?? true,
    canAddTab: n.canAddTab ?? e?.panes?.canAddTab ?? false,
    isClosable: n.isClosable ?? e?.panes?.isClosable ?? true,
  });
}
function ht$1(n, i, e) {
  let t = B$1(H({}, n), { id: n.id ?? crypto.randomUUID() });
  return B$1(H({}, t), {
    children: t.children.map((r) => (r.type === 'pane' ? ft(r, i, e) : ht$1(r, i, e))),
  });
}
var Ii$1 = ['*'],
  De = class n {
    element = E(Jn$2);
    class = 'ndl-drag-preview-container--dragging';
    toggleVisibility(i) {
      this.element.nativeElement.classList.toggle(this.class, i);
    }
    static ɵfac = function (e) {
      return new (e || n)();
    };
    static ɵcmp = nv({
      type: n,
      selectors: [['ndl-drag-preview-container']],
      hostAttrs: [1, 'ndl-drag-preview-container'],
      ngContentSelectors: Ii$1,
      decls: 1,
      vars: 0,
      template: function (e, t) {
        e & 1 && (Sv(), xv(0));
      },
      styles: [
        '[_nghost-%COMP%]{display:none;position:absolute;top:-1000px;left:-1000px;z-index:999}.ndl-drag-preview-container--dragging[_nghost-%COMP%]{display:block}',
      ],
    });
  };
var mt = class n {
  element = E(Jn$2);
  #e = E(G, { optional: true });
  overlay = XO(De, { descendants: true });
  dragEnd = ZO();
  isDraggable = YO(true);
  constructor() {
    if (!this.#e)
      throw new Error(
        '[ndlDraggableElement] NdlDragService is not provided. Add NdlDragService to the providers of the component that contains both <ngx-dock-layout> and [ndlDraggableElement] elements.',
      );
  }
  isDragging = _E(() => this.#e.currentDragData()?.tab.id === this.ndlDraggableElement().tab.id);
  ndlDraggableElement = YO.required();
  onDragStart(i) {
    let e = this.overlay(),
      r = window.navigator.userAgent.toLowerCase().includes('firefox');
    if ((this.overlay()?.toggleVisibility(true), e)) {
      let { x: a, y: l } = r ? { x: 50, y: 30 } : { x: 0, y: 0 };
      i.dataTransfer?.setDragImage(e.element.nativeElement, a, l);
    }
    let o = He$1(
      B$1(H({}, this.ndlDraggableElement().tab), { type: 'tab' }),
      this.ndlDraggableElement().manager.components,
      this.ndlDraggableElement().manager.settings(),
    );
    this.#e.currentDragData.set({ tab: o, pane: this.ndlDraggableElement().pane, type: 'tab' });
  }
  onDragEnd() {
    (this.isDragging.set(false),
      this.overlay()?.toggleVisibility(false),
      this.dragEnd.emit(this.ndlDraggableElement().tab),
      this.#e.currentDragData.set(void 0));
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵdir = av({
    type: n,
    selectors: [['', 'ndlDraggableElement', '']],
    contentQueries: function (e, t, r) {
      (e & 1 && Mf(r, t.overlay, De, 5), e & 2 && Rv());
    },
    hostVars: 3,
    hostBindings: function (e, t) {
      (e & 1 &&
        Tf('dragstart', function (o) {
          return t.onDragStart(o);
        })('dragend', function () {
          return t.onDragEnd();
        }),
        e & 2 && (ff('draggable', t.isDraggable()), Af('ndl-dragging', t.isDragging())));
    },
    inputs: { isDraggable: [1, 'isDraggable'], ndlDraggableElement: [1, 'ndlDraggableElement'] },
    outputs: { dragEnd: 'dragEnd' },
  });
};
var Dt$1 = class n {
  tab = YO.required();
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ndl-drag-preview']],
    hostAttrs: [1, 'ndl-drag-preview'],
    inputs: { tab: [1, 'tab'] },
    decls: 5,
    vars: 1,
    consts: [
      [1, 'ndl-drag-preview__titlebar'],
      [1, 'ndl-drag-preview__dot'],
      [1, 'ndl-drag-preview__title'],
      [1, 'ndl-drag-preview__body'],
    ],
    template: function (e, t) {
      (e & 1 &&
        (Ua$1(0, 'div', 0), gf(1, 'span', 1), Ua$1(2, 'span', 2), tE(3), qa$1()(), gf(4, 'div', 3)),
        e & 2 && (Am(3), jf(t.tab().title)));
    },
    styles: [
      '[_nghost-%COMP%]{--ndl-drag-preview-width: 200px;--ndl-drag-preview-height: 120px;--ndl-drag-preview-titlebar-height: 32px;--ndl-drag-preview-font-size: 12px;--ndl-drag-preview-opacity: .93;--ndl-drag-preview-z-index: 9999;display:flex;flex-direction:column;width:var(--ndl-drag-preview-width);height:var(--ndl-drag-preview-height);border:1px solid var(--ndl-color-border);border-radius:var(--ndl-radius-sm);overflow:hidden;box-shadow:0 20px 40px #0006,0 6px 12px #00000040;pointer-events:none;z-index:var(--ndl-drag-preview-z-index);opacity:var(--ndl-drag-preview-opacity)}.ndl-drag-preview__titlebar[_ngcontent-%COMP%]{display:flex;align-items:center;gap:var(--ndl-spacing-md);padding:0 var(--ndl-spacing-md);height:var(--ndl-drag-preview-titlebar-height);flex-shrink:0;background-color:var(--ndl-color-surface);color:var(--ndl-color-text)}.ndl-drag-preview__dot[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:50%;flex-shrink:0;background-color:color-mix(in srgb,currentColor 30%,transparent);border:1px solid color-mix(in srgb,currentColor 50%,transparent)}.ndl-drag-preview__title[_ngcontent-%COMP%]{font-size:var(--ndl-drag-preview-font-size);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ndl-drag-preview__body[_ngcontent-%COMP%]{flex:1;background:repeating-linear-gradient(0deg,transparent,transparent 3px,color-mix(in srgb,var(--ndl-color-border, #444) 20%,transparent) 3px,color-mix(in srgb,var(--ndl-color-border, #444) 20%,transparent) 4px);background-color:var(--ndl-color-surface, #1e1e1e)}',
    ],
  });
};
var Oi$1 = ['tabsContainer'],
  Li$1 = (n, i, e) => ({ tab: n, pane: i, manager: e }),
  ki$1 = (n, i, e) => ({ tab: n, header: i, pane: e }),
  Yn$1 = (n, i) => i.id;
function Ri$1(n, i) {
  if ((n & 1 && (Fo$1(0, 'button', 2), tE(1), $a$1()), n & 2)) {
    let e = _v(2);
    (Am(), za$1(' ', e.tabPlaceHolderPosition()?.tab?.title, ' '));
  }
}
function Ni$1(n, i) {
  n & 1 && yf(0);
}
function Bi$1(n, i) {
  if ((n & 1 && cf(0, Ni$1, 1, 0, 'ng-container', 8), n & 2)) {
    let e = _v().$implicit,
      t = _v();
    pf('ngTemplateOutlet', i)('ngTemplateOutletContext', gE(2, ki$1, e, t.header(), t.pane()));
  }
}
function zi$1(n, i) {
  if ((n & 1 && hf(0, 'ndl-drag-preview', 7), n & 2)) {
    let e = _v().$implicit;
    pf('tab', e);
  }
}
function $i$1(n, i) {
  if ((n & 1 && (Fo$1(0, 'button', 2), tE(1), $a$1()), n & 2)) {
    let e = _v(2);
    (Am(), za$1(' ', e.tabPlaceHolderPosition()?.tab?.title, ' '));
  }
}
function Hi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (mv(0, Ri$1, 2, 1, 'button', 2),
      Fo$1(1, 'ndl-tab', 6),
      Tf('activeTab', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onActiveTab(r));
      })('closeTab', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onCloseTab(r));
      })('editTab', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onEditTab(r));
      })('dragStart', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onDragStartTab(r));
      })('dragover', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onDragOverTab(r));
      })('dragEnd', function () {
        Nl(e);
        let r = _v();
        return Sl(r.onDragEndTab());
      }),
      Fo$1(2, 'ndl-drag-preview-container'),
      mv(3, Bi$1, 1, 6, 'ng-container')(4, zi$1, 1, 1, 'ndl-drag-preview', 7),
      $a$1()(),
      mv(5, $i$1, 2, 1, 'button', 2));
  }
  if (n & 2) {
    let e,
      t = i.$implicit,
      r = i.$index,
      o = _v();
    (yv(
      o.tabPlaceHolderPosition()?.target?.tabIndex === r &&
        o.tabPlaceHolderPosition()?.target?.tabPosition === 'before'
        ? 0
        : -1,
    ),
      Am(),
      pf('id', aE('tab-', t.id))('tab', t)('isDraggable', t.isDraggable)(
        'ndlDraggableElement',
        gE(9, Li$1, t, o.pane(), o.layoutManager()),
      ),
      ff('data-tab_id', t.id),
      Am(2),
      yv((e = o.dragPreviewTemplate?.()) ? 3 : 4, e),
      Am(2),
      yv(
        o.tabPlaceHolderPosition()?.target?.tabIndex === r &&
          o.tabPlaceHolderPosition()?.target?.tabPosition === 'after'
          ? 5
          : -1,
      ));
  }
}
function Vi$1(n, i) {
  if ((n & 1 && (Fo$1(0, 'button', 2), tE(1), $a$1()), n & 2)) {
    let e = _v();
    (Am(), za$1(' ', e.tabPlaceHolderPosition()?.tab?.title, ' '));
  }
}
function ji$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 13),
      Tf('click', function () {
        let r = Nl(e).$implicit,
          o = _v(3);
        return (o.onActiveTab(r), Sl(o.isDropdownOpen.set(false)));
      }),
      tE(1),
      $a$1());
  }
  if (n & 2) {
    let e = i.$implicit;
    (Af('ndl-header__dropdown-item--active', e.isActive), Am(), za$1(' ', e.title, ' '));
  }
}
function Ui$1(n, i) {
  if ((n & 1 && (Fo$1(0, 'div', 11), Ev(1, ji$1, 2, 3, 'button', 12, Yn$1), $a$1()), n & 2)) {
    let e = _v(2);
    (Am(), Iv(e.header().tabs));
  }
}
function Gi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'div', 4)(1, 'button', 9),
      Tf('click', function () {
        Nl(e);
        let r = _v();
        return Sl(r.toggleDropdown());
      }),
      hf(2, 'ndl-icon', 10),
      $a$1(),
      mv(3, Ui$1, 3, 0, 'div', 11),
      $a$1());
  }
  if (n & 2) {
    let e = _v();
    (Am(), pf('title', e.labels.allTabsTooltip), Am(2), yv(e.isDropdownOpen() ? 3 : -1));
  }
}
function Zi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'div', 5)(1, 'button', 14),
      Tf('click', function () {
        Nl(e);
        let r = _v();
        return Sl(r.onAddTab());
      }),
      hf(2, 'ndl-icon', 15),
      $a$1()());
  }
  if (n & 2) {
    let e = _v();
    (Am(), pf('title', e.labels.newTabTooltip));
  }
}
var _t = class n {
  layoutManager = E(ee);
  elementRef = E(Jn$2);
  dockLayoutService = E(U$1);
  dragService = E(G);
  #e = E(Be$2);
  labels = E(he);
  dragPreviewTemplate = E(tt$1, { optional: true });
  header = YO.required();
  pane = YO.required();
  addTab = ZO();
  editTab = ZO();
  isDragging = KO(false);
  hasOverflow = lo(false);
  isDropdownOpen = lo(false);
  tabsContainerRef = JO.required('tabsContainer');
  tabPlaceHolderPosition = CE(() => {
    let i = this.dragService.currentDragData();
    if (i && i.target?.headerId === this.header().id)
      return i.target.position === 'center' ? i : void 0;
  });
  constructor() {
    (am(() => {
      let i = this.tabsContainerRef().nativeElement,
        e = new ResizeObserver(() => this.#t());
      (e.observe(i), this.#e.onDestroy(() => e.disconnect()));
    }),
      Zl(() => {
        (this.header().tabs, queueMicrotask(() => this.#t()));
      }));
  }
  #t() {
    let i = this.tabsContainerRef()?.nativeElement;
    i && this.hasOverflow.set(i.scrollWidth > i.clientWidth);
  }
  toggleDropdown() {
    this.isDropdownOpen.update((i) => !i);
  }
  onDocumentClick(i) {
    this.elementRef.nativeElement.contains(i.target) || this.isDropdownOpen.set(false);
  }
  onActiveTab(i) {
    if (i.isActive) return;
    (this.layoutManager().activeTab(this.header().id, i.id),
      this.tabsContainerRef()
        .nativeElement.querySelector(`#tab-${i.id}`)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' }));
  }
  onCloseTab(i) {
    this.layoutManager().closeTab(this.header().id, i.id);
  }
  onAddTab() {
    this.addTab.emit(this.header());
  }
  onEditTab(i) {
    this.editTab.emit(i);
  }
  onDragStartTab(i) {
    this.dragService.currentDragData.set(B$1(H({}, i), { pane: this.pane() }));
  }
  onDragEndTab() {
    this.dragService.currentDragData.set(void 0);
  }
  onDragLeave(i) {
    i.preventDefault();
    let e = i.relatedTarget;
    e &&
      (this.elementRef.nativeElement.contains(e) ||
        (this.isDragging.set(false),
        this.dragService.currentDragData.update((t) => t && B$1(H({}, t), { target: void 0 }))));
  }
  onDragOverTab(i) {
    i.preventDefault();
    let e = i.target.closest('ndl-tab');
    if (!e) return;
    let t = e.dataset.tab_id,
      { width: r, left: o } = e.getBoundingClientRect(),
      a = i.clientX - o,
      l = this.header().tabs.findIndex((_) => _.id === t);
    this.dragService.currentDragData.update(
      (_) =>
        _ &&
        B$1(H({}, _), {
          target: {
            headerId: this.header().id,
            tabPosition: a < r / 2 ? 'before' : 'after',
            position: 'center',
            tabIndex: l,
          },
        }),
    );
  }
  onDragOver(i) {
    i.preventDefault();
  }
  onDrop(i) {
    (i.preventDefault(), i.stopPropagation());
    let e = this.tabPlaceHolderPosition();
    if (!e?.target) return;
    let { tab: t, pane: r } = e,
      o = e.target.tabIndex,
      a = e.target.tabPosition === 'before' ? o : o + 1;
    (this.dockLayoutService.detachTabComponent(t.id),
      this.layoutManager().moveTab(
        { tab: t, headerId: r?.header?.id, paneId: r?.id },
        { headerId: this.header().id, index: a },
      ),
      this.isDragging.set(false),
      this.dragService.currentDragData.set(void 0));
  }
  onDragOverEnd(i) {
    (i.preventDefault(),
      this.dragService.currentDragData.update(
        (e) =>
          e &&
          B$1(H({}, e), {
            target: {
              headerId: this.header().id,
              tabPosition: 'after',
              position: 'center',
              tabIndex: this.header().tabs.length,
            },
          }),
      ));
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ndl-header']],
    viewQuery: function (e, t) {
      (e & 1 && _f(t.tabsContainerRef, Oi$1, 5), e & 2 && Rv());
    },
    hostAttrs: [1, 'ndl-header'],
    hostBindings: function (e, t) {
      e & 1 &&
        Tf(
          'click',
          function (o) {
            return t.onDocumentClick(o);
          },
          qg,
        )('dragleave', function (o) {
          return t.onDragLeave(o);
        })('dragover', function (o) {
          return t.onDragOver(o);
        })('drop', function (o) {
          return t.onDrop(o);
        });
    },
    inputs: { header: [1, 'header'], pane: [1, 'pane'], isDragging: [1, 'isDragging'] },
    outputs: { addTab: 'addTab', editTab: 'editTab', isDragging: 'isDraggingChange' },
    decls: 8,
    vars: 3,
    consts: [
      ['tabsContainer', ''],
      [1, 'ndl-header__tabs'],
      [1, 'ndl-header__tab-placeholder'],
      [1, 'ndl-header__empty', 3, 'dragover'],
      [1, 'ndl-header__overflow'],
      [1, 'ndl-header__end'],
      [
        3,
        'activeTab',
        'closeTab',
        'editTab',
        'dragStart',
        'dragover',
        'dragEnd',
        'tab',
        'id',
        'isDraggable',
        'ndlDraggableElement',
      ],
      [3, 'tab'],
      [4, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
      [1, 'ndl-header__overflow-btn', 3, 'click', 'title'],
      ['icon', 'arrow_drop_down', 'size', 'xs'],
      [1, 'ndl-header__dropdown'],
      [1, 'ndl-header__dropdown-item', 3, 'ndl-header__dropdown-item--active'],
      [1, 'ndl-header__dropdown-item', 3, 'click'],
      [1, 'ndl-header__add', 3, 'click', 'title'],
      ['icon', 'add'],
    ],
    template: function (e, t) {
      (e & 1 &&
        (Fo$1(0, 'div', 1, 0),
        Ev(2, Hi$1, 6, 13, null, null, Yn$1),
        mv(4, Vi$1, 2, 1, 'button', 2),
        Fo$1(5, 'div', 3),
        Tf('dragover', function (o) {
          return t.onDragOverEnd(o);
        }),
        $a$1()(),
        mv(6, Gi$1, 4, 2, 'div', 4),
        mv(7, Zi$1, 3, 1, 'div', 5)),
        e & 2 &&
          (Am(2),
          Iv(t.header().tabs),
          Am(2),
          yv(
            t.tabPlaceHolderPosition()?.target?.tabIndex === t.header().tabs.length &&
              t.tabPlaceHolderPosition()?.target?.tabPosition === 'after'
              ? 4
              : -1,
          ),
          Am(2),
          yv(t.hasOverflow() ? 6 : -1),
          Am(),
          yv(t.header().canAddTab ? 7 : -1)));
    },
    dependencies: [lt$1, ie, mt, De, Dt$1, Be$1, me],
    styles: [
      '[_nghost-%COMP%]{--ndl-header-color: var(--ndl-color-text);--ndl-header-add-size: 25px;--ndl-header-tab-min-width: var(--ndl-tab-min-width, 100px);--ndl-header-tab-max-width: var(--ndl-tab-max-width, 150px);--ndl-header-preview-color: var(--ndl-color-text);display:flex;flex-direction:row;align-items:center;gap:var(--ndl-spacing-sm);background-color:var(--ndl-color-base);height:var(--ndl-tab-height)}.ndl-header__tabs[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;overflow-x:auto;scrollbar-width:none;height:100%;flex:1;min-width:0}.ndl-header__tabs[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}.ndl-header__add[_ngcontent-%COMP%]{height:var(--ndl-header-add-size);background-color:transparent;color:var(--ndl-header-color);width:var(--ndl-header-add-size);cursor:pointer;border-radius:50%;border:none;padding:0}.ndl-header__add[_ngcontent-%COMP%]:hover{background-color:color-mix(in srgb,var(--ndl-color-base) 40%,transparent)}@keyframes _ngcontent-%COMP%_ndl-preview-in{0%{opacity:0;transform:scaleX(.85)}to{opacity:1;transform:scaleX(1)}}.ndl-header__tab-placeholder[_ngcontent-%COMP%]{background-color:color-mix(in srgb,var(--ndl-header-preview-color) 8%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1.5px solid color-mix(in srgb,var(--ndl-header-preview-color) 35%,transparent);border-radius:var(--ndl-radius-sm);box-shadow:inset 0 0 12px color-mix(in srgb,var(--ndl-header-preview-color) 6%,transparent);animation:_ngcontent-%COMP%_ndl-preview-in .15s ease-out;transform-origin:left center;display:flex;align-items:center;min-width:var(--ndl-header-tab-min-width);max-width:var(--ndl-header-tab-max-width);padding:0px var(--ndl-spacing-sm) 0px var(--ndl-spacing-md);height:100%;color:var(--ndl-header-color);box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0}.ndl-header__empty[_ngcontent-%COMP%]{width:100%;height:100%;flex:1}.ndl-header__end[_ngcontent-%COMP%]{flex-shrink:0}.ndl-header__overflow[_ngcontent-%COMP%]{position:relative;flex-shrink:0;height:100%;display:flex;align-items:center}.ndl-header__overflow-btn[_ngcontent-%COMP%]{height:100%;padding:0 var(--ndl-spacing-sm);background-color:transparent;color:var(--ndl-header-color);border:none;cursor:pointer;display:flex;align-items:center}.ndl-header__overflow-btn[_ngcontent-%COMP%]:hover{background-color:color-mix(in srgb,var(--ndl-color-base) 60%,transparent)}.ndl-header__dropdown[_ngcontent-%COMP%]{position:absolute;top:100%;right:0;min-width:180px;max-height:240px;overflow-y:auto;background-color:var(--ndl-color-surface);border:1px solid var(--ndl-color-border);border-radius:var(--ndl-radius-sm);box-shadow:0 8px 20px #0003,0 2px 6px #0000001a;z-index:100}.ndl-header__dropdown-item[_ngcontent-%COMP%]{display:block;width:100%;padding:var(--ndl-spacing-sm) var(--ndl-spacing-md);background:transparent;color:var(--ndl-header-color);border:none;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:inherit}.ndl-header__dropdown-item[_ngcontent-%COMP%]:hover{background-color:color-mix(in srgb,var(--ndl-color-base) 80%,transparent)}.ndl-header__dropdown-item--active[_ngcontent-%COMP%]{background-color:var(--ndl-color-base)}',
    ],
  });
};
var Wi$1 = ['ndlPaneContent'],
  Yi$1 = (n, i, e) => ({ tabId: n, headerId: i, paneId: e }),
  qi$1 = (n, i, e) => ({ layoutManager: n, pane: i, parent: e }),
  Ki$1 = (n, i) => i.id;
function Xi$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'ndl-header', 11),
      Hf('isDraggingChange', function (r) {
        Nl(e);
        let o = _v();
        return (oE(o.isDraggingOnHeader, r) || (o.isDraggingOnHeader = r), Sl(r));
      }),
      Tf('addTab', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.addTab.emit(r));
      })('editTab', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.editTab.emit(r));
      }),
      $a$1());
  }
  if (n & 2) {
    let e = _v(),
      t = sE(0);
    (pf('header', t), Vf('isDragging', e.isDraggingOnHeader), pf('pane', e.pane()));
  }
}
function Qi$1(n, i) {
  if ((n & 1 && hf(0, 'ndl-content', 13), n & 2)) {
    let e = _v().$implicit,
      t = _v(),
      r = sE(0);
    (xf('visibility', e.isActive ? 'visible' : 'hidden'),
      pf('tabContext', gE(4, Yi$1, e.id, r.id, t.pane().id))('tab', e));
  }
}
function Ji$1(n, i) {
  if ((n & 1 && mv(0, Qi$1, 1, 8, 'ndl-content', 12), n & 2)) {
    let e = i.$implicit;
    yv(e.component && e.mustBeLoaded ? 0 : -1);
  }
}
function er$1(n, i) {
  n & 1 && yf(0);
}
function tr$1(n, i) {
  if ((n & 1 && cf(0, er$1, 1, 0, 'ng-container', 14), n & 2)) {
    let e = _v(2);
    pf('ngTemplateOutlet', i)(
      'ngTemplateOutletContext',
      gE(2, qi$1, e.layoutManager(), e.pane(), e.parent()),
    );
  }
}
function nr$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 20),
      Tf('click', function () {
        Nl(e);
        let r = _v(3);
        return Sl(r.onSplit('column'));
      }),
      hf(1, 'ndl-icon', 21),
      $a$1());
  }
  if (n & 2) {
    let e = _v(3);
    pf('title', e.labels.splitColumnTooltip);
  }
}
function ir$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 22),
      Tf('click', function () {
        Nl(e);
        let r = _v(3);
        return Sl(r.onAddTab());
      }),
      hf(1, 'ndl-icon', 23),
      $a$1());
  }
  if (n & 2) {
    let e = _v(3);
    pf('title', e.labels.newTabTooltip);
  }
}
function rr$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 24),
      Tf('click', function () {
        Nl(e);
        let r = _v(3);
        return Sl(r.onClosePane());
      }),
      hf(1, 'ndl-icon', 25),
      $a$1());
  }
  if (n & 2) {
    let e = _v(3);
    pf('title', e.labels.closePaneTooltip);
  }
}
function or$1(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'button', 26),
      Tf('click', function () {
        Nl(e);
        let r = _v(3);
        return Sl(r.onSplit('row'));
      }),
      hf(1, 'ndl-icon', 27),
      $a$1());
  }
  if (n & 2) {
    let e = _v(3);
    pf('title', e.labels.splitRowTooltip);
  }
}
function ar(n, i) {
  if (
    (n & 1 &&
      (mv(0, nr$1, 2, 1, 'button', 15),
      Fo$1(1, 'div', 16),
      mv(2, ir$1, 2, 1, 'button', 17),
      mv(3, rr$1, 2, 1, 'button', 18),
      $a$1(),
      mv(4, or$1, 2, 1, 'button', 19)),
    n & 2)
  ) {
    let e = _v(2);
    (yv(e.pane().isSplittable ? 0 : -1),
      Am(2),
      yv(e.pane().canAddTab ? 2 : -1),
      Am(),
      yv(e.pane().isClosable ? 3 : -1),
      Am(),
      yv(e.pane().isSplittable ? 4 : -1));
  }
}
function sr(n, i) {
  if (
    (n & 1 && (Fo$1(0, 'div', 10), mv(1, tr$1, 1, 6, 'ng-container')(2, ar, 5, 4), $a$1()), n & 2)
  ) {
    let e,
      t = _v();
    (Am(), yv((e = t.emptyPaneTemplate?.()) ? 1 : 2, e));
  }
}
var bt$1 = class n {
  layoutManager = E(ee);
  dockLayoutService = E(U$1);
  dragService = E(G);
  labels = E(he);
  pane = YO.required();
  parent = YO.required();
  emptyPaneTemplate = E(et$1, { optional: true });
  addTab = ZO();
  addHeader = ZO();
  editTab = ZO();
  previewState = _E({
    source: this.dragService.currentDragData,
    computation: (i, e) => (i ? e?.value : void 0),
  });
  ndlPaneContent = JO.required('ndlPaneContent');
  isDraggingOnHeader = lo(false);
  onAddTab() {
    this.addHeader.emit(this.pane());
  }
  onSplit(i) {
    this.layoutManager().split(this.parent().id, this.pane().id, i, 0);
  }
  onClosePane() {
    this.layoutManager().closePane(this.pane().id);
  }
  onDragLeave(i) {
    i.preventDefault();
    let e = i.relatedTarget;
    e && (this.ndlPaneContent().nativeElement.contains(e) || this.previewState.set(void 0));
  }
  onDragTop(i) {
    (i.preventDefault(),
      this.previewState.set({ width: 100, height: 50, left: 0 }),
      this.dragService.currentDragData.update((e) => {
        if (e) return B$1(H({}, e), { target: { position: 'top' } });
      }));
  }
  onDragBottom(i) {
    (i.preventDefault(),
      this.previewState.set({ width: 100, height: 50, bottom: 0 }),
      this.dragService.currentDragData.update((e) => {
        if (e) return B$1(H({}, e), { target: { position: 'bottom' } });
      }));
  }
  onDragLeft(i) {
    (i.preventDefault(),
      this.previewState.set({ width: 50, height: 100, left: 0 }),
      this.dragService.currentDragData.update((e) => {
        if (e) return B$1(H({}, e), { target: { position: 'left' } });
      }));
  }
  onDragRight(i) {
    (i.preventDefault(),
      this.previewState.set({ width: 50, height: 100, right: 0 }),
      this.dragService.currentDragData.update((e) => {
        if (e) return B$1(H({}, e), { target: { position: 'right' } });
      }));
  }
  onDragCenter(i) {
    (i.preventDefault(),
      this.previewState.set({ width: 100, height: 100 }),
      this.dragService.currentDragData.update((e) => {
        if (e)
          return B$1(H({}, e), {
            target: {
              headerId: this.pane().header?.id,
              position: 'center',
              tabPosition: 'after',
              tabIndex: this.pane().header?.tabs.length ?? 0,
            },
          });
      }));
  }
  onDragEnter(i) {
    i.preventDefault();
  }
  onDrop(i, e) {
    i.preventDefault();
    let t = this.dragService.currentDragData();
    if (!t) return;
    if (t.pane?.id === this.pane().id) {
      let o = (t.pane?.header?.tabs.filter((a) => a.id !== t.tab.id).length ?? 0) > 0;
      if (e === 'center' || !o) {
        this.dragService.currentDragData.set(void 0);
        return;
      }
    }
    (this.dockLayoutService.detachTabComponent(t.tab.id),
      this.layoutManager().dropTabToPane(
        { tab: t.tab, headerId: t.pane?.header?.id, paneId: t.pane?.id },
        { paneId: this.pane().id, parentId: this.parent().id, zone: e },
      ),
      this.dragService.currentDragData.set(void 0));
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ndl-pane']],
    viewQuery: function (e, t) {
      (e & 1 && _f(t.ndlPaneContent, Wi$1, 5), e & 2 && Rv());
    },
    hostAttrs: [1, 'ndl-pane'],
    inputs: { pane: [1, 'pane'], parent: [1, 'parent'] },
    outputs: { addTab: 'addTab', addHeader: 'addHeader', editTab: 'editTab' },
    decls: 14,
    vars: 21,
    consts: [
      ['ndlPaneContent', ''],
      [3, 'header', 'isDragging', 'pane'],
      [1, 'ndl-pane__content', 3, 'dragenter', 'dragleave'],
      [1, 'ndl-pane__preview'],
      [1, 'ndl-pane__drag-zone'],
      [1, 'ndl-pane__top', 3, 'drop', 'dragover'],
      [1, 'ndl-pane__left', 3, 'drop', 'dragover'],
      [1, 'ndl-pane__right', 3, 'drop', 'dragover'],
      [1, 'ndl-pane__center', 3, 'drop', 'dragover'],
      [1, 'ndl-pane__bottom', 3, 'drop', 'dragover'],
      [1, 'ndl-pane__empty'],
      [3, 'isDraggingChange', 'addTab', 'editTab', 'header', 'isDragging', 'pane'],
      [3, 'visibility', 'tabContext', 'tab'],
      [3, 'tabContext', 'tab'],
      [4, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
      [1, 'ndl-pane__button', 'ndl-pane__split-column', 3, 'title'],
      [1, 'ndl-pane__actions'],
      [1, 'ndl-pane__button', 'ndl-pane__add-tab', 3, 'title'],
      [1, 'ndl-pane__button', 'ndl-pane__close', 3, 'title'],
      [1, 'ndl-pane__button', 'ndl-pane__split-row', 3, 'title'],
      [1, 'ndl-pane__button', 'ndl-pane__split-column', 3, 'click', 'title'],
      ['icon', 'splitscreen_add', 'size', 'custom'],
      [1, 'ndl-pane__button', 'ndl-pane__add-tab', 3, 'click', 'title'],
      ['icon', 'add', 'size', 'custom'],
      [1, 'ndl-pane__button', 'ndl-pane__close', 3, 'click', 'title'],
      ['icon', 'close', 'size', 'custom'],
      [1, 'ndl-pane__button', 'ndl-pane__split-row', 3, 'click', 'title'],
      ['icon', 'splitscreen_vertical_add', 'size', 'custom'],
    ],
    template: function (e, t) {
      if (
        (e & 1 &&
          ($f(0),
          mv(1, Xi$1, 1, 3, 'ndl-header', 1),
          Fo$1(2, 'div', 2, 0),
          Tf('dragenter', function (o) {
            return t.onDragEnter(o);
          })('dragleave', function (o) {
            return t.onDragLeave(o);
          }),
          hf(4, 'div', 3),
          Fo$1(5, 'div', 4)(6, 'div', 5),
          Tf('drop', function (o) {
            return t.onDrop(o, 'top');
          })('dragover', function (o) {
            return t.onDragTop(o);
          }),
          $a$1(),
          Fo$1(7, 'div', 6),
          Tf('drop', function (o) {
            return t.onDrop(o, 'left');
          })('dragover', function (o) {
            return t.onDragLeft(o);
          }),
          $a$1(),
          Fo$1(8, 'div', 7),
          Tf('drop', function (o) {
            return t.onDrop(o, 'right');
          })('dragover', function (o) {
            return t.onDragRight(o);
          }),
          $a$1(),
          Fo$1(9, 'div', 8),
          Tf('drop', function (o) {
            return t.onDrop(o, 'center');
          })('dragover', function (o) {
            return t.onDragCenter(o);
          }),
          $a$1(),
          Fo$1(10, 'div', 9),
          Tf('drop', function (o) {
            return t.onDrop(o, 'bottom');
          })('dragover', function (o) {
            return t.onDragBottom(o);
          }),
          $a$1()(),
          Ev(11, Ji$1, 1, 1, null, null, Ki$1, false, sr, 3, 1, 'div', 10),
          $a$1()),
        e & 2)
      ) {
        let r = iE(t.pane().header);
        (Am(),
          yv(r && r.tabs.length && r?.isVisible ? 1 : -1),
          Am(),
          Af('ndl-pane__active', r?.tabs?.length),
          Am(2),
          xf('top', t.previewState()?.top, '%')('left', t.previewState()?.left, '%')(
            'right',
            t.previewState()?.right,
            '%',
          )('bottom', t.previewState()?.bottom, '%')('width', t.previewState()?.width, '%')(
            'height',
            t.previewState()?.height,
            '%',
          ),
          Af('ndl-pane__preview--active', t.previewState() !== void 0),
          Am(),
          Af('ndl-pane__drag-zone--active', t.dragService.currentDragData() !== void 0),
          Am(6),
          Iv(r?.tabs));
      }
    },
    dependencies: [_t, ut$1, ie, Be$1, me],
    styles: [
      '[_nghost-%COMP%]{display:flex;height:100%;width:100%;flex-direction:column;--ndl-pane-content-bg: var(--ndl-color-surface);--ndl-pane-action-bg: var(--ndl-color-base);--ndl-pane-button-sm: 25px;--ndl-pane-button-md: 30px;--ndl-pane-preview-color: var(--ndl-color-text)}.ndl-pane__content[_ngcontent-%COMP%]{height:100%;width:100%;flex:1;background-color:var(--ndl-pane-content-bg);overflow:auto;position:relative}.ndl-pane__preview[_ngcontent-%COMP%]{position:absolute;box-sizing:border-box;opacity:0;transform:scale(.98);transition:opacity .15s ease-out,transform .15s ease-out}.ndl-pane__preview--active[_ngcontent-%COMP%]{display:block;opacity:1;transform:scale(1);background-color:color-mix(in srgb,var(--ndl-pane-preview-color) 8%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1.5px solid color-mix(in srgb,var(--ndl-pane-preview-color) 35%,transparent);border-radius:var(--ndl-radius-sm);box-shadow:inset 0 0 24px color-mix(in srgb,var(--ndl-pane-preview-color) 6%,transparent);z-index:5}.ndl-pane__drag-zone[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;display:none}.ndl-pane__drag-zone--active[_ngcontent-%COMP%]{z-index:5;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:0}.ndl-pane__left[_ngcontent-%COMP%]{grid-row:1/4;grid-column:1}.ndl-pane__right[_ngcontent-%COMP%]{grid-row:1/4;grid-column:3}.ndl-pane__empty[_ngcontent-%COMP%]{display:flex;align-items:center;position:absolute;justify-content:center;height:100%;width:100%}.ndl-pane__button[_ngcontent-%COMP%]{background-color:transparent;color:var(--ndl-color-text);border-radius:50%;cursor:pointer;border:none;padding:0}.ndl-pane__empty[_ngcontent-%COMP%]   .ndl-pane__split-column[_ngcontent-%COMP%], .ndl-pane__empty[_ngcontent-%COMP%]   .ndl-pane__split-row[_ngcontent-%COMP%]{height:var(--ndl-pane-button-sm);width:var(--ndl-pane-button-sm);--ndl-icon--custom: var(--ndl-pane-button-sm)}.ndl-pane__actions[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.ndl-pane__close[_ngcontent-%COMP%], .ndl-pane__add-tab[_ngcontent-%COMP%]{height:var(--ndl-pane-button-md);width:var(--ndl-pane-button-md);--ndl-icon--custom: var(--ndl-pane-button-md)}.ndl-pane__button[_ngcontent-%COMP%]:hover{background-color:color-mix(in srgb,var(--ndl-pane-action-bg) 40%,transparent)}',
    ],
  });
};
var ur = (n, i) => i.id;
function dr(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'ndl-pane', 5),
      Tf('addTab', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.addTab.emit(r));
      })('addHeader', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.addHeader.emit(r));
      })('editTab', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.editTab.emit(r));
      }),
      $a$1());
  }
  if (n & 2) {
    let e = _v().$implicit;
    _v(2);
    let t = sE(0);
    pf('pane', e)('parent', t);
  }
}
function lr(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'ndl-item', 6),
      Tf('addTab', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.addTab.emit(r));
      })('addHeader', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.addHeader.emit(r));
      })('editTab', function (r) {
        Nl(e);
        let o = _v(3);
        return Sl(o.editTab.emit(r));
      }),
      $a$1());
  }
  if (n & 2) {
    let e = _v().$implicit;
    pf('item', e);
  }
}
function cr(n, i) {
  if (
    (n & 1 &&
      (Fo$1(0, 'as-split-area', 2),
      mv(1, dr, 1, 2, 'ndl-pane', 3)(2, lr, 1, 1, 'ndl-item', 4),
      $a$1()),
    n & 2)
  ) {
    let e = i.$implicit;
    (pf('size', e == null ? null : e.size), Am(), yv(e.type === 'pane' ? 1 : 2));
  }
}
function gr(n, i) {
  if (n & 1) {
    let e = bv();
    (Fo$1(0, 'as-split', 1),
      Tf('dragEnd', function (r) {
        Nl(e);
        let o = _v();
        return Sl(o.onDragEnd(r));
      }),
      Ev(1, cr, 3, 2, 'as-split-area', 2, ur),
      $a$1());
  }
  if (n & 2) {
    let e = _v(),
      t = sE(0);
    (pf('gutterSize', e.gutterSize())('direction', t.type === 'row' ? 'horizontal' : 'vertical'),
      Am(),
      Iv(t.children));
  }
}
var Ct = class n {
  layoutManager = E(ee);
  gutterSize = E(Je$1);
  item = YO.required();
  addTab = ZO();
  addHeader = ZO();
  editTab = ZO();
  onDragEnd(i) {
    this.layoutManager().setSizes(this.item().id, i.sizes);
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ndl-item']],
    hostAttrs: [1, 'ndl-item'],
    hostVars: 5,
    hostBindings: function (e, t) {
      e & 2 &&
        (ff('id', t.item().id),
        Af('ndl-item--row', t.item().type === 'row')(
          'ndl-item--column',
          t.item().type === 'column',
        ));
    },
    inputs: { item: [1, 'item'] },
    outputs: { addTab: 'addTab', addHeader: 'addHeader', editTab: 'editTab' },
    decls: 2,
    vars: 2,
    consts: [
      [3, 'gutterSize', 'direction'],
      [3, 'dragEnd', 'gutterSize', 'direction'],
      [1, 'ndl-item__area', 3, 'size'],
      [3, 'pane', 'parent'],
      [3, 'item'],
      [3, 'addTab', 'addHeader', 'editTab', 'pane', 'parent'],
      [3, 'addTab', 'addHeader', 'editTab', 'item'],
    ],
    template: function (e, t) {
      if ((e & 1 && ($f(0), mv(1, gr, 3, 2, 'as-split', 0)), e & 2)) {
        let r = iE(t.item());
        (Am(), yv(r.type === 'row' || r.type === 'column' ? 1 : -1));
      }
    },
    dependencies: [n, st$1, Ht$1, Un$1, bt$1],
    styles: [
      '[_nghost-%COMP%]{--as-gutter-background-color: var(--ndl-color-surface-alt);display:block;position:absolute;height:100%;width:100%}.ndl-item__area[_ngcontent-%COMP%]{position:relative}',
    ],
  });
};
var dt$1 = class n {
  manager = YO.required();
  gutterSize = YO(6);
  emptyPaneTemplate = YO();
  dragPreviewTemplate = YO();
  addTab = ZO();
  addHeader = ZO();
  editTab = ZO();
  get layoutManager() {
    return this.manager();
  }
  static ɵfac = function (e) {
    return new (e || n)();
  };
  static ɵcmp = nv({
    type: n,
    selectors: [['ngx-dock-layout']],
    hostAttrs: [1, 'ndl-layout'],
    inputs: {
      manager: [1, 'manager'],
      gutterSize: [1, 'gutterSize'],
      emptyPaneTemplate: [1, 'emptyPaneTemplate'],
      dragPreviewTemplate: [1, 'dragPreviewTemplate'],
    },
    outputs: { addTab: 'addTab', addHeader: 'addHeader', editTab: 'editTab' },
    features: [
      dE([
        { provide: ee, useFactory: () => E(n).manager },
        { provide: Je$1, useFactory: () => E(n).gutterSize },
        { provide: et$1, useFactory: () => E(n).emptyPaneTemplate },
        { provide: tt$1, useFactory: () => E(n).dragPreviewTemplate },
      ]),
    ],
    decls: 1,
    vars: 1,
    consts: [[3, 'addTab', 'addHeader', 'editTab', 'item']],
    template: function (e, t) {
      (e & 1 &&
        (Fo$1(0, 'ndl-item', 0),
        Tf('addTab', function (o) {
          return t.addTab.emit(o);
        })('addHeader', function (o) {
          return t.addHeader.emit(o);
        })('editTab', function (o) {
          return t.editTab.emit(o);
        }),
        $a$1()),
        e & 2 && pf('item', t.manager().config().root));
    },
    dependencies: [st$1, Ct],
    styles: [
      '@property --as-gutter-background-color{syntax: "<color>"; inherits: true; initial-value: #eeeeee;}@property --as-gutter-icon-horizontal{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-gutter-icon-vertical{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);}@property --as-gutter-icon-disabled{syntax: "<url>"; inherits: true; initial-value: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);}@property --as-transition-duration{syntax: "<time>"; inherits: true; initial-value: .3s;}@property --as-gutter-disabled-cursor{syntax: "*"; inherits: true; initial-value: default;}[_nghost-%COMP%]{display:block;position:relative}.ndl-layout__drag-overlay[_ngcontent-%COMP%]{position:absolute;inset:0;z-index:1000;background-color:#00000080;display:none}.ndl-layout__drag-overlay--dragging[_ngcontent-%COMP%]{display:block}',
    ],
  });
};
var yt = class {
  action;
  #e;
  #t = [];
  #n;
  #i;
  constructor({ action: i, strictLayout: e }) {
    ((this.action = i), (this.#e = e), (this.#n = () => e));
  }
  operation(i) {
    return (this.#t.push(i), this);
  }
  rollback(i) {
    return ((this.#n = i), this);
  }
  commit() {
    try {
      return ((this.#i ??= this.#t.reduce((i, e) => e(i), this.#e)), this.#i);
    } catch (i) {
      return (console.error(`[Action:${this.action}]`, i), this.#n());
    }
  }
  undo() {
    return this.#n();
  }
};
var vt = class {
  #e;
  #t = lo({});
  #n = lo(void 0);
  actions = this.#t.asReadonly();
  currentActionId = this.#n.asReadonly();
  constructor(i = 50) {
    this.#e = i;
  }
  dispatch(i) {
    let e = this.#n();
    if (e !== void 0) {
      let r = Object.entries(this.#t()),
        o = r.findIndex(([a]) => a === e);
      (this.#t.set(Object.fromEntries(r.slice(0, o))), this.#n.set(void 0));
    }
    let t = crypto.randomUUID();
    return (
      this.#t.update((r) => {
        let o = Object.entries(r),
          a = o.length >= this.#e ? o.slice(1) : o;
        return Object.fromEntries([...a, [t, i]]);
      }),
      i.commit()
    );
  }
  back() {
    let i = Object.keys(this.#t()),
      e = this.#n();
    if (e === void 0) {
      let o = i.at(-1);
      return o ? (this.#n.set(o), this.#t()[o].undo()) : void 0;
    }
    let t = i.indexOf(e);
    if (t <= 0) return;
    let r = i[t - 1];
    return (this.#n.set(r), this.#t()[r].undo());
  }
  next() {
    let i = this.#n();
    if (i === void 0) return;
    let e = Object.keys(this.#t()),
      t = e.indexOf(i),
      r = this.#t()[i].commit();
    return (this.#n.set(e[t + 1] ?? void 0), r);
  }
  clear() {
    (this.#t.set({}), this.#n.set(void 0));
  }
};
var qn$1 = class n {
  #e;
  config;
  components;
  settings;
  actions;
  currentActionId;
  constructor(i, e, t) {
    ((this.#e = new vt(t)),
      (this.actions = this.#e.actions),
      (this.currentActionId = this.#e.currentActionId),
      (this.components = e));
    let r = i.settings ? i.settings : void 0,
      o = ht$1(i.root, e, r);
    ((this.config = lo({ root: o, settings: r })),
      (this.settings = _E(() => this.config().settings)));
  }
  setConfig(i) {
    let e = i.settings ? i.settings : void 0,
      t = ht$1(i.root, this.components, e);
    (this.#e.clear(), this.config.set({ root: t, settings: e }));
  }
  backConfig() {
    let i = this.#e.back();
    i && this.config.set(i);
  }
  nextConfig() {
    let i = this.#e.next();
    i && this.config.set(i);
  }
  dispatch(i) {
    this.config.set(this.#e.dispatch(i));
  }
  createAction(i) {
    return new yt({ action: i, strictLayout: this.config() });
  }
  static init({ layout: i, components: e, maxHistorySize: t }) {
    return new n(i, e, t);
  }
  findItem(i, e = this.config().root) {
    return Te$1(i, e);
  }
  everyItem(i, e = this.config().root) {
    return xe(i, e);
  }
  findItemByIdOrFail(i, e = this.config().root) {
    return Gn$1(i, e);
  }
  setSizes(i, e) {
    let t = this.findItem((r) => r.id === i);
    (t?.type !== 'row' && t?.type !== 'column') ||
      this.dispatch(
        this.createAction('resize').operation((r) => B$1(H({}, r), { root: Zn$1(r.root, i, e) })),
      );
  }
  split(i, e, t, r, o) {
    let a = ft(B$1(H({ type: 'pane' }, o), { size: 50 }), this.components, this.settings());
    this.dispatch(
      this.createAction('split').operation((l) =>
        B$1(H({}, l), { root: Zt(l.root, i, e, t, r, a) }),
      ),
    );
  }
  activeTab(i, e) {
    this.dispatch(
      this.createAction('activeTab').operation((t) => B$1(H({}, t), { root: Wn$1(t.root, i, e) })),
    );
  }
  addTab(i, e, t = -1) {
    let r = B$1(
      H(
        {},
        He$1(
          B$1(H({}, e), { type: 'tab', isActive: e.isActive ?? false }),
          this.components,
          this.settings(),
        ),
      ),
      { mustBeLoaded: e.isActive ?? false },
    );
    this.dispatch(
      this.createAction('addTab').operation((o) => B$1(H({}, o), { root: gt(o.root, i, r, t) })),
    );
  }
  addHeader(i, e) {
    let t = pt$1(
      B$1(H({}, e), {
        type: 'header',
        tabs: e.tabs?.map((r) => B$1(H({}, r), { type: 'tab' })) ?? [],
      }),
      this.components,
      this.settings(),
    );
    this.dispatch(
      this.createAction('addHeader').operation((r) => B$1(H({}, r), { root: Vt$1(r.root, i, t) })),
    );
  }
  editTab(i, e, t) {
    this.dispatch(
      this.createAction('editTab').operation((r) => B$1(H({}, r), { root: jt$1(r.root, i, e, t) })),
    );
  }
  closeTab(i, e) {
    this.dispatch(
      this.createAction('closeTab').operation((t) => B$1(H({}, t), { root: Ut$1(t.root, i, e) })),
    );
  }
  closePane(i) {
    this.dispatch(
      this.createAction('closePane').operation((e) => B$1(H({}, e), { root: Gt$1(e.root, i) })),
    );
  }
  renameTab(i, e, t) {
    this.dispatch(
      this.createAction('renameTab').operation((r) =>
        B$1(H({}, r), { root: jt$1(r.root, i, e, { title: t }) }),
      ),
    );
  }
  moveTab(i, e) {
    let { tab: t } = i,
      r = this.createAction('moveTab');
    (i.headerId && i.paneId && this.#t(r, t.id, i.headerId, i.paneId),
      r.operation((o) =>
        B$1(H({}, o), {
          root: gt(
            o.root,
            e.headerId,
            B$1(H({}, t), { mustBeLoaded: t.isActive ?? false }),
            e.index,
          ),
        }),
      ),
      this.dispatch(r));
  }
  dropTabToPane(i, e) {
    let { tab: t } = i,
      { paneId: r, parentId: o, zone: a } = e,
      l = this.createAction('dropTabToPane');
    if ((i.headerId && i.paneId && this.#t(l, t.id, i.headerId, i.paneId), a !== 'center')) {
      let _ = a === 'top' || a === 'bottom' ? 'column' : 'row',
        y = a === 'top' || a === 'left' ? 0 : 1,
        E = ft(
          {
            type: 'pane',
            size: 50,
            header: { type: 'header', tabs: [B$1(H({}, t), { type: 'tab' })] },
          },
          this.components,
          this.settings(),
        );
      l.operation((A) => B$1(H({}, A), { root: Zt(A.root, o, r, _, y, E) }));
    } else {
      let _ = this.findItem((E) => E.id === r);
      if (_?.type !== 'pane') return;
      let y = _.header;
      if (y && y.tabs.length > 0)
        l.operation((E) =>
          B$1(H({}, E), {
            root: gt(E.root, y.id, B$1(H({}, t), { mustBeLoaded: t.isActive ?? false }), -1),
          }),
        );
      else {
        let E = pt$1(
          { type: 'header', tabs: [B$1(H({}, t), { type: 'tab', isActive: true })] },
          this.components,
          this.settings(),
        );
        l.operation((A) => B$1(H({}, A), { root: Vt$1(A.root, r, E) }));
      }
    }
    this.dispatch(l);
  }
  #t(i, e, t, r) {
    let o = this.findItem((a) => a.id === t);
    !o ||
      o.type !== 'header' ||
      (i.operation((a) => B$1(H({}, a), { root: Ut$1(a.root, t, e) })),
      o.tabs.filter((a) => a.id !== e).length === 0 &&
        i.operation((a) => B$1(H({}, a), { root: Gt$1(a.root, r) })));
  }
};
var Qe = class {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    manager;
  },
  bt = (() => {
    class t extends Qe {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return true;
      }
      addEventListener(e, r, i, o) {
        return (e.addEventListener(r, i, o), () => this.removeEventListener(e, r, i, o));
      }
      removeEventListener(e, r, i, o) {
        return e.removeEventListener(r, i, o);
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(co$1));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Rt = new x$1(''),
  mn = (() => {
    class t {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(e, r) {
        ((this._zone = r),
          e.forEach((a) => {
            a.manager = this;
          }));
        let i = e.filter((a) => !(a instanceof bt));
        this._plugins = i.slice().reverse();
        let o = e.find((a) => a instanceof bt);
        o && this._plugins.push(o);
      }
      addEventListener(e, r, i, o) {
        return this._findPluginFor(r).addEventListener(e, r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(e) {
        let r = this._eventNameToPlugin.get(e);
        if (r) return r;
        if (((r = this._plugins.find((o) => o.supports(e))), !r)) throw new b$1(-5101, false);
        return (this._eventNameToPlugin.set(e, r), r);
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(Rt), we$1(W));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  pn = 'ng-app-id';
function ii(t) {
  for (let n of t) n.remove();
}
function oi(t, n) {
  let e = n.createElement('style');
  return ((e.textContent = t), e);
}
function uo(t, n, e, r) {
  let i = t.head?.querySelectorAll(`style[${pn}="${n}"],link[${pn}="${n}"]`);
  if (!i || i.length === 0) return false;
  for (let o of i)
    (o.removeAttribute(pn),
      o instanceof HTMLLinkElement
        ? r.set(o.href.slice(o.href.lastIndexOf('/') + 1), { usage: 0, elements: [o] })
        : o.textContent && e.set(o.textContent, { usage: 0, elements: [o] }));
  return true;
}
function gn(t, n) {
  let e = n.createElement('link');
  return (e.setAttribute('rel', 'stylesheet'), e.setAttribute('href', t), e);
}
var vn = (() => {
    class t {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(e, r, i, o = {}) {
        ((this.doc = e),
          (this.appId = r),
          (this.nonce = i),
          uo(e, r, this.inline, this.external) && this.hosts.add(e.head));
      }
      addStyles(e, r) {
        for (let i of e) this.addUsage(i, this.inline, oi);
        r?.forEach((i) => this.addUsage(i, this.external, gn));
      }
      removeStyles(e, r) {
        for (let i of e) this.removeUsage(i, this.inline);
        r?.forEach((i) => this.removeUsage(i, this.external));
      }
      addUsage(e, r, i) {
        let o = r.get(e);
        o
          ? o.usage++
          : r.set(e, {
              usage: 1,
              elements: [...this.hosts].map((a) => this.addElement(a, i(e, this.doc))),
            });
      }
      removeUsage(e, r) {
        let i = r.get(e);
        i && (i.usage--, i.usage <= 0 && (ii(i.elements), r.delete(e)));
      }
      ngOnDestroy() {
        for (let [, { elements: e }] of [...this.inline, ...this.external]) ii(e);
        this.hosts.clear();
      }
      addHost(e) {
        if (!this.hosts.has(e)) {
          this.hosts.add(e);
          for (let [r, { elements: i }] of this.inline) i.push(this.addElement(e, oi(r, this.doc)));
          for (let [r, { elements: i }] of this.external)
            i.push(this.addElement(e, gn(r, this.doc)));
        }
      }
      removeHost(e) {
        this.hosts.delete(e);
        for (let r of [...this.inline.values(), ...this.external.values()]) {
          let i = [];
          for (let o of r.elements) o.parentNode === e ? o.remove() : i.push(o);
          r.elements = i;
        }
      }
      addElement(e, r) {
        return (this.nonce && r.setAttribute('nonce', this.nonce), e.appendChild(r));
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(co$1), we$1(zl), we$1(Vh, 8), we$1(jh));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  fn = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  yn = /%COMP%/g;
var si = '%COMP%',
  ho = `_nghost-${si}`,
  po = `_ngcontent-${si}`,
  fo = true,
  go = new x$1('', { factory: () => fo });
function mo(t) {
  return po.replace(yn, t);
}
function vo(t) {
  return ho.replace(yn, t);
}
function ci(t, n) {
  return n.map((e) => e.replace(yn, t));
}
var _n = (() => {
    class t {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      constructor(e, r, i, o, a, c, s = null, l = null) {
        ((this.eventManager = e),
          (this.sharedStylesHost = r),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = a),
          (this.ngZone = c),
          (this.nonce = s),
          (this.tracingService = l),
          (this.defaultRenderer = new Ze(e, a, c, this.tracingService)));
      }
      createRenderer(e, r) {
        if (!e || !r) return this.defaultRenderer;
        let i = this.getOrCreateRenderer(e, r);
        return (i instanceof wt ? i.applyToHost(e) : i instanceof Je && i.applyStyles(), i);
      }
      getOrCreateRenderer(e, r) {
        let i = this.rendererByCompId,
          o = i.get(r.id);
        if (!o) {
          let a = this.doc,
            c = this.ngZone,
            s = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            f = this.tracingService;
          switch (r.encapsulation) {
            case xt$1.Emulated:
              o = new wt(s, l, r, this.appId, u, a, c, f);
              break;
            case xt$1.ShadowDom:
              return new St(s, e, r, a, c, this.nonce, f, l);
            case xt$1.ExperimentalIsolatedShadowDom:
              return new St(s, e, r, a, c, this.nonce, f);
            default:
              o = new Je(s, l, r, u, a, c, f);
              break;
          }
          i.set(r.id, o);
        }
        return o;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(e) {
        this.rendererByCompId.delete(e);
      }
      static ɵfac = function (r) {
        return new (r || t)(
          we$1(mn),
          we$1(Hd),
          we$1(zl),
          we$1(go),
          we$1(co$1),
          we$1(W),
          we$1(Vh),
          we$1(kt$2, 8),
        );
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  Ze = class {
    eventManager;
    doc;
    ngZone;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = true;
    constructor(n, e, r, i) {
      ((this.eventManager = n), (this.doc = e), (this.ngZone = r), (this.tracingService = i));
    }
    destroy() {}
    destroyNode = null;
    createElement(n, e) {
      return e ? this.doc.createElementNS(fn[e] || e, n) : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, e) {
      (ai(n) ? n.content : n).appendChild(e);
    }
    insertBefore(n, e, r) {
      n && (ai(n) ? n.content : n).insertBefore(e, r);
    }
    removeChild(n, e) {
      e.remove();
    }
    selectRootElement(n, e) {
      let r = typeof n == 'string' ? this.doc.querySelector(n) : n;
      if (!r) throw new b$1(-5104, false);
      return (e || (r.textContent = ''), r);
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, e, r, i) {
      if (i) {
        e = i + ':' + e;
        let o = fn[i];
        o ? n.setAttributeNS(o, e, r) : n.setAttribute(e, r);
      } else n.setAttribute(e, r);
    }
    removeAttribute(n, e, r) {
      if (r) {
        let i = fn[r];
        i ? n.removeAttributeNS(i, e) : n.removeAttribute(`${r}:${e}`);
      } else n.removeAttribute(e);
    }
    addClass(n, e) {
      n.classList.add(e);
    }
    removeClass(n, e) {
      n.classList.remove(e);
    }
    setStyle(n, e, r, i) {
      i & (_o$1.DashCase | _o$1.Important)
        ? n.style.setProperty(e, r, i & _o$1.Important ? 'important' : '')
        : (n.style[e] = r);
    }
    removeStyle(n, e, r) {
      r & _o$1.DashCase ? n.style.removeProperty(e) : (n.style[e] = '');
    }
    setProperty(n, e, r) {
      n != null && (n[e] = r);
    }
    setValue(n, e) {
      n.nodeValue = e;
    }
    listen(n, e, r, i) {
      if (typeof n == 'string' && ((n = nt$1().getGlobalEventTarget(this.doc, n)), !n))
        throw new b$1(-5102, false);
      let o = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (o = this.tracingService.wrapEventListener(n, e, o)),
        this.eventManager.addEventListener(n, e, o, i)
      );
    }
    decoratePreventDefault(n) {
      return (e) => {
        if (e === '__ngUnwrap__') return n;
        n(e) === false && e.preventDefault();
      };
    }
  };
function ai(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var St = class extends Ze {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(n, e, r, i, o, a, c, s) {
      (super(n, i, o, c),
        (this.hostEl = e),
        (this.sharedStylesHost = s),
        (this.shadowRoot = e.attachShadow({ mode: 'open' })),
        this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot));
      let l = r.styles;
      l = ci(r.id, l);
      for (let f of l) {
        let h = document.createElement('style');
        (a && h.setAttribute('nonce', a), (h.textContent = f), this.shadowRoot.appendChild(h));
      }
      let u = r.getExternalStyles?.();
      if (u)
        for (let f of u) {
          let h = gn(f, i);
          (a && h.setAttribute('nonce', a), this.shadowRoot.appendChild(h));
        }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, e) {
      return super.appendChild(this.nodeOrShadowRoot(n), e);
    }
    insertBefore(n, e, r) {
      return super.insertBefore(this.nodeOrShadowRoot(n), e, r);
    }
    removeChild(n, e) {
      return super.removeChild(null, e);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Je = class extends Ze {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, e, r, i, o, a, c, s) {
      (super(n, o, a, c), (this.sharedStylesHost = e), (this.removeStylesOnCompDestroy = i));
      let l = r.styles;
      ((this.styles = s ? ci(s, l) : l), (this.styleUrls = r.getExternalStyles?.(s)));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        ln.size === 0 &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  wt = class extends Je {
    contentAttr;
    hostAttr;
    constructor(n, e, r, i, o, a, c, s) {
      let l = i + '-' + r.id;
      (super(n, e, r, o, a, c, s, l), (this.contentAttr = mo(l)), (this.hostAttr = vo(l)));
    }
    applyToHost(n) {
      (this.applyStyles(), this.setAttribute(n, this.hostAttr, ''));
    }
    createElement(n, e) {
      let r = super.createElement(n, e);
      return (super.setAttribute(r, this.contentAttr, ''), r);
    }
  };
var Et = class t extends kt$1 {
    supportsDOMEvents = true;
    static makeCurrent() {
      Jn$1(new t());
    }
    onAndCancel(n, e, r, i) {
      return (
        n.addEventListener(e, r, i),
        () => {
          n.removeEventListener(e, r, i);
        }
      );
    }
    dispatchEvent(n, e) {
      n.dispatchEvent(e);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, e) {
      return ((e = e || this.getDefaultDocument()), e.createElement(n));
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, e) {
      return e === 'window' ? window : e === 'document' ? n : e === 'body' ? n.body : null;
    }
    getBaseHref(n) {
      let e = yo();
      return e == null ? null : _o(e);
    }
    resetBaseElement() {
      Xe = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return ai$1(document.cookie, n);
    }
  },
  Xe = null;
function yo() {
  return ((Xe = Xe || document.head.querySelector('base')), Xe ? Xe.getAttribute('href') : null);
}
function _o(t) {
  return new URL(t, document.baseURI).pathname;
}
var li = ['alt', 'control', 'meta', 'shift'],
  Co = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  bo = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  ui = (() => {
    class t extends Qe {
      constructor(e) {
        super(e);
      }
      supports(e) {
        return t.parseEventName(e) != null;
      }
      addEventListener(e, r, i, o) {
        let a = t.parseEventName(r),
          c = t.eventCallback(a.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => nt$1().onAndCancel(e, a.domEventName, c, o));
      }
      static parseEventName(e) {
        let r = e.toLowerCase().split('.'),
          i = r.shift();
        if (r.length === 0 || !(i === 'keydown' || i === 'keyup')) return null;
        let o = t._normalizeKey(r.pop()),
          a = '',
          c = r.indexOf('code');
        if (
          (c > -1 && (r.splice(c, 1), (a = 'code.')),
          li.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (a += l + '.'));
          }),
          (a += o),
          r.length != 0 || o.length === 0)
        )
          return null;
        let s = {};
        return ((s.domEventName = i), (s.fullKey = a), s);
      }
      static matchEventFullKeyCode(e, r) {
        let i = Co[e.key] || e.key,
          o = '';
        return (
          r.indexOf('code.') > -1 && ((i = e.code), (o = 'code.')),
          i == null || !i
            ? false
            : ((i = i.toLowerCase()),
              i === ' ' ? (i = 'space') : i === '.' && (i = 'dot'),
              li.forEach((a) => {
                if (a !== i) {
                  let c = bo[a];
                  c(e) && (o += a + '.');
                }
              }),
              (o += i),
              o === r)
        );
      }
      static eventCallback(e, r, i) {
        return (o) => {
          t.matchEventFullKeyCode(o, e) && i.runGuarded(() => r(o));
        };
      }
      static _normalizeKey(e) {
        return e === 'esc' ? 'escape' : e;
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(co$1));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function Cn(t, n, e) {
  return oi$1(this, null, function* () {
    let r = H({ rootComponent: t }, So(n, e));
    return oL(r);
  });
}
function So(t, n) {
  return {
    platformRef: n?.platformRef,
    appProviders: [...Mo, ...(t?.providers ?? [])],
    platformProviders: To,
  };
}
function wo() {
  Et.makeCurrent();
}
function Ro() {
  return new je$1();
}
function Eo() {
  return (Sg(document), document);
}
var To = [
  { provide: jh, useValue: Pa$1 },
  { provide: Ql, useValue: wo, multi: true },
  { provide: co$1, useFactory: Eo },
];
var Mo = [
  { provide: es$1, useValue: 'root' },
  { provide: je$1, useFactory: Ro },
  { provide: Rt, useClass: bt, multi: true },
  { provide: Rt, useClass: ui, multi: true },
  _n,
  { provide: Hd, useClass: vn },
  { provide: vn, useExisting: Hd },
  mn,
  { provide: Gn$2, useExisting: _n },
  [],
];
var di = (() => {
  class t {
    _doc;
    constructor(e) {
      this._doc = e;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(e) {
      this._doc.title = e || '';
    }
    static ɵfac = function (r) {
      return new (r || t)(we$1(co$1));
    };
    static ɵprov = oe({ token: t, factory: t.ɵfac, providedIn: 'root' });
  }
  return t;
})();
var g = 'primary',
  dt = Symbol('RouteTitle'),
  En = class {
    params;
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let e = this.params[n];
        return Array.isArray(e) ? e[0] : e;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let e = this.params[n];
        return Array.isArray(e) ? e : [e];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Le(t) {
  return new En(t);
}
function bn(t, n, e) {
  for (let r = 0; r < t.length; r++) {
    let i = t[r],
      o = n[r];
    if (i[0] === ':') e[i.substring(1)] = o;
    else if (i !== o.path) return false;
  }
  return true;
}
function Ao(t, n, e) {
  let r = e.path.split('/'),
    i = r.indexOf('**');
  if (i === -1) {
    if (r.length > t.length || (e.pathMatch === 'full' && (n.hasChildren() || r.length < t.length)))
      return null;
    let s = {},
      l = t.slice(0, r.length);
    return bn(r, l, s) ? { consumed: l, posParams: s } : null;
  }
  if (i !== r.lastIndexOf('**')) return null;
  let o = r.slice(0, i),
    a = r.slice(i + 1);
  if (
    o.length + a.length > t.length ||
    (e.pathMatch === 'full' && n.hasChildren() && e.path !== '**')
  )
    return null;
  let c = {};
  return !bn(o, t.slice(0, o.length), c) || !bn(a, t.slice(t.length - a.length), c)
    ? null
    : { consumed: t, posParams: c };
}
function Dt(t) {
  return new Promise((n, e) => {
    t.pipe(eh()).subscribe({ next: (r) => n(r), error: (r) => e(r) });
  });
}
function Do(t, n) {
  if (t.length !== n.length) return false;
  for (let e = 0; e < t.length; ++e) if (!ne(t[e], n[e])) return false;
  return true;
}
function ne(t, n) {
  let e = t ? Tn(t) : void 0,
    r = n ? Tn(n) : void 0;
  if (!e || !r || e.length != r.length) return false;
  let i;
  for (let o = 0; o < e.length; o++) if (((i = e[o]), !Ci(t[i], n[i]))) return false;
  return true;
}
function Tn(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Ci(t, n) {
  if (Array.isArray(t) && Array.isArray(n)) {
    if (t.length !== n.length) return false;
    let e = [...t].sort(),
      r = [...n].sort();
    return e.every((i, o) => r[o] === i);
  } else return t === n;
}
function Po(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Te(t) {
  return Rp(t) ? t : Va$1(t) ? Ie(Promise.resolve(t)) : xp(t);
}
function bi(t) {
  return Rp(t) ? Dt(t) : Promise.resolve(t);
}
var Oo = { exact: Ri, subset: Ei },
  Si = { exact: No, subset: ko, ignored: () => true },
  wi = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
  Mn = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' };
function hi(t, n, e) {
  return (
    Oo[e.paths](t.root, n.root, e.matrixParams) &&
    Si[e.queryParams](t.queryParams, n.queryParams) &&
    !(e.fragment === 'exact' && t.fragment !== n.fragment)
  );
}
function No(t, n) {
  return ne(t, n);
}
function Ri(t, n, e) {
  if (
    !we(t.segments, n.segments) ||
    !xt(t.segments, n.segments, e) ||
    t.numberOfChildren !== n.numberOfChildren
  )
    return false;
  for (let r in n.children)
    if (!t.children[r] || !Ri(t.children[r], n.children[r], e)) return false;
  return true;
}
function ko(t, n) {
  return (
    Object.keys(n).length <= Object.keys(t).length && Object.keys(n).every((e) => Ci(t[e], n[e]))
  );
}
function Ei(t, n, e) {
  return Ti(t, n, n.segments, e);
}
function Ti(t, n, e, r) {
  if (t.segments.length > e.length) {
    let i = t.segments.slice(0, e.length);
    return !(!we(i, e) || n.hasChildren() || !xt(i, e, r));
  } else if (t.segments.length === e.length) {
    if (!we(t.segments, e) || !xt(t.segments, e, r)) return false;
    for (let i in n.children)
      if (!t.children[i] || !Ei(t.children[i], n.children[i], r)) return false;
    return true;
  } else {
    let i = e.slice(0, t.segments.length),
      o = e.slice(t.segments.length);
    return !we(t.segments, i) || !xt(t.segments, i, r) || !t.children[g]
      ? false
      : Ti(t.children[g], n, o, r);
  }
}
function xt(t, n, e) {
  return n.every((r, i) => Si[e](t[i].parameters, r.parameters));
}
var X = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(n = new b([], {}), e = {}, r = null) {
      ((this.root = n), (this.queryParams = e), (this.fragment = r));
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= Le(this.queryParams)), this._queryParamMap);
    }
    toString() {
      return jo.serialize(this);
    }
  },
  b = class {
    segments;
    children;
    parent = null;
    constructor(n, e) {
      ((this.segments = n),
        (this.children = e),
        Object.values(e).forEach((r) => (r.parent = this)));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return It(this);
    }
  },
  Se = class {
    path;
    parameters;
    _parameterMap;
    constructor(n, e) {
      ((this.path = n), (this.parameters = e));
    }
    get parameterMap() {
      return ((this._parameterMap ??= Le(this.parameters)), this._parameterMap);
    }
    toString() {
      return xi(this);
    }
  };
function Uo(t, n) {
  return we(t, n) && t.every((e, r) => ne(e.parameters, n[r].parameters));
}
function we(t, n) {
  return t.length !== n.length ? false : t.every((e, r) => e.path === n[r].path);
}
function Lo(t, n) {
  let e = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === g && (e = e.concat(n(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== g && (e = e.concat(n(i, r)));
    }),
    e
  );
}
var zt = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: () => new Re() });
    }
    return t;
  })(),
  Re = class {
    parse(n) {
      let e = new In(n);
      return new X(e.parseRootSegment(), e.parseQueryParams(), e.parseFragment());
    }
    serialize(n) {
      let e = `/${et(n.root, true)}`,
        r = zo(n.queryParams),
        i = typeof n.fragment == 'string' ? `#${Ho(n.fragment)}` : '';
      return `${e}${r}${i}`;
    }
  },
  jo = new Re();
function It(t) {
  return t.segments.map((n) => xi(n)).join('/');
}
function et(t, n) {
  if (!t.hasChildren()) return It(t);
  if (n) {
    let e = t.children[g] ? et(t.children[g], false) : '',
      r = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== g && r.push(`${i}:${et(o, false)}`);
      }),
      r.length > 0 ? `${e}(${r.join('//')})` : e
    );
  } else {
    let e = Lo(t, (r, i) => (i === g ? [et(t.children[g], false)] : [`${i}:${et(r, false)}`]));
    return Object.keys(t.children).length === 1 && t.children[g] != null
      ? `${It(t)}/${e[0]}`
      : `${It(t)}/(${e.join('//')})`;
  }
}
function Mi(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function Tt(t) {
  return Mi(t).replace(/%3B/gi, ';');
}
function Ho(t) {
  return encodeURI(t);
}
function xn(t) {
  return Mi(t).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function At(t) {
  return decodeURIComponent(t);
}
function pi(t) {
  return At(t.replace(/\+/g, '%20'));
}
function xi(t) {
  return `${xn(t.path)}${$o(t.parameters)}`;
}
function $o(t) {
  return Object.entries(t)
    .map(([n, e]) => `;${xn(n)}=${xn(e)}`)
    .join('');
}
function zo(t) {
  let n = Object.entries(t)
    .map(([e, r]) =>
      Array.isArray(r) ? r.map((i) => `${Tt(e)}=${Tt(i)}`).join('&') : `${Tt(e)}=${Tt(r)}`,
    )
    .filter((e) => e);
  return n.length ? `?${n.join('&')}` : '';
}
var Fo = /^[^\/()?;#]+/;
function Sn(t) {
  let n = t.match(Fo);
  return n ? n[0] : '';
}
var Bo = /^[^\/()?;=#]+/;
function Vo(t) {
  let n = t.match(Bo);
  return n ? n[0] : '';
}
var qo = /^[^=?&#]+/;
function Go(t) {
  let n = t.match(qo);
  return n ? n[0] : '';
}
var Wo = /^[^&#]+/;
function Ko(t) {
  let n = t.match(Wo);
  return n ? n[0] : '';
}
var In = class {
  url;
  remaining;
  constructor(n) {
    ((this.url = n), (this.remaining = n));
  }
  parseRootSegment() {
    for (; this.consumeOptional('/'); );
    return this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')
      ? new b([], {})
      : new b([], this.parseChildren());
  }
  parseQueryParams() {
    let n = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(n);
      while (this.consumeOptional('&'));
    return n;
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren(n = 0) {
    if (n > 50) throw new b$1(4010, false);
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let e = [];
    for (
      this.peekStartsWith('(') || e.push(this.parseSegment());
      this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');
    )
      (this.capture('/'), e.push(this.parseSegment()));
    let r = {};
    this.peekStartsWith('/(') && (this.capture('/'), (r = this.parseParens(true, n)));
    let i = {};
    return (
      this.peekStartsWith('(') && (i = this.parseParens(false, n)),
      (e.length > 0 || Object.keys(r).length > 0) && (i[g] = new b(e, r)),
      i
    );
  }
  parseSegment() {
    let n = Sn(this.remaining);
    if (n === '' && this.peekStartsWith(';')) throw new b$1(4009, false);
    return (this.capture(n), new Se(At(n), this.parseMatrixParams()));
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(';'); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let e = Vo(this.remaining);
    if (!e) return;
    this.capture(e);
    let r = '';
    if (this.consumeOptional('=')) {
      let i = Sn(this.remaining);
      i && ((r = i), this.capture(r));
    }
    n[At(e)] = At(r);
  }
  parseQueryParam(n) {
    let e = Go(this.remaining);
    if (!e) return;
    this.capture(e);
    let r = '';
    if (this.consumeOptional('=')) {
      let a = Ko(this.remaining);
      a && ((r = a), this.capture(r));
    }
    let i = pi(e),
      o = pi(r);
    if (n.hasOwnProperty(i)) {
      let a = n[i];
      (Array.isArray(a) || ((a = [a]), (n[i] = a)), a.push(o));
    } else n[i] = o;
  }
  parseParens(n, e) {
    let r = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let i = Sn(this.remaining),
        o = this.remaining[i.length];
      if (o !== '/' && o !== ')' && o !== ';') throw new b$1(4010, false);
      let a;
      i.indexOf(':') > -1
        ? ((a = i.slice(0, i.indexOf(':'))), this.capture(a), this.capture(':'))
        : n && (a = g);
      let c = this.parseChildren(e + 1);
      ((r[a ?? g] = Object.keys(c).length === 1 && c[g] ? c[g] : new b([], c)),
        this.consumeOptional('//'));
    }
    return r;
  }
  peekStartsWith(n) {
    return this.remaining.startsWith(n);
  }
  consumeOptional(n) {
    return this.peekStartsWith(n)
      ? ((this.remaining = this.remaining.substring(n.length)), true)
      : false;
  }
  capture(n) {
    if (!this.consumeOptional(n)) throw new b$1(4011, false);
  }
};
function Ii(t) {
  return t.segments.length > 0 ? new b([], { [g]: t }) : t;
}
function Ai(t) {
  let n = {};
  for (let [r, i] of Object.entries(t.children)) {
    let o = Ai(i);
    if (r === g && o.segments.length === 0 && o.hasChildren())
      for (let [a, c] of Object.entries(o.children)) n[a] = c;
    else (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
  }
  let e = new b(t.segments, n);
  return Yo(e);
}
function Yo(t) {
  if (t.numberOfChildren === 1 && t.children[g]) {
    let n = t.children[g];
    return new b(t.segments.concat(n.segments), n.children);
  }
  return t;
}
function je(t) {
  return t instanceof X;
}
function Qo(t, n, e = null, r = null, i = new Re()) {
  let o = Di(t);
  return Pi(o, n, e, r, i);
}
function Di(t) {
  let n;
  function e(o) {
    let a = {};
    for (let s of o.children) {
      let l = e(s);
      a[s.outlet] = l;
    }
    let c = new b(o.url, a);
    return (o === t && (n = c), c);
  }
  let r = e(t.root),
    i = Ii(r);
  return n ?? i;
}
function Pi(t, n, e, r, i) {
  let o = t;
  for (; o.parent; ) o = o.parent;
  if (n.length === 0) return wn(o, o, o, e, r, i);
  let a = Zo(n);
  if (a.toRoot()) return wn(o, o, new b([], {}), e, r, i);
  let c = Jo(a, o, t),
    s = c.processChildren
      ? nt(c.segmentGroup, c.index, a.commands)
      : Ni(c.segmentGroup, c.index, a.commands);
  return wn(o, c.segmentGroup, s, e, r, i);
}
function Pt(t) {
  return typeof t == 'object' && t != null && !t.outlets && !t.segmentPath;
}
function ot(t) {
  return typeof t == 'object' && t != null && t.outlets;
}
function fi(t, n, e) {
  t ||= '\u0275';
  let r = new X();
  return ((r.queryParams = { [t]: n }), e.parse(e.serialize(r)).queryParams[t]);
}
function wn(t, n, e, r, i, o) {
  let a = {};
  for (let [l, u] of Object.entries(r ?? {}))
    a[l] = Array.isArray(u) ? u.map((f) => fi(l, f, o)) : fi(l, u, o);
  let c;
  t === n ? (c = e) : (c = Oi(t, n, e));
  let s = Ii(Ai(c));
  return new X(s, a, i);
}
function Oi(t, n, e) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === n ? (r[i] = e) : (r[i] = Oi(o, n, e));
    }),
    new b(t.segments, r)
  );
}
var Ot = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(n, e, r) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = e),
      (this.commands = r),
      n && r.length > 0 && Pt(r[0]))
    )
      throw new b$1(4003, false);
    let i = r.find(ot);
    if (i && i !== Po(r)) throw new b$1(4004, false);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function Zo(t) {
  if (typeof t[0] == 'string' && t.length === 1 && t[0] === '/') return new Ot(true, 0, t);
  let n = 0,
    e = false,
    r = t.reduce((i, o, a) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let c = {};
          return (
            Object.entries(o.outlets).forEach(([s, l]) => {
              c[s] = typeof l == 'string' ? l.split('/') : l;
            }),
            [...i, { outlets: c }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != 'string'
        ? [...i, o]
        : a === 0
          ? (o.split('/').forEach((c, s) => {
              (s == 0 && c === '.') ||
                (s == 0 && c === '' ? (e = true) : c === '..' ? n++ : c != '' && i.push(c));
            }),
            i)
          : [...i, o];
    }, []);
  return new Ot(e, n, r);
}
var ke = class {
  segmentGroup;
  processChildren;
  index;
  constructor(n, e, r) {
    ((this.segmentGroup = n), (this.processChildren = e), (this.index = r));
  }
};
function Jo(t, n, e) {
  if (t.isAbsolute) return new ke(n, true, 0);
  if (!e) return new ke(n, false, NaN);
  if (e.parent === null) return new ke(e, true, 0);
  let r = Pt(t.commands[0]) ? 0 : 1,
    i = e.segments.length - 1 + r;
  return Xo(e, i, t.numberOfDoubleDots);
}
function Xo(t, n, e) {
  let r = t,
    i = n,
    o = e;
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new b$1(4005, false);
    i = r.segments.length;
  }
  return new ke(r, false, i - o);
}
function ea(t) {
  return ot(t[0]) ? t[0].outlets : { [g]: t };
}
function Ni(t, n, e) {
  if (((t ??= new b([], {})), t.segments.length === 0 && t.hasChildren())) return nt(t, n, e);
  let r = ta(t, n, e),
    i = e.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let o = new b(t.segments.slice(0, r.pathIndex), {});
    return ((o.children[g] = new b(t.segments.slice(r.pathIndex), t.children)), nt(o, 0, i));
  } else
    return r.match && i.length === 0
      ? new b(t.segments, {})
      : r.match && !t.hasChildren()
        ? An(t, n, e)
        : r.match
          ? nt(t, 0, i)
          : An(t, n, e);
}
function nt(t, n, e) {
  if (e.length === 0) return new b(t.segments, {});
  {
    let r = ea(e),
      i = {};
    if (
      Object.keys(r).some((o) => o !== g) &&
      t.children[g] &&
      t.numberOfChildren === 1 &&
      t.children[g].segments.length === 0
    ) {
      let o = nt(t.children[g], n, e);
      return new b(t.segments, o.children);
    }
    return (
      Object.entries(r).forEach(([o, a]) => {
        (typeof a == 'string' && (a = [a]), a !== null && (i[o] = Ni(t.children[o], n, a)));
      }),
      Object.entries(t.children).forEach(([o, a]) => {
        r[o] === void 0 && (i[o] = a);
      }),
      new b(t.segments, i)
    );
  }
}
function ta(t, n, e) {
  let r = 0,
    i = n,
    o = { match: false, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= e.length) return o;
    let a = t.segments[i],
      c = e[r];
    if (ot(c)) break;
    let s = `${c}`,
      l = r < e.length - 1 ? e[r + 1] : null;
    if (i > 0 && s === void 0) break;
    if (s && l && typeof l == 'object' && l.outlets === void 0) {
      if (!mi(s, l, a)) return o;
      r += 2;
    } else {
      if (!mi(s, {}, a)) return o;
      r++;
    }
    i++;
  }
  return { match: true, pathIndex: i, commandIndex: r };
}
function An(t, n, e) {
  let r = t.segments.slice(0, n),
    i = 0;
  for (; i < e.length; ) {
    let o = e[i];
    if (ot(o)) {
      let s = na(o.outlets);
      return new b(r, s);
    }
    if (i === 0 && Pt(e[0])) {
      let s = t.segments[n];
      (r.push(new Se(s.path, gi(e[0]))), i++);
      continue;
    }
    let a = ot(o) ? o.outlets[g] : `${o}`,
      c = i < e.length - 1 ? e[i + 1] : null;
    a && c && Pt(c) ? (r.push(new Se(a, gi(c))), (i += 2)) : (r.push(new Se(a, {})), i++);
  }
  return new b(r, {});
}
function na(t) {
  let n = {};
  return (
    Object.entries(t).forEach(([e, r]) => {
      (typeof r == 'string' && (r = [r]), r !== null && (n[e] = An(new b([], {}), 0, r)));
    }),
    n
  );
}
function gi(t) {
  let n = {};
  return (Object.entries(t).forEach(([e, r]) => (n[e] = `${r}`)), n);
}
function mi(t, n, e) {
  return t == e.path && ne(n, e.parameters);
}
var rt = 'imperative',
  x = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = 'NavigationStart'),
      (t[(t.NavigationEnd = 1)] = 'NavigationEnd'),
      (t[(t.NavigationCancel = 2)] = 'NavigationCancel'),
      (t[(t.NavigationError = 3)] = 'NavigationError'),
      (t[(t.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (t[(t.ResolveStart = 5)] = 'ResolveStart'),
      (t[(t.ResolveEnd = 6)] = 'ResolveEnd'),
      (t[(t.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (t[(t.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (t[(t.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (t[(t.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (t[(t.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (t[(t.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (t[(t.ActivationStart = 13)] = 'ActivationStart'),
      (t[(t.ActivationEnd = 14)] = 'ActivationEnd'),
      (t[(t.Scroll = 15)] = 'Scroll'),
      (t[(t.NavigationSkipped = 16)] = 'NavigationSkipped'),
      t
    );
  })(x || {}),
  B = class {
    id;
    url;
    constructor(n, e) {
      ((this.id = n), (this.url = e));
    }
  },
  He = class extends B {
    type = x.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(n, e, r = 'imperative', i = null) {
      (super(n, e), (this.navigationTrigger = r), (this.restoredState = i));
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  fe = class extends B {
    urlAfterRedirects;
    type = x.NavigationEnd;
    constructor(n, e, r) {
      (super(n, e), (this.urlAfterRedirects = r));
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  P = (function (t) {
    return (
      (t[(t.Redirect = 0)] = 'Redirect'),
      (t[(t.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (t[(t.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (t[(t.GuardRejected = 3)] = 'GuardRejected'),
      (t[(t.Aborted = 4)] = 'Aborted'),
      t
    );
  })(P || {}),
  Nt = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] = 'IgnoredByUrlHandlingStrategy'),
      t
    );
  })(Nt || {}),
  Z = class extends B {
    reason;
    code;
    type = x.NavigationCancel;
    constructor(n, e, r, i) {
      (super(n, e), (this.reason = r), (this.code = i));
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  };
function ki(t) {
  return t instanceof Z && (t.code === P.Redirect || t.code === P.SupersededByNewNavigation);
}
var ge = class extends B {
    reason;
    code;
    type = x.NavigationSkipped;
    constructor(n, e, r, i) {
      (super(n, e), (this.reason = r), (this.code = i));
    }
  },
  $e = class extends B {
    error;
    target;
    type = x.NavigationError;
    constructor(n, e, r, i) {
      (super(n, e), (this.error = r), (this.target = i));
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  kt = class extends B {
    urlAfterRedirects;
    state;
    type = x.RoutesRecognized;
    constructor(n, e, r, i) {
      (super(n, e), (this.urlAfterRedirects = r), (this.state = i));
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Dn = class extends B {
    urlAfterRedirects;
    state;
    type = x.GuardsCheckStart;
    constructor(n, e, r, i) {
      (super(n, e), (this.urlAfterRedirects = r), (this.state = i));
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Pn = class extends B {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = x.GuardsCheckEnd;
    constructor(n, e, r, i, o) {
      (super(n, e), (this.urlAfterRedirects = r), (this.state = i), (this.shouldActivate = o));
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  On = class extends B {
    urlAfterRedirects;
    state;
    type = x.ResolveStart;
    constructor(n, e, r, i) {
      (super(n, e), (this.urlAfterRedirects = r), (this.state = i));
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Nn = class extends B {
    urlAfterRedirects;
    state;
    type = x.ResolveEnd;
    constructor(n, e, r, i) {
      (super(n, e), (this.urlAfterRedirects = r), (this.state = i));
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  kn = class {
    route;
    type = x.RouteConfigLoadStart;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Un = class {
    route;
    type = x.RouteConfigLoadEnd;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Ln = class {
    snapshot;
    type = x.ChildActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  jn = class {
    snapshot;
    type = x.ChildActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Hn = class {
    snapshot;
    type = x.ActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  $n = class {
    snapshot;
    type = x.ActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var ze = class {},
  at = class {},
  Fe = class {
    url;
    navigationBehaviorOptions;
    constructor(n, e) {
      ((this.url = n), (this.navigationBehaviorOptions = e));
    }
  };
function ra(t) {
  return !(t instanceof ze) && !(t instanceof Fe) && !(t instanceof at);
}
var zn = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return this.route?.snapshot._environmentInjector ?? this.rootInjector;
    }
    constructor(n) {
      ((this.rootInjector = n), (this.children = new ht(this.rootInjector)));
    }
  },
  ht = (() => {
    class t {
      rootInjector;
      contexts = new Map();
      constructor(e) {
        this.rootInjector = e;
      }
      onChildOutletCreated(e, r) {
        let i = this.getOrCreateContext(e);
        ((i.outlet = r), this.contexts.set(e, i));
      }
      onChildOutletDestroyed(e) {
        let r = this.getContext(e);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let e = this.contexts;
        return ((this.contexts = new Map()), e);
      }
      onOutletReAttached(e) {
        this.contexts = e;
      }
      getOrCreateContext(e) {
        let r = this.getContext(e);
        return (r || ((r = new zn(this.rootInjector)), this.contexts.set(e, r)), r);
      }
      getContext(e) {
        return this.contexts.get(e) || null;
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(re));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Ut = class {
    _root;
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let e = this.pathFromRoot(n);
      return e.length > 1 ? e[e.length - 2] : null;
    }
    children(n) {
      let e = Fn(n, this._root);
      return e ? e.children.map((r) => r.value) : [];
    }
    firstChild(n) {
      let e = Fn(n, this._root);
      return e && e.children.length > 0 ? e.children[0].value : null;
    }
    siblings(n) {
      let e = Bn(n, this._root);
      return e.length < 2
        ? []
        : e[e.length - 2].children.map((i) => i.value).filter((i) => i !== n);
    }
    pathFromRoot(n) {
      return Bn(n, this._root).map((e) => e.value);
    }
  };
function Fn(t, n) {
  if (t === n.value) return n;
  for (let e of n.children) {
    let r = Fn(t, e);
    if (r) return r;
  }
  return null;
}
function Bn(t, n) {
  if (t === n.value) return [n];
  for (let e of n.children) {
    let r = Bn(t, e);
    if (r.length) return (r.unshift(n), r);
  }
  return [];
}
var U = class {
  value;
  children;
  constructor(n, e) {
    ((this.value = n), (this.children = e));
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Ne(t) {
  let n = {};
  return (t && t.children.forEach((e) => (n[e.value.outlet] = e)), n);
}
var Lt = class extends Ut {
  snapshot;
  constructor(n, e) {
    (super(n), (this.snapshot = e), Xn(this, n));
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Ui(t, n) {
  let e = ia(t, n),
    r = new En$1([new Se('', {})]),
    i = new En$1({}),
    o = new En$1({}),
    a = new En$1({}),
    c = new En$1(''),
    s = new Ee(r, i, a, c, o, g, t, e.root);
  return ((s.snapshot = e.root), new Lt(new U(s, []), e));
}
function ia(t, n) {
  let e = {},
    r = {},
    i = {},
    a = new st([], e, i, '', r, g, t, null, {}, n);
  return new jt('', new U(a, []));
}
var Ee = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    _localInjector;
    constructor(n, e, r, i, o, a, c, s) {
      ((this.urlSubject = n),
        (this.paramsSubject = e),
        (this.queryParamsSubject = r),
        (this.fragmentSubject = i),
        (this.dataSubject = o),
        (this.outlet = a),
        (this.component = c),
        (this._futureSnapshot = s),
        (this.title = this.dataSubject?.pipe(De$1((l) => l[dt])) ?? xp(void 0)),
        (this.url = n),
        (this.params = e),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o));
    }
    get routeConfig() {
      return this._futureSnapshot.routeConfig;
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return ((this._paramMap ??= this.params.pipe(De$1((n) => Le(n)))), this._paramMap);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= this.queryParams.pipe(De$1((n) => Le(n)))),
        this._queryParamMap
      );
    }
    toString() {
      return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
    }
  },
  oa = 'always';
function Jn(t, n, e) {
  let r,
    { routeConfig: i } = t;
  return (
    n !== null &&
    (e === 'always' || i?.path === '' || (!n.component && !n.routeConfig?.loadComponent))
      ? (r = {
          params: H(H({}, n.params), t.params),
          data: H(H({}, n.data), t.data),
          resolve: H(H(H(H({}, t.data), n.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: H({}, t.params),
          data: H({}, t.data),
          resolve: H(H({}, t.data), t._resolvedData ?? {}),
        }),
    i && ji(i) && (r.resolve[dt] = i.title),
    r
  );
}
var st = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    _environmentInjector;
    get title() {
      return this.data?.[dt];
    }
    constructor(n, e, r, i, o, a, c, s, l, u) {
      ((this.url = n),
        (this.params = e),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = a),
        (this.component = c),
        (this.routeConfig = s),
        (this._resolve = l),
        (this._environmentInjector = u));
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return ((this._paramMap ??= Le(this.params)), this._paramMap);
    }
    get queryParamMap() {
      return ((this._queryParamMap ??= Le(this.queryParams)), this._queryParamMap);
    }
    toString() {
      let n = this.url.map((r) => r.toString()).join('/'),
        e = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${n}', path:'${e}')`;
    }
  },
  jt = class extends Ut {
    url;
    constructor(n, e) {
      (super(e), (this.url = n), Xn(this, e));
    }
    toString() {
      return Li(this._root);
    }
  };
function Xn(t, n) {
  ((n.value._routerState = t), n.children.forEach((e) => Xn(t, e)));
}
function Li(t) {
  let n = t.children.length > 0 ? ` { ${t.children.map(Li).join(', ')} } ` : '';
  return `${t.value}${n}`;
}
function Rn(t) {
  if (t.snapshot) {
    let n = t.snapshot,
      e = t._futureSnapshot;
    ((t.snapshot = e),
      ne(n.queryParams, e.queryParams) || t.queryParamsSubject.next(e.queryParams),
      n.fragment !== e.fragment && t.fragmentSubject.next(e.fragment),
      ne(n.params, e.params) || t.paramsSubject.next(e.params),
      Do(n.url, e.url) || t.urlSubject.next(e.url),
      ne(n.data, e.data) || t.dataSubject.next(e.data));
  } else ((t.snapshot = t._futureSnapshot), t.dataSubject.next(t._futureSnapshot.data));
}
function Vn(t, n) {
  let e = ne(t.params, n.params) && Uo(t.url, n.url),
    r = !t.parent != !n.parent;
  return e && !r && (!t.parent || Vn(t.parent, n.parent));
}
function ji(t) {
  return typeof t.title == 'string' || t.title === null;
}
var aa = new x$1(''),
  Hi = (() => {
    class t {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = g;
      activateEvents = new Le$1();
      deactivateEvents = new Le$1();
      attachEvents = new Le$1();
      detachEvents = new Le$1();
      routerOutletData = YO();
      parentContexts = E(ht);
      location = E(Xo$1);
      changeDetector = E(nL);
      inputBinder = E(Ft, { optional: true });
      supportsBindingToComponentInputs = true;
      ngOnChanges(e) {
        if (e.name) {
          let { firstChange: r, previousValue: i } = e.name;
          if (r) return;
          (this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName());
        }
      }
      ngOnDestroy() {
        (this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this));
      }
      isTrackedInParentContexts(e) {
        return this.parentContexts.getContext(e)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let e = this.parentContexts.getContext(this.name);
        e?.route &&
          (e.attachRef
            ? this.attach(e.attachRef, e.route)
            : this.activateWith(e.route, e.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new b$1(4012, false);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new b$1(4012, false);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new b$1(4012, false);
        this.location.detach();
        let e = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(e.instance),
          e
        );
      }
      attach(e, r) {
        ((this.activated = e),
          (this._activatedRoute = r),
          this.location.insert(e.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(e.instance));
      }
      deactivate() {
        if (this.activated) {
          let e = this.component;
          (this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(e));
        }
      }
      activateWith(e, r) {
        if (this.isActivated) throw new b$1(4013, false);
        this._activatedRoute = e;
        let i = this.location,
          a = e.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          s = new qn(e, c, i.injector, this.routerOutletData);
        ((this.activated = i.createComponent(a, {
          index: i.length,
          injector: s,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance));
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵdir = av({
        type: t,
        selectors: [['router-outlet']],
        inputs: { name: 'name', routerOutletData: [1, 'routerOutletData'] },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        features: [rg],
      });
    }
    return t;
  })(),
  qn = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(n, e, r, i) {
      ((this.route = n), (this.childContexts = e), (this.parent = r), (this.outletData = i));
    }
    get(n, e) {
      return n === Ee
        ? this.route
        : n === ht
          ? this.childContexts
          : n === aa
            ? this.outletData
            : this.parent.get(n, e);
    }
  },
  Ft = new x$1('');
var $i = (() => {
  class t {
    static ɵfac = function (r) {
      return new (r || t)();
    };
    static ɵcmp = nv({
      type: t,
      selectors: [['ng-component']],
      exportAs: ['emptyRouterOutlet'],
      decls: 1,
      vars: 0,
      template: function (r, i) {
        r & 1 && hf(0, 'router-outlet');
      },
      dependencies: [Hi],
      encapsulation: 2,
      changeDetection: 1,
    });
  }
  return t;
})();
function er(t) {
  let n = t.children && t.children.map(er),
    e = n ? B$1(H({}, t), { children: n }) : H({}, t);
  return (
    !e.component &&
      !e.loadComponent &&
      (n || e.loadChildren) &&
      e.outlet &&
      e.outlet !== g &&
      (e.component = $i),
    e
  );
}
function sa(t, n, e) {
  let r = new Set(),
    i = ct(t, n._root, e ? e._root : void 0, r);
  return { newlyCreatedRoutes: r, state: new Lt(i, n) };
}
function ct(t, n, e, r) {
  if (e && t.shouldReuseRoute(n.value, e.value.snapshot)) {
    let i = e.value;
    i._futureSnapshot = n.value;
    let o = ca(t, n, e, r);
    return new U(i, o);
  } else {
    if (t.shouldAttach(n.value)) {
      let a = t.retrieve(n.value);
      if (a !== null) {
        let c = a.route;
        return (
          (c.value._futureSnapshot = n.value),
          (c.children = n.children.map((s) => ct(t, s, void 0, r))),
          c
        );
      }
    }
    let i = la(n.value);
    r.add(i);
    let o = n.children.map((a) => ct(t, a, void 0, r));
    return new U(i, o);
  }
}
function ca(t, n, e, r) {
  return n.children.map((i) => {
    for (let o of e.children)
      if (t.shouldReuseRoute(i.value, o.value.snapshot)) return ct(t, i, o, r);
    return ct(t, i, void 0, r);
  });
}
function la(t) {
  return new Ee(
    new En$1(t.url),
    new En$1(t.params),
    new En$1(t.queryParams),
    new En$1(t.fragment),
    new En$1(t.data),
    t.outlet,
    t.component,
    t,
  );
}
var lt = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(n, e) {
      ((this.redirectTo = n), (this.navigationBehaviorOptions = e));
    }
  },
  zi = 'ngNavigationCancelingError';
function Ht(t, n) {
  let { redirectTo: e, navigationBehaviorOptions: r } = je(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    i = Fi(false, P.Redirect);
  return ((i.url = e), (i.navigationBehaviorOptions = r), i);
}
function Fi(t, n) {
  let e = new Error(`NavigationCancelingError: ${''}`);
  return ((e[zi] = true), (e.cancellationCode = n), e);
}
function ua(t) {
  return Bi(t) && je(t.url);
}
function Bi(t) {
  return !!t && t[zi];
}
var Gn = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(n, e, r, i, o) {
      ((this.routeReuseStrategy = n),
        (this.futureState = e),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o));
    }
    activate(n) {
      let e = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      (this.deactivateChildRoutes(e, r, n),
        Rn(this.futureState.root),
        this.activateChildRoutes(e, r, n));
    }
    deactivateChildRoutes(n, e, r) {
      let i = Ne(e);
      (n.children.forEach((o) => {
        let a = o.value.outlet;
        (this.deactivateRoutes(o, i[a], r), delete i[a]);
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, r);
        }));
    }
    deactivateRoutes(n, e, r) {
      let i = n.value,
        o = e ? e.value : null;
      if (i === o)
        if (i.component) {
          let a = r.getContext(i.outlet);
          a && this.deactivateChildRoutes(n, e, a.children);
        } else this.deactivateChildRoutes(n, e, r);
      else o && this.deactivateRouteAndItsChildren(e, r);
    }
    deactivateRouteAndItsChildren(n, e) {
      n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, e)
        : this.deactivateRouteAndOutlet(n, e);
    }
    detachAndStoreRouteSubtree(n, e) {
      let r = e.getContext(n.value.outlet),
        i = r && n.value.component ? r.children : e,
        o = Ne(n);
      for (let a of Object.values(o)) this.deactivateRouteAndItsChildren(a, i);
      if (r && r.outlet) {
        let a = r.outlet.detach(),
          c = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(n.value.snapshot, { componentRef: a, route: n, contexts: c });
      }
    }
    deactivateRouteAndOutlet(n, e) {
      let r = e.getContext(n.value.outlet),
        i = r && n.value.component ? r.children : e,
        o = Ne(n);
      for (let a of Object.values(o)) this.deactivateRouteAndItsChildren(a, i);
      (r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null)),
        n.value._localInjector?.destroy());
    }
    activateChildRoutes(n, e, r) {
      let i = Ne(e);
      (n.children.forEach((o) => {
        (this.activateRoutes(o, i[o.value.outlet], r), this.forwardEvent(new $n(o.value.snapshot)));
      }),
        n.children.length && this.forwardEvent(new jn(n.value.snapshot)));
    }
    activateRoutes(n, e, r) {
      let i = n.value,
        o = e ? e.value : null;
      if ((Rn(i), i === o))
        if (i.component) {
          let a = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(n, e, a.children);
        } else this.activateChildRoutes(n, e, r);
      else if (i.component) {
        let a = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let c = this.routeReuseStrategy.retrieve(i.snapshot);
          (this.routeReuseStrategy.store(i.snapshot, null),
            a.children.onOutletReAttached(c.contexts),
            (a.attachRef = c.componentRef),
            (a.route = c.route.value),
            a.outlet && a.outlet.attach(c.componentRef, c.route.value),
            Rn(c.route.value),
            this.activateChildRoutes(n, null, a.children));
        } else
          ((a.attachRef = null),
            (a.route = i),
            a.outlet && a.outlet.activateWith(i, a.injector),
            this.activateChildRoutes(n, null, a.children));
      } else this.activateChildRoutes(n, null, r);
    }
  },
  $t = class {
    path;
    route;
    constructor(n) {
      ((this.path = n), (this.route = this.path[this.path.length - 1]));
    }
  },
  Ue = class {
    component;
    route;
    constructor(n, e) {
      ((this.component = n), (this.route = e));
    }
  };
function da(t, n, e) {
  let r = t._root,
    i = n ? n._root : null;
  return tt(r, i, e, [r.value]);
}
function ha(t) {
  let n = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: t, guards: n };
}
function Ve(t, n) {
  let e = Symbol(),
    r = n.get(t, e);
  return r === e ? (typeof t == 'function' && !lh(t) ? t : n.get(t)) : r;
}
function tt(t, n, e, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = Ne(n);
  return (
    t.children.forEach((a) => {
      (pa(a, o[a.value.outlet], e, r.concat([a.value]), i), delete o[a.value.outlet]);
    }),
    Object.entries(o).forEach(([a, c]) => it(c, e.getContext(a), i)),
    i
  );
}
function pa(t, n, e, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = t.value,
    a = n ? n.value : null,
    c = e ? e.getContext(t.value.outlet) : null;
  if (a && o.routeConfig === a.routeConfig) {
    let s = fa(a, o, o.routeConfig.runGuardsAndResolvers);
    (s
      ? i.canActivateChecks.push(new $t(r))
      : ((o.data = a.data), (o._resolvedData = a._resolvedData)),
      o.component ? tt(t, n, c ? c.children : null, r, i) : tt(t, n, e, r, i),
      s &&
        c &&
        c.outlet &&
        c.outlet.isActivated &&
        i.canDeactivateChecks.push(new Ue(c.outlet.component, a)));
  } else
    (a && it(n, c, i),
      i.canActivateChecks.push(new $t(r)),
      o.component ? tt(t, null, c ? c.children : null, r, i) : tt(t, null, e, r, i));
  return i;
}
function fa(t, n, e) {
  if (typeof e == 'function') return Zr(n._environmentInjector, () => e(t, n));
  switch (e) {
    case 'pathParamsChange':
      return !we(t.url, n.url);
    case 'pathParamsOrQueryParamsChange':
      return !we(t.url, n.url) || !ne(t.queryParams, n.queryParams);
    case 'always':
      return true;
    case 'paramsOrQueryParamsChange':
      return !Vn(t, n) || !ne(t.queryParams, n.queryParams);
    default:
      return !Vn(t, n);
  }
}
function it(t, n, e) {
  let r = Ne(t),
    i = t.value;
  (Object.entries(r).forEach(([o, a]) => {
    i.component ? (n ? it(a, n.children.getContext(o), e) : it(a, null, e)) : it(a, n, e);
  }),
    i.component
      ? n && n.outlet && n.outlet.isActivated
        ? e.canDeactivateChecks.push(new Ue(n.outlet.component, i))
        : e.canDeactivateChecks.push(new Ue(null, i))
      : e.canDeactivateChecks.push(new Ue(null, i)));
}
function pt(t) {
  return typeof t == 'function';
}
function ga(t) {
  return typeof t == 'boolean';
}
function ma(t) {
  return t && pt(t.canLoad);
}
function va(t) {
  return t && pt(t.canActivate);
}
function ya(t) {
  return t && pt(t.canActivateChild);
}
function _a(t) {
  return t && pt(t.canDeactivate);
}
function Ca(t) {
  return t && pt(t.canMatch);
}
function Vi(t) {
  return t instanceof wn$1 || t?.name === 'EmptyError';
}
var Mt = Symbol('INITIAL_VALUE');
function Be() {
  return Kc((t) =>
    Hp(t.map((n) => n.pipe(dt$2(1), Yc(Mt)))).pipe(
      De$1((n) => {
        for (let e of n)
          if (e !== true) {
            if (e === Mt) return Mt;
            if (e === false || ba(e)) return e;
          }
        return true;
      }),
      Or((n) => n !== Mt),
      dt$2(1),
    ),
  );
}
function ba(t) {
  return je(t) || t instanceof lt;
}
function qi(t) {
  return t.aborted
    ? xp(void 0).pipe(dt$2(1))
    : new M((n) => {
        let e = () => {
          (n.next(), n.complete());
        };
        return (t.addEventListener('abort', e), () => t.removeEventListener('abort', e));
      });
}
function Gi(t) {
  return Jc(qi(t));
}
function Sa(t) {
  return ne$1((n) => {
    let {
      targetSnapshot: e,
      currentSnapshot: r,
      guards: { canActivateChecks: i, canDeactivateChecks: o },
    } = n;
    return o.length === 0 && i.length === 0
      ? xp(B$1(H({}, n), { guardsResult: true }))
      : wa(o, e, r).pipe(
          ne$1((a) => (a && ga(a) ? Ra(e, i, t) : xp(a))),
          De$1((a) => B$1(H({}, n), { guardsResult: a })),
        );
  });
}
function wa(t, n, e) {
  return Ie(t).pipe(
    ne$1((r) => Ia(r.component, r.route, e, n)),
    eh((r) => r !== true, true),
  );
}
function Ra(t, n, e) {
  return Ie(n).pipe(
    Yp((r) => zt$2(Ta(r.route.parent, e), Ea(r.route, e), xa(t, r.path), Ma(t, r.route))),
    eh((r) => r !== true, true),
  );
}
function Ea(t, n) {
  return (t !== null && n && n(new Hn(t)), xp(true));
}
function Ta(t, n) {
  return (t !== null && n && n(new Ln(t)), xp(true));
}
function Ma(t, n) {
  let e = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!e || e.length === 0) return xp(true);
  let r = e.map((i) =>
    $p(() => {
      let o = n._environmentInjector,
        a = Ve(i, o),
        c = va(a) ? a.canActivate(n, t) : Zr(o, () => a(n, t));
      return Te(c).pipe(eh());
    }),
  );
  return xp(r).pipe(Be());
}
function xa(t, n) {
  let e = n[n.length - 1],
    i = n
      .slice(0, n.length - 1)
      .reverse()
      .map((o) => ha(o))
      .filter((o) => o !== null)
      .map((o) =>
        $p(() => {
          let a = o.guards.map((c) => {
            let s = o.node._environmentInjector,
              l = Ve(c, s),
              u = ya(l) ? l.canActivateChild(e, t) : Zr(s, () => l(e, t));
            return Te(u).pipe(eh());
          });
          return xp(a).pipe(Be());
        }),
      );
  return xp(i).pipe(Be());
}
function Ia(t, n, e, r) {
  let i = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return xp(true);
  let o = i.map((a) => {
    let c = n._environmentInjector,
      s = Ve(a, c),
      l = _a(s) ? s.canDeactivate(t, n, e, r) : Zr(c, () => s(t, n, e, r));
    return Te(l).pipe(eh());
  });
  return xp(o).pipe(Be());
}
function Aa(t, n, e, r, i) {
  let o = n.canLoad;
  if (o === void 0 || o.length === 0) return xp(true);
  let a = o.map((c) => {
    let s = Ve(c, t),
      l = ma(s) ? s.canLoad(n, e) : Zr(t, () => s(n, e)),
      u = Te(l);
    return i ? u.pipe(Gi(i)) : u;
  });
  return xp(a).pipe(Be(), Wi(r));
}
function Wi(t) {
  return Ep(
    Xc((n) => {
      if (typeof n != 'boolean') throw Ht(t, n);
    }),
    De$1((n) => n === true),
  );
}
function Da(t, n, e, r, i, o) {
  let a = n.canMatch;
  if (!a || a.length === 0) return xp(true);
  let c = a.map((s) => {
    let l = Ve(s, t),
      u = Ca(l) ? l.canMatch(n, e, i) : Zr(t, () => l(n, e, i));
    return Te(u).pipe(Gi(o));
  });
  return xp(c).pipe(Be(), Wi(r));
}
var se = class t extends Error {
    segmentGroup;
    constructor(n) {
      (super(), (this.segmentGroup = n || null), Object.setPrototypeOf(this, t.prototype));
    }
  },
  ut = class t extends Error {
    urlTree;
    constructor(n) {
      (super(), (this.urlTree = n), Object.setPrototypeOf(this, t.prototype));
    }
  };
function Pa(t) {
  throw new b$1(4e3, false);
}
function Oa(t) {
  throw Fi(false, P.GuardRejected);
}
var Wn = class {
  urlSerializer;
  urlTree;
  constructor(n, e) {
    ((this.urlSerializer = n), (this.urlTree = e));
  }
  lineralizeSegments(n, e) {
    return oi$1(this, null, function* () {
      let r = [],
        i = e.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return r;
        if (i.numberOfChildren > 1 || !i.children[g]) throw Pa(`${n.redirectTo}`);
        i = i.children[g];
      }
    });
  }
  applyRedirectCommands(n, e, r, i, o) {
    return oi$1(this, null, function* () {
      let a = yield Na(e, i, o);
      if (a instanceof X) throw new ut(a);
      let c = this.applyRedirectCreateUrlTree(a, this.urlSerializer.parse(a), n, r);
      if (a[0] === '/') throw new ut(c);
      return c;
    });
  }
  applyRedirectCreateUrlTree(n, e, r, i) {
    let o = this.createSegmentGroup(n, e.root, r, i);
    return new X(o, this.createQueryParams(e.queryParams, this.urlTree.queryParams), e.fragment);
  }
  createQueryParams(n, e) {
    let r = {};
    return (
      Object.entries(n).forEach(([i, o]) => {
        if (typeof o == 'string' && o[0] === ':') {
          let c = o.substring(1);
          r[i] = e[c];
        } else r[i] = o;
      }),
      r
    );
  }
  createSegmentGroup(n, e, r, i) {
    let o = this.createSegments(n, e.segments, r, i),
      a = {};
    return (
      Object.entries(e.children).forEach(([c, s]) => {
        a[c] = this.createSegmentGroup(n, s, r, i);
      }),
      new b(o, a)
    );
  }
  createSegments(n, e, r, i) {
    return e.map((o) => (o.path[0] === ':' ? this.findPosParam(n, o, i) : this.findOrReturn(o, r)));
  }
  findPosParam(n, e, r) {
    let i = r[e.path.substring(1)];
    if (!i) throw new b$1(4001, false);
    return i;
  }
  findOrReturn(n, e) {
    let r = 0;
    for (let i of e) {
      if (i.path === n.path) return (e.splice(r), i);
      r++;
    }
    return n;
  }
};
function Na(t, n, e) {
  if (typeof t == 'string') return Promise.resolve(t);
  let r = t;
  return Dt(Te(Zr(e, () => r(n))));
}
function ka(t, n) {
  return (
    t.providers && !t._injector && (t._injector = nf(t.providers, n, `Route: ${t.path}`)),
    t._injector ?? n
  );
}
function J(t) {
  return t.outlet || g;
}
function Ua(t, n) {
  let e = t.filter((r) => J(r) === n);
  return (e.push(...t.filter((r) => J(r) !== n)), e);
}
var Kn = {
  matched: false,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function Ki(t) {
  return {
    routeConfig: t.routeConfig,
    url: t.url,
    params: t.params,
    queryParams: t.queryParams,
    fragment: t.fragment,
    data: t.data,
    outlet: t.outlet,
    title: t.title,
    paramMap: t.paramMap,
    queryParamMap: t.queryParamMap,
  };
}
function La(t, n, e, r, i, o, a) {
  let c = Yi(t, n, e);
  if (!c.matched) return xp(c);
  let s = Ki(o(c));
  return ((r = ka(n, r)), Da(r, n, e, i, s, a).pipe(De$1((l) => (l === true ? c : H({}, Kn)))));
}
function Yi(t, n, e) {
  if (n.path === '')
    return n.pathMatch === 'full' && (t.hasChildren() || e.length > 0)
      ? H({}, Kn)
      : {
          matched: true,
          consumedSegments: [],
          remainingSegments: e,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (n.matcher || Ao)(e, t, n);
  if (!i) return H({}, Kn);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([c, s]) => {
    o[c] = s.path;
  });
  let a = i.consumed.length > 0 ? H(H({}, o), i.consumed[i.consumed.length - 1].parameters) : o;
  return {
    matched: true,
    consumedSegments: i.consumed,
    remainingSegments: e.slice(i.consumed.length),
    parameters: a,
    positionalParamSegments: i.posParams ?? {},
  };
}
function vi(t, n, e, r, i) {
  return e.length > 0 && $a(t, e, r, i)
    ? { segmentGroup: new b(n, Ha(r, new b(e, t.children))), slicedSegments: [] }
    : e.length === 0 && za(t, e, r)
      ? { segmentGroup: new b(t.segments, ja(t, e, r, t.children)), slicedSegments: e }
      : { segmentGroup: new b(t.segments, t.children), slicedSegments: e };
}
function ja(t, n, e, r) {
  let i = {};
  for (let o of e)
    if (Bt(t, n, o) && !r[J(o)]) {
      let a = new b([], {});
      i[J(o)] = a;
    }
  return H(H({}, r), i);
}
function Ha(t, n) {
  let e = {};
  e[g] = n;
  for (let r of t)
    if (r.path === '' && J(r) !== g) {
      let i = new b([], {});
      e[J(r)] = i;
    }
  return e;
}
function $a(t, n, e, r) {
  return e.some((i) => (!Bt(t, n, i) || !(J(i) !== g) ? false : !(r !== void 0 && J(i) === r)));
}
function za(t, n, e) {
  return e.some((r) => Bt(t, n, r));
}
function Bt(t, n, e) {
  return (t.hasChildren() || n.length > 0) && e.pathMatch === 'full' ? false : e.path === '';
}
function Fa(t, n, e) {
  return n.length === 0 && !t.children[e];
}
var Yn = class {};
function Ba(t, n, e, r, i, o, a, c) {
  return oi$1(this, null, function* () {
    return new Qn(t, n, e, r, i, a, o, c).recognize();
  });
}
var Va = 31,
  Qn = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    abortSignal;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = true;
    constructor(n, e, r, i, o, a, c, s) {
      ((this.injector = n),
        (this.configLoader = e),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = a),
        (this.urlSerializer = c),
        (this.abortSignal = s),
        (this.applyRedirects = new Wn(this.urlSerializer, this.urlTree)));
    }
    noMatchError(n) {
      return new b$1(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      return oi$1(this, null, function* () {
        let n = vi(this.urlTree.root, [], [], this.config).segmentGroup,
          { children: e, rootSnapshot: r } = yield this.match(n),
          i = new U(r, e),
          o = new jt('', i),
          a = Qo(r, [], this.urlTree.queryParams, this.urlTree.fragment);
        return (
          (a.queryParams = this.urlTree.queryParams),
          (o.url = this.urlSerializer.serialize(a)),
          { state: o, tree: a }
        );
      });
    }
    match(n) {
      return oi$1(this, null, function* () {
        let e = new st(
          [],
          Object.freeze({}),
          Object.freeze(H({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Object.freeze({}),
          g,
          this.rootComponentType,
          null,
          {},
          this.injector,
        );
        try {
          return {
            children: yield this.processSegmentGroup(this.injector, this.config, n, g, e),
            rootSnapshot: e,
          };
        } catch (r) {
          if (r instanceof ut) return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
          throw r instanceof se ? this.noMatchError(r) : r;
        }
      });
    }
    processSegmentGroup(n, e, r, i, o) {
      return oi$1(this, null, function* () {
        if (r.segments.length === 0 && r.hasChildren()) return this.processChildren(n, e, r, o);
        let a = yield this.processSegment(n, e, r, r.segments, i, true, o);
        return a instanceof U ? [a] : [];
      });
    }
    processChildren(n, e, r, i) {
      return oi$1(this, null, function* () {
        let o = [];
        for (let s of Object.keys(r.children)) s === 'primary' ? o.unshift(s) : o.push(s);
        let a = [];
        for (let s of o) {
          let l = r.children[s],
            u = Ua(e, s),
            f = yield this.processSegmentGroup(n, u, l, s, i);
          a.push(...f);
        }
        let c = Qi(a);
        return (qa(c), c);
      });
    }
    processSegment(n, e, r, i, o, a, c) {
      return oi$1(this, null, function* () {
        for (let s of e)
          try {
            return yield this.processSegmentAgainstRoute(s._injector ?? n, e, s, r, i, o, a, c);
          } catch (l) {
            if (l instanceof se || Vi(l)) continue;
            throw l;
          }
        if (Fa(r, i, o)) return new Yn();
        throw new se(r);
      });
    }
    processSegmentAgainstRoute(n, e, r, i, o, a, c, s) {
      return oi$1(this, null, function* () {
        if (J(r) !== a && (a === g || !Bt(i, o, r))) throw new se(i);
        if (r.redirectTo === void 0) return this.matchSegmentAgainstRoute(n, i, r, o, a, s);
        if (this.allowRedirects && c)
          return this.expandSegmentAgainstRouteUsingRedirect(n, i, e, r, o, a, s);
        throw new se(i);
      });
    }
    expandSegmentAgainstRouteUsingRedirect(n, e, r, i, o, a, c) {
      return oi$1(this, null, function* () {
        let {
          matched: s,
          parameters: l,
          consumedSegments: u,
          positionalParamSegments: f,
          remainingSegments: h,
        } = Yi(e, i, o);
        if (!s) throw new se(e);
        typeof i.redirectTo == 'string' &&
          i.redirectTo[0] === '/' &&
          (this.absoluteRedirectCount++,
          this.absoluteRedirectCount > Va && (this.allowRedirects = false));
        let O = this.createSnapshot(n, i, o, l, c);
        if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
        let V = yield this.applyRedirects.applyRedirectCommands(u, i.redirectTo, f, Ki(O), n),
          me = yield this.applyRedirects.lineralizeSegments(i, V);
        return this.processSegment(n, r, e, me.concat(h), a, false, c);
      });
    }
    createSnapshot(n, e, r, i, o) {
      let a = new st(
          r,
          i,
          Object.freeze(H({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Wa(e),
          J(e),
          e.component ?? e._loadedComponent ?? null,
          e,
          Ka(e),
          n,
        ),
        c = Jn(a, o, this.paramsInheritanceStrategy);
      return ((a.params = Object.freeze(c.params)), (a.data = Object.freeze(c.data)), a);
    }
    matchSegmentAgainstRoute(n, e, r, i, o, a) {
      return oi$1(this, null, function* () {
        if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
        let c = (ve) => this.createSnapshot(n, r, ve.consumedSegments, ve.parameters, a),
          s = yield Dt(La(e, r, i, n, this.urlSerializer, c, this.abortSignal));
        if ((r.path === '**' && (e.children = {}), !s?.matched)) throw new se(e);
        n = r._injector ?? n;
        let { routes: l } = yield this.getChildConfig(n, r, i),
          u = r._loadedInjector ?? n,
          { parameters: f, consumedSegments: h, remainingSegments: O } = s,
          V = this.createSnapshot(n, r, h, f, a),
          { segmentGroup: me, slicedSegments: qe } = vi(e, h, O, l, o);
        if (qe.length === 0 && me.hasChildren()) {
          let ve = yield this.processChildren(u, l, me, V);
          return new U(V, ve);
        }
        if (l.length === 0 && qe.length === 0) return new U(V, []);
        let Yt = J(r) === o,
          ft = yield this.processSegment(u, l, me, qe, Yt ? g : o, true, V);
        return new U(V, ft instanceof U ? [ft] : []);
      });
    }
    getChildConfig(n, e, r) {
      return oi$1(this, null, function* () {
        if (e.children) return { routes: e.children, injector: n };
        if (e.loadChildren) {
          if (e._loadedRoutes !== void 0) {
            let o = e._loadedNgModuleFactory;
            return (
              o && !e._loadedInjector && (e._loadedInjector = o.create(n).injector),
              { routes: e._loadedRoutes, injector: e._loadedInjector }
            );
          }
          if (this.abortSignal.aborted) throw new Error(this.abortSignal.reason);
          if (yield Dt(Aa(n, e, r, this.urlSerializer, this.abortSignal))) {
            let o = yield this.configLoader.loadChildren(n, e);
            return (
              (e._loadedRoutes = o.routes),
              (e._loadedInjector = o.injector),
              (e._loadedNgModuleFactory = o.factory),
              o
            );
          }
          throw Oa();
        }
        return { routes: [], injector: n };
      });
    }
  };
function qa(t) {
  t.sort((n, e) =>
    n.value.outlet === g
      ? -1
      : e.value.outlet === g
        ? 1
        : n.value.outlet.localeCompare(e.value.outlet),
  );
}
function Ga(t) {
  let n = t.value.routeConfig;
  return n && n.path === '';
}
function Qi(t) {
  let n = [],
    e = new Set();
  for (let r of t) {
    if (!Ga(r)) {
      n.push(r);
      continue;
    }
    let i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), e.add(i)) : n.push(r);
  }
  for (let r of e) {
    let i = Qi(r.children);
    n.push(new U(r.value, i));
  }
  return n.filter((r) => !e.has(r));
}
function Wa(t) {
  return t.data || {};
}
function Ka(t) {
  return t.resolve || {};
}
function Ya(t, n, e, r, i, o, a) {
  return ne$1((c) =>
    oi$1(null, null, function* () {
      let { state: s, tree: l } = yield Ba(t, n, e, r, c.extractedUrl, i, o, a);
      return B$1(H({}, c), { targetSnapshot: s, urlAfterRedirects: l });
    }),
  );
}
function Qa(t) {
  return ne$1((n) => {
    let {
      targetSnapshot: e,
      guards: { canActivateChecks: r },
    } = n;
    if (!r.length) return xp(n);
    let i = new Set(r.map((c) => c.route)),
      o = new Set();
    for (let c of i) if (!o.has(c)) for (let s of Zi(c)) o.add(s);
    let a = 0;
    return Ie(o).pipe(
      Yp((c) => (i.has(c) ? Za(c, e, t) : ((c.data = Jn(c, c.parent, t).resolve), xp(void 0)))),
      Xc(() => a++),
      th(1),
      ne$1((c) => (a === o.size ? xp(n) : Oe)),
    );
  });
}
function Zi(t) {
  let n = t.children.map((e) => Zi(e)).flat();
  return [t, ...n];
}
function Za(t, n, e) {
  let r = t.routeConfig,
    i = t._resolve;
  return (
    r?.title !== void 0 && !ji(r) && (i[dt] = r.title),
    $p(
      () => (
        (t.data = Jn(t, t.parent, e).resolve),
        Ja(i, t, n).pipe(De$1((o) => ((t._resolvedData = o), (t.data = H(H({}, t.data), o)), null)))
      ),
    )
  );
}
function Ja(t, n, e) {
  let r = Tn(t);
  if (r.length === 0) return xp({});
  let i = {};
  return Ie(r).pipe(
    ne$1((o) =>
      Xa(t[o], n, e).pipe(
        eh(),
        Xc((a) => {
          if (a instanceof lt) throw Ht(new Re(), a);
          i[o] = a;
        }),
      ),
    ),
    th(1),
    De$1(() => i),
    qc((o) => (Vi(o) ? Oe : Ap(o))),
  );
}
function Xa(t, n, e) {
  let r = n._environmentInjector,
    i = Ve(t, r),
    o = i.resolve ? i.resolve(n, e) : Zr(r, () => i(n, e));
  return Te(o);
}
function yi(t) {
  return Kc((n) => {
    let e = t(n);
    return e ? Ie(e).pipe(De$1(() => n)) : xp(n);
  });
}
var Ji = (() => {
    class t {
      buildTitle(e) {
        let r,
          i = e.root;
        for (; i !== void 0; )
          ((r = this.getResolvedTitleForRoute(i) ?? r),
            (i = i.children.find((o) => o.outlet === g)));
        return r;
      }
      getResolvedTitleForRoute(e) {
        return e.data[dt];
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: () => E(es) });
    }
    return t;
  })(),
  es = (() => {
    class t extends Ji {
      title;
      constructor(e) {
        (super(), (this.title = e));
      }
      updateTitle(e) {
        let r = this.buildTitle(e);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || t)(we$1(di));
      };
      static ɵprov = oe({ token: t, factory: t.ɵfac, providedIn: 'root' });
    }
    return t;
  })(),
  Vt = new x$1('', { factory: () => ({}) }),
  qt = new x$1(''),
  Xi = (() => {
    class t {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = E(DE);
      loadComponent(e, r) {
        return oi$1(this, null, function* () {
          if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
          if (r._loadedComponent) return Promise.resolve(r._loadedComponent);
          this.onLoadStartListener && this.onLoadStartListener(r);
          let i = oi$1(this, null, function* () {
            try {
              let o = yield bi(Zr(e, () => r.loadComponent())),
                a = yield eo(QO(o));
              return (
                this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = a),
                a
              );
            } finally {
              this.componentLoaders.delete(r);
            }
          });
          return (this.componentLoaders.set(r, i), i);
        });
      }
      loadChildren(e, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return Promise.resolve({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = oi$1(this, null, function* () {
          try {
            let o = yield ts(r, this.compiler, e, this.onLoadEndListener);
            return (
              (r._loadedRoutes = o.routes),
              (r._loadedInjector = o.injector),
              (r._loadedNgModuleFactory = o.factory),
              o
            );
          } finally {
            this.childrenLoaders.delete(r);
          }
        });
        return (this.childrenLoaders.set(r, i), i);
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function ts(t, n, e, r) {
  return oi$1(this, null, function* () {
    let i = yield bi(Zr(e, () => t.loadChildren())),
      o = yield eo(QO(i)),
      a;
    (o instanceof tf || Array.isArray(o) ? (a = o) : (a = yield n.compileModuleAsync(o)),
      r && r(t));
    let c, s, u;
    return (
      Array.isArray(a)
        ? ((s = a), true)
        : ((c = a.create(e).injector),
          (u = a),
          (s = c.get(qt, [], { optional: true, self: true }).flat())),
      { routes: s.map(er), injector: c, factory: u }
    );
  });
}
function eo(t) {
  return oi$1(this, null, function* () {
    return t;
  });
}
var tr = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: () => E(ns) });
    }
    return t;
  })(),
  ns = (() => {
    class t {
      shouldProcessUrl(e) {
        return true;
      }
      extract(e) {
        return e;
      }
      merge(e, r) {
        return e;
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  to = new x$1('');
var no = new x$1(''),
  rs = () => {},
  ro = new x$1(''),
  io = (() => {
    class t {
      currentNavigation = lo(null, { equal: () => false });
      currentTransition = null;
      lastSuccessfulNavigation = lo(null);
      events = new ke$1();
      transitionAbortWithErrorSubject = new ke$1();
      configLoader = E(Xi);
      environmentInjector = E(re);
      destroyRef = E(Be$2);
      urlSerializer = E(zt);
      rootContexts = E(ht);
      location = E(Ln$1);
      inputBindingEnabled = E(Ft, { optional: true }) !== null;
      titleStrategy = E(Ji);
      options = E(Vt, { optional: true }) || {};
      paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || oa;
      urlHandlingStrategy = E(tr);
      createViewTransition = E(to, { optional: true });
      navigationErrorHandler = E(ro, { optional: true });
      activatedRouteInjectorFeature = E(no, { optional: true });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => xp(void 0);
      rootComponentType = null;
      destroyed = false;
      constructor() {
        let e = (i) => this.events.next(new kn(i)),
          r = (i) => this.events.next(new Un(i));
        ((this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = e),
          this.destroyRef.onDestroy(() => {
            this.destroyed = true;
          }));
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(e) {
        let r = ++this.navigationId;
        bE(() => {
          this.transitions?.next(
            B$1(H({}, e), {
              extractedUrl: this.urlHandlingStrategy.extract(e.rawUrl),
              targetSnapshot: null,
              targetRouterState: null,
              guards: { canActivateChecks: [], canDeactivateChecks: [] },
              guardsResult: null,
              id: r,
              routesRecognizeHandler: {},
              beforeActivateHandler: {},
            }),
          );
        });
      }
      setupNavigations(e) {
        return (
          (this.transitions = new En$1(null)),
          this.transitions.pipe(
            Or((r) => r !== null),
            Kc((r) => {
              let i = true,
                o = false,
                a = new AbortController(),
                c = () => !o && this.currentTransition?.id === r.id;
              return xp(r).pipe(
                Kc((s) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(r, '', P.SupersededByNewNavigation),
                      Oe
                    );
                  this.currentTransition = r;
                  let l = this.lastSuccessfulNavigation();
                  this.currentNavigation.set({
                    id: s.id,
                    initialUrl: s.rawUrl,
                    extractedUrl: s.extractedUrl,
                    targetBrowserUrl:
                      typeof s.extras.browserUrl == 'string'
                        ? this.urlSerializer.parse(s.extras.browserUrl)
                        : s.extras.browserUrl,
                    trigger: s.source,
                    extras: s.extras,
                    previousNavigation: l ? B$1(H({}, l), { previousNavigation: null }) : null,
                    abort: () => a.abort(),
                    routesRecognizeHandler: s.routesRecognizeHandler,
                    beforeActivateHandler: s.beforeActivateHandler,
                  });
                  let u =
                      !e.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                    f = s.extras.onSameUrlNavigation ?? e.onSameUrlNavigation;
                  if (!u && f !== 'reload')
                    return (
                      this.events.next(
                        new ge(
                          s.id,
                          this.urlSerializer.serialize(s.rawUrl),
                          '',
                          Nt.IgnoredSameUrlNavigation,
                        ),
                      ),
                      s.resolve(false),
                      Oe
                    );
                  if (this.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                    return xp(s).pipe(
                      Kc(
                        (h) => (
                          this.events.next(
                            new He(
                              h.id,
                              this.urlSerializer.serialize(h.extractedUrl),
                              h.source,
                              h.restoredState,
                            ),
                          ),
                          h.id !== this.navigationId ? Oe : Promise.resolve(h)
                        ),
                      ),
                      Ya(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        e.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                        a.signal,
                      ),
                      Xc((h) => {
                        ((r.targetSnapshot = h.targetSnapshot),
                          (r.urlAfterRedirects = h.urlAfterRedirects),
                          this.currentNavigation.update(
                            (O) => ((O.finalUrl = h.urlAfterRedirects), O),
                          ),
                          this.events.next(new at()));
                      }),
                      Kc((h) =>
                        Ie(r.routesRecognizeHandler.deferredHandle ?? xp(void 0)).pipe(
                          De$1(() => h),
                        ),
                      ),
                      Xc(() => {
                        let h = new kt(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(h);
                      }),
                    );
                  if (u && this.urlHandlingStrategy.shouldProcessUrl(s.currentRawUrl)) {
                    let { id: h, extractedUrl: O, source: V, restoredState: me, extras: qe } = s,
                      Yt = new He(h, this.urlSerializer.serialize(O), V, me);
                    this.events.next(Yt);
                    let ft = Ui(this.rootComponentType, this.environmentInjector).snapshot;
                    return (
                      (this.currentTransition = r =
                        B$1(H({}, s), {
                          targetSnapshot: ft,
                          urlAfterRedirects: O,
                          extras: B$1(H({}, qe), { skipLocationChange: false, replaceUrl: false }),
                        })),
                      this.currentNavigation.update((ve) => ((ve.finalUrl = O), ve)),
                      xp(r)
                    );
                  } else
                    return (
                      this.events.next(
                        new ge(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          '',
                          Nt.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      s.resolve(false),
                      Oe
                    );
                }),
                De$1((s) => {
                  let l = new Dn(
                    s.id,
                    this.urlSerializer.serialize(s.extractedUrl),
                    this.urlSerializer.serialize(s.urlAfterRedirects),
                    s.targetSnapshot,
                  );
                  return (
                    this.events.next(l),
                    (this.currentTransition = r =
                      B$1(H({}, s), {
                        guards: da(s.targetSnapshot, s.currentSnapshot, this.rootContexts),
                      })),
                    r
                  );
                }),
                Sa((s) => this.events.next(s)),
                Kc((s) => {
                  if (
                    ((r.guardsResult = s.guardsResult),
                    s.guardsResult && typeof s.guardsResult != 'boolean')
                  )
                    throw Ht(this.urlSerializer, s.guardsResult);
                  let l = new Pn(
                    s.id,
                    this.urlSerializer.serialize(s.extractedUrl),
                    this.urlSerializer.serialize(s.urlAfterRedirects),
                    s.targetSnapshot,
                    !!s.guardsResult,
                  );
                  if ((this.events.next(l), !c())) return Oe;
                  if (!s.guardsResult)
                    return (this.cancelNavigationTransition(s, '', P.GuardRejected), Oe);
                  if (s.guards.canActivateChecks.length === 0) return xp(s);
                  let u = new On(
                    s.id,
                    this.urlSerializer.serialize(s.extractedUrl),
                    this.urlSerializer.serialize(s.urlAfterRedirects),
                    s.targetSnapshot,
                  );
                  if ((this.events.next(u), !c())) return Oe;
                  let f = false;
                  return xp(s).pipe(
                    Qa(this.paramsInheritanceStrategy),
                    Xc({
                      next: () => {
                        f = true;
                        let h = new Nn(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot,
                        );
                        this.events.next(h);
                      },
                      complete: () => {
                        f || this.cancelNavigationTransition(s, '', P.NoDataFromResolver);
                      },
                    }),
                  );
                }),
                yi((s) => {
                  let l = (f) => {
                      let h = [];
                      if (f.routeConfig?._loadedComponent)
                        f.component = f.routeConfig?._loadedComponent;
                      else if (f.routeConfig?.loadComponent) {
                        let O = f._environmentInjector;
                        h.push(
                          this.configLoader.loadComponent(O, f.routeConfig).then((V) => {
                            f.component = V;
                          }),
                        );
                      }
                      for (let O of f.children) h.push(...l(O));
                      return h;
                    },
                    u = l(s.targetSnapshot.root);
                  return u.length === 0 ? xp(s) : Ie(Promise.all(u).then(() => s));
                }),
                Kc((s) => {
                  let { newlyCreatedRoutes: l, state: u } = sa(
                    e.routeReuseStrategy,
                    s.targetSnapshot,
                    s.currentRouterState,
                  );
                  return (
                    (this.currentTransition =
                      r =
                      s =
                        B$1(H({}, s), { targetRouterState: u, newlyCreatedRoutes: l })),
                    this.currentNavigation.update((f) => ((f.targetRouterState = u), f)),
                    xp(s)
                  );
                }),
                this.activatedRouteInjectorFeature?.operator() ?? ((s) => s),
                yi(() => this.afterPreactivation()),
                Kc(() => {
                  let { currentSnapshot: s, targetSnapshot: l } = r,
                    u = this.createViewTransition?.(this.environmentInjector, s.root, l.root);
                  return u ? Ie(u).pipe(De$1(() => r)) : xp(r);
                }),
                dt$2(1),
                Kc((s) => {
                  ((i = false), this.events.next(new ze()));
                  let l = r.beforeActivateHandler.deferredHandle;
                  return l ? Ie(l.then(() => s)) : xp(s);
                }),
                Xc((s) => {
                  (new Gn(
                    e.routeReuseStrategy,
                    r.targetRouterState,
                    r.currentRouterState,
                    (l) => this.events.next(l),
                    this.inputBindingEnabled,
                  ).activate(this.rootContexts),
                    s.newlyCreatedRoutes?.clear(),
                    c() &&
                      ((o = true),
                      this.currentNavigation.update((l) => ((l.abort = rs), l)),
                      this.lastSuccessfulNavigation.set(bE(this.currentNavigation)),
                      this.events.next(
                        new fe(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(s.targetRouterState.snapshot),
                      s.resolve(true)));
                }),
                Jc(
                  qi(a.signal).pipe(
                    Or(() => !o && i),
                    Xc(() => {
                      this.cancelNavigationTransition(r, a.signal.reason + '', P.Aborted);
                    }),
                  ),
                ),
                Xc({
                  complete: () => {
                    o = true;
                  },
                }),
                Jc(
                  this.transitionAbortWithErrorSubject.pipe(
                    Xc((s) => {
                      throw s;
                    }),
                  ),
                ),
                Xp(() => {
                  (a.abort(),
                    o || this.cancelNavigationTransition(r, '', P.SupersededByNewNavigation),
                    this.currentTransition?.id === r.id &&
                      (this.currentNavigation.set(null), (this.currentTransition = null)));
                }),
                qc((s) => {
                  if (((o = true), _i(r), this.destroyed)) return (r.resolve(false), Oe);
                  if (Bi(s))
                    (this.events.next(
                      new Z(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        s.message,
                        s.cancellationCode,
                      ),
                    ),
                      ua(s)
                        ? this.events.next(new Fe(s.url, s.navigationBehaviorOptions))
                        : r.resolve(false));
                  else {
                    let l = new $e(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      s,
                      r.targetSnapshot ?? void 0,
                    );
                    try {
                      let u = Zr(this.environmentInjector, () => this.navigationErrorHandler?.(l));
                      if (u instanceof lt) {
                        let { message: f, cancellationCode: h } = Ht(this.urlSerializer, u);
                        (this.events.next(
                          new Z(r.id, this.urlSerializer.serialize(r.extractedUrl), f, h),
                        ),
                          this.events.next(new Fe(u.redirectTo, u.navigationBehaviorOptions)));
                      } else throw (this.events.next(l), s);
                    } catch (u) {
                      this.options.resolveNavigationPromiseOnError ? r.resolve(false) : r.reject(u);
                    }
                  }
                  return Oe;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(e, r, i) {
        _i(e);
        let o = new Z(e.id, this.urlSerializer.serialize(e.extractedUrl), r, i);
        (this.events.next(o), e.resolve(false));
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let e = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(true)),
          ),
          r = bE(this.currentNavigation),
          i = r?.targetBrowserUrl ?? r?.extractedUrl;
        return e.toString() !== i?.toString() && !r?.extras.skipLocationChange;
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function is(t) {
  return t !== rt;
}
function _i(t) {
  if (t.newlyCreatedRoutes) for (let n of t.newlyCreatedRoutes) n._localInjector?.destroy();
}
var oo = new x$1('');
var os = (() => {
    class t {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: () => E(as) });
    }
    return t;
  })(),
  Zn = class {
    shouldDetach(n) {
      return false;
    }
    store(n, e) {}
    shouldAttach(n) {
      return false;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, e) {
      return n.routeConfig === e.routeConfig;
    }
    shouldDestroyInjector(n) {
      return true;
    }
  },
  as = (() => {
    class t extends Zn {
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
    }
    return t;
  })(),
  nr = (() => {
    class t {
      urlSerializer = E(zt);
      options = E(Vt, { optional: true }) || {};
      canceledNavigationResolution = this.options.canceledNavigationResolution || 'replace';
      location = E(Ln$1);
      urlHandlingStrategy = E(tr);
      urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
      currentUrlTree = new X();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: e, initialUrl: r, targetBrowserUrl: i }) {
        let o = e !== void 0 ? this.urlHandlingStrategy.merge(e, r) : r,
          a = i ?? o;
        return a instanceof X ? this.urlSerializer.serialize(a) : a;
      }
      routerUrlState(e) {
        return e?.targetBrowserUrl === void 0 || e?.finalUrl === void 0
          ? {}
          : { ɵrouterUrl: this.urlSerializer.serialize(e.finalUrl) };
      }
      commitTransition({ targetRouterState: e, finalUrl: r, initialUrl: i }) {
        r && e
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, i)),
            (this.routerState = e))
          : (this.rawUrlTree = i);
      }
      routerState = Ui(null, E(re));
      getRouterState() {
        return this.routerState;
      }
      _stateMemento = this.createStateMemento();
      get stateMemento() {
        return this._stateMemento;
      }
      updateStateMemento() {
        this._stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      restoredState() {
        return this.location.getState();
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: () => E(ss) });
    }
    return t;
  })(),
  ss = (() => {
    class t extends nr {
      currentPageId = 0;
      lastSuccessfulId = -1;
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      registerNonRouterCurrentEntryChangeListener(e) {
        return this.location.subscribe((r) => {
          r.type === 'popstate' &&
            setTimeout(() => {
              e(r.url, r.state, 'popstate', { replaceUrl: true });
            });
        });
      }
      handleRouterEvent(e, r) {
        e instanceof He
          ? this.updateStateMemento()
          : e instanceof ge
            ? this.commitTransition(r)
            : e instanceof kt
              ? this.urlUpdateStrategy === 'eager' &&
                (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r))
              : e instanceof ze
                ? (this.commitTransition(r),
                  this.urlUpdateStrategy === 'deferred' &&
                    !r.extras.skipLocationChange &&
                    this.setBrowserUrl(this.createBrowserPath(r), r))
                : e instanceof Z && !ki(e)
                  ? this.restoreHistory(r)
                  : e instanceof $e
                    ? this.restoreHistory(r, true)
                    : e instanceof fe &&
                      ((this.lastSuccessfulId = e.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(e, r) {
        let { extras: i, id: o } = r,
          { replaceUrl: a, state: c } = i;
        if (this.location.isCurrentPathEqualTo(e) || a) {
          let s = this.browserPageId,
            l = H(H({}, c), this.generateNgRouterState(o, s, r));
          this.location.replaceState(e, '', l);
        } else {
          let s = H(H({}, c), this.generateNgRouterState(o, this.browserPageId + 1, r));
          this.location.go(e, '', s);
        }
      }
      restoreHistory(e, r = false) {
        if (this.canceledNavigationResolution === 'computed') {
          let i = this.browserPageId,
            o = this.currentPageId - i;
          o !== 0
            ? this.location.historyGo(o)
            : this.getCurrentUrlTree() === e.finalUrl &&
              o === 0 &&
              (this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (r && this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
      }
      resetInternalState({ finalUrl: e }) {
        ((this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            e ?? this.rawUrlTree,
          )));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(e, r, i) {
        return this.canceledNavigationResolution === 'computed'
          ? H({ navigationId: e, ɵrouterPageId: r }, this.routerUrlState(i))
          : H({ navigationId: e }, this.routerUrlState(i));
      }
      static ɵfac = function (r) {
        return new (r || t)();
      };
      static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
    }
    return t;
  })();
function ao(t, n) {
  t.events
    .pipe(
      Or((e) => e instanceof fe || e instanceof Z || e instanceof $e || e instanceof ge),
      De$1((e) =>
        e instanceof fe || e instanceof ge
          ? 0
          : (
                e instanceof Z
                  ? e.code === P.Redirect || e.code === P.SupersededByNewNavigation
                  : false
              )
            ? 2
            : 1,
      ),
      Or((e) => e !== 2),
      dt$2(1),
    )
    .subscribe(() => {
      n();
    });
}
var rr = (() => {
  class t {
    get currentUrlTree() {
      return this.stateManager.getCurrentUrlTree();
    }
    get rawUrlTree() {
      return this.stateManager.getRawUrlTree();
    }
    disposed = false;
    nonRouterCurrentEntryChangeSubscription;
    console = E(fv);
    stateManager = E(nr);
    options = E(Vt, { optional: true }) || {};
    pendingTasks = E(_t$1);
    urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred';
    navigationTransitions = E(io);
    urlSerializer = E(zt);
    location = E(Ln$1);
    urlHandlingStrategy = E(tr);
    injector = E(re);
    _events = new ke$1();
    get events() {
      return this._events;
    }
    get routerState() {
      return this.stateManager.getRouterState();
    }
    navigated = false;
    routeReuseStrategy = E(os);
    injectorCleanup = E(oo, { optional: true });
    onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore';
    config = E(qt, { optional: true })?.flat() ?? [];
    componentInputBindingEnabled = !!E(Ft, { optional: true });
    currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
    constructor() {
      (this.resetConfig(this.config),
        this.navigationTransitions.setupNavigations(this).subscribe({ error: (e) => {} }),
        this.subscribeToNavigationEvents());
    }
    eventsSubscription = new $();
    subscribeToNavigationEvents() {
      let e = this.navigationTransitions.events.subscribe((r) => {
        try {
          let i = this.navigationTransitions.currentTransition,
            o = bE(this.navigationTransitions.currentNavigation);
          if (i !== null && o !== null) {
            if (
              (this.stateManager.handleRouterEvent(r, o),
              r instanceof Z && r.code !== P.Redirect && r.code !== P.SupersededByNewNavigation)
            )
              this.navigated = !0;
            else if (r instanceof fe)
              ((this.navigated = !0),
                this.injectorCleanup?.(this.routeReuseStrategy, this.routerState, this.config));
            else if (r instanceof Fe) {
              let a = r.navigationBehaviorOptions,
                c = this.urlHandlingStrategy.merge(r.url, i.currentRawUrl),
                s = H(
                  {
                    scroll: i.extras.scroll,
                    browserUrl: i.extras.browserUrl,
                    info: i.extras.info,
                    skipLocationChange: i.extras.skipLocationChange,
                    replaceUrl:
                      i.extras.replaceUrl || this.urlUpdateStrategy === 'eager' || is(i.source),
                  },
                  a,
                );
              this.scheduleNavigation(c, rt, null, s, {
                resolve: i.resolve,
                reject: i.reject,
                promise: i.promise,
              });
            }
          }
          ra(r) && this._events.next(r);
        } catch (i) {
          this.navigationTransitions.transitionAbortWithErrorSubject.next(i);
        }
      });
      this.eventsSubscription.add(e);
    }
    resetRootComponentType(e) {
      ((this.routerState.root.component = e), (this.navigationTransitions.rootComponentType = e));
    }
    initialNavigation() {
      (this.setUpLocationChangeListener(),
        this.navigationTransitions.hasRequestedNavigation ||
          this.navigateToSyncWithBrowser(
            this.location.path(true),
            rt,
            this.stateManager.restoredState(),
            { replaceUrl: true },
          ));
    }
    setUpLocationChangeListener() {
      this.nonRouterCurrentEntryChangeSubscription ??=
        this.stateManager.registerNonRouterCurrentEntryChangeListener((e, r, i, o) => {
          this.navigateToSyncWithBrowser(e, i, r, o);
        });
    }
    navigateToSyncWithBrowser(e, r, i, o) {
      let a = i?.navigationId ? i : null,
        c = i?.ɵrouterUrl ?? e;
      if ((i?.ɵrouterUrl && (o = B$1(H({}, o), { browserUrl: e })), i)) {
        let l = H({}, i);
        (delete l.navigationId,
          delete l.ɵrouterPageId,
          delete l.ɵrouterUrl,
          Object.keys(l).length !== 0 && (o.state = l));
      }
      let s = this.parseUrl(c);
      this.scheduleNavigation(s, r, a, o).catch((l) => {
        this.disposed || this.injector.get(Nt$2)(l);
      });
    }
    get url() {
      return this.serializeUrl(this.currentUrlTree);
    }
    getCurrentNavigation() {
      return bE(this.navigationTransitions.currentNavigation);
    }
    get lastSuccessfulNavigation() {
      return this.navigationTransitions.lastSuccessfulNavigation;
    }
    resetConfig(e) {
      ((this.config = e.map(er)), (this.navigated = false));
    }
    ngOnDestroy() {
      this.dispose();
    }
    dispose() {
      (this._events.unsubscribe(),
        this.navigationTransitions.complete(),
        this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),
        (this.nonRouterCurrentEntryChangeSubscription = void 0),
        (this.disposed = true),
        this.eventsSubscription.unsubscribe());
    }
    createUrlTree(e, r = {}) {
      let {
          relativeTo: i,
          queryParams: o,
          fragment: a,
          queryParamsHandling: c,
          preserveFragment: s,
        } = r,
        l = s ? this.currentUrlTree.fragment : a,
        u = null;
      switch (c ?? this.options.defaultQueryParamsHandling) {
        case 'merge':
          u = H(H({}, this.currentUrlTree.queryParams), o);
          break;
        case 'preserve':
          u = this.currentUrlTree.queryParams;
          break;
        default:
          u = o || null;
      }
      u !== null && (u = this.removeEmptyProps(u));
      let f;
      try {
        let h = i ? i.snapshot : this.routerState.snapshot.root;
        f = Di(h);
      } catch (h) {
        ((typeof e[0] != 'string' || e[0][0] !== '/') && (e = []), (f = this.currentUrlTree.root));
      }
      return Pi(f, e, u, l ?? null, this.urlSerializer);
    }
    navigateByUrl(e, r = { skipLocationChange: false }) {
      let i = je(e) ? e : this.parseUrl(e),
        o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
      return this.scheduleNavigation(o, rt, null, r);
    }
    navigate(e, r = { skipLocationChange: false }) {
      return (cs(e), this.navigateByUrl(this.createUrlTree(e, r), r));
    }
    serializeUrl(e) {
      return this.urlSerializer.serialize(e);
    }
    parseUrl(e) {
      try {
        return this.urlSerializer.parse(e);
      } catch (r) {
        return (this.console.warn(_n$1(4018, false)), this.urlSerializer.parse('/'));
      }
    }
    isActive(e, r) {
      let i;
      if (
        (r === true ? (i = H({}, wi)) : r === false ? (i = H({}, Mn)) : (i = H(H({}, Mn), r)),
        je(e))
      )
        return hi(this.currentUrlTree, e, i);
      let o = this.parseUrl(e);
      return hi(this.currentUrlTree, o, i);
    }
    removeEmptyProps(e) {
      return Object.entries(e).reduce((r, [i, o]) => (o != null && (r[i] = o), r), {});
    }
    scheduleNavigation(e, r, i, o, a) {
      if (this.disposed) return Promise.resolve(false);
      let c, s, l;
      a
        ? ((c = a.resolve), (s = a.reject), (l = a.promise))
        : (l = new Promise((f, h) => {
            ((c = f), (s = h));
          }));
      let u = this.pendingTasks.add();
      return (
        ao(this, () => {
          queueMicrotask(() => this.pendingTasks.remove(u));
        }),
        this.navigationTransitions.handleNavigationRequest({
          source: r,
          restoredState: i,
          currentUrlTree: this.currentUrlTree,
          currentRawUrl: this.currentUrlTree,
          rawUrl: e,
          extras: o,
          resolve: c,
          reject: s,
          promise: l,
          currentSnapshot: this.routerState.snapshot,
          currentRouterState: this.routerState,
        }),
        l.catch(Promise.reject.bind(Promise))
      );
    }
    static ɵfac = function (r) {
      return new (r || t)();
    };
    static ɵprov = Rt$2({ token: t, factory: t.ɵfac });
  }
  return t;
})();
function cs(t) {
  for (let n = 0; n < t.length; n++) if (t[n] == null) throw new b$1(4008, false);
}
var ls = new x$1('');
function ir(t, ...n) {
  return Ki$2([
    { provide: qt, multi: true, useValue: t },
    { provide: Ee, useFactory: us },
    { provide: uf, multi: true, useFactory: ds },
    n.map((e) => e.ɵproviders),
  ]);
}
function us() {
  return E(rr).routerState.root;
}
function ds() {
  let t = E(fe$1);
  return (n) => {
    let e = t.get(nr$2);
    if (n !== e.components[0]) return;
    let r = t.get(rr),
      i = t.get(hs);
    (t.get(ps) === 1 && r.initialNavigation(),
      t.get(fs, null, { optional: true })?.setUpPreloading(),
      t.get(ls, null, { optional: true })?.init(),
      r.resetRootComponentType(e.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe()));
  };
}
var hs = new x$1('', { factory: () => new ke$1() }),
  ps = new x$1('', { factory: () => 1 });
var fs = new x$1('');
var so = [];
var co = { providers: [rL({ eventCoalescing: true }), ir(so)] };
var ms = (t, n) => n.id;
function vs(t, n) {
  t & 1 && (Ua$1(0, 'div', 1), tE(1, 'No actions yet'), qa$1());
}
function ys(t, n) {
  t & 1 && (Ua$1(0, 'div', 4)(1, 'span'), tE(2, 'HEAD'), qa$1()());
}
function _s(t, n) {
  if (
    (t & 1 &&
      (mv(0, ys, 3, 0, 'div', 4),
      Ua$1(1, 'div', 5),
      gf(2, 'span', 6),
      Ua$1(3, 'span', 7),
      tE(4),
      qa$1()()),
    t & 2)
  ) {
    let e = n.$implicit,
      r = _v();
    (yv(e.showSeparator ? 0 : -1),
      Am(),
      Af('ah__item--done', e.isDone),
      Am(),
      Af('ah__dot--done', e.isDone),
      Am(2),
      jf(r.formatName(e.name)));
  }
}
var Gt = class t {
  manager = YO.required();
  entries = CE(() => {
    let n = Object.entries(this.manager().actions()),
      e = this.manager().currentActionId(),
      r = e ? n.findIndex(([a]) => a === e) : n.length,
      i = [...n]
        .reverse()
        .map(([a, c], s) => ({ id: a, name: c.action, isDone: n.length - 1 - s < r })),
      o = i.findIndex((a) => a.isDone);
    return i.map((a, c) => B$1(H({}, a), { showSeparator: c === o && e !== void 0 }));
  });
  canUndo = CE(() => this.entries().some((n) => n.isDone));
  canRedo = CE(() => this.manager().currentActionId() !== void 0);
  formatName(n) {
    return n.replace(/([A-Z])/g, ' $1').replace(/^[a-z]/, (e) => e.toUpperCase());
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = nv({
    type: t,
    selectors: [['app-action-history']],
    inputs: { manager: [1, 'manager'] },
    decls: 9,
    vars: 3,
    consts: [
      [1, 'ah__list'],
      [1, 'ah__empty'],
      [1, 'ah__controls'],
      [1, 'ah__btn', 3, 'click', 'disabled'],
      [1, 'ah__separator'],
      [1, 'ah__item'],
      [1, 'ah__dot'],
      [1, 'ah__name'],
    ],
    template: function (e, r) {
      (e & 1 &&
        (Ua$1(0, 'div', 0),
        mv(1, vs, 2, 0, 'div', 1),
        Ev(2, _s, 5, 6, null, null, ms),
        qa$1(),
        Ua$1(4, 'div', 2)(5, 'button', 3),
        Cf('click', function () {
          return r.manager().backConfig();
        }),
        tE(6, ' \u21BA Undo '),
        qa$1(),
        Ua$1(7, 'button', 3),
        Cf('click', function () {
          return r.manager().nextConfig();
        }),
        tE(8, ' \u21BB Redo '),
        qa$1()()),
        e & 2 &&
          (Am(),
          yv(r.entries().length === 0 ? 1 : -1),
          Am(),
          Iv(r.entries()),
          Am(3),
          Df('disabled', !r.canUndo()),
          Am(2),
          Df('disabled', !r.canRedo())));
    },
    styles: [
      '[_nghost-%COMP%]{display:flex;flex-direction:column;gap:6px}.ah__list[_ngcontent-%COMP%]{max-height:180px;overflow-y:auto;display:flex;flex-direction:column;scrollbar-width:thin;scrollbar-color:#3c3c3c transparent}.ah__empty[_ngcontent-%COMP%]{font-size:11px;color:#444;text-align:center;padding:10px 0}.ah__separator[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;padding:4px 14px;color:#007acc;font-size:10px;font-weight:600;letter-spacing:.06em}.ah__separator[_ngcontent-%COMP%]:before, .ah__separator[_ngcontent-%COMP%]:after{content:"";flex:1;height:1px;background:#007acc44}.ah__item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;padding:3px 14px;font-size:11px;color:#444}.ah__item--done[_ngcontent-%COMP%]{color:#bbb}.ah__dot[_ngcontent-%COMP%]{width:6px;height:6px;border-radius:50%;flex-shrink:0;border:1px solid #444;background:transparent}.ah__dot--done[_ngcontent-%COMP%]{background:#007acc;border-color:#007acc}.ah__name[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ah__controls[_ngcontent-%COMP%]{display:flex;gap:5px;padding:0 14px}.ah__btn[_ngcontent-%COMP%]{flex:1;padding:5px 0;background:#2a2a2a;border:1px solid #3c3c3c;border-radius:5px;color:#777;font-size:11px;cursor:pointer;transition:background .15s,color .15s}.ah__btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#333;color:#ccc}.ah__btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:not-allowed}',
    ],
  });
};
var Cs = (t, n) => n.id;
function bs(t, n) {
  if (t & 1) {
    let e = bv();
    (Ua$1(0, 'button', 3),
      Cf('click', function () {
        let i = Nl(e).$implicit,
          o = _v();
        return Sl(o.select(i));
      }),
      Ua$1(1, 'span', 4),
      tE(2),
      qa$1(),
      tE(3),
      qa$1());
  }
  if (t & 2) {
    let e = n.$implicit;
    (Am(), xf('background', e.color), Am(), jf(e.initials), Am(), za$1(' ', e.label, ' '));
  }
}
function Ss(t, n) {
  if (t & 1) {
    let e = bv();
    (Ua$1(0, 'button', 6),
      Cf('click', function () {
        Nl(e);
        let i = _v(2);
        return Sl(i.split('column'));
      }),
      tE(1, ' \u2B1A Column '),
      qa$1(),
      Ua$1(2, 'button', 7),
      Cf('click', function () {
        Nl(e);
        let i = _v(2);
        return Sl(i.split('row'));
      }),
      tE(3, '\u25A4 Row'),
      qa$1());
  }
}
function ws(t, n) {
  if (t & 1) {
    let e = bv();
    (Ua$1(0, 'button', 8),
      Cf('click', function () {
        Nl(e);
        let i = _v(2);
        return Sl(i.close());
      }),
      tE(1, '\u2715 Close'),
      qa$1());
  }
}
function Rs(t, n) {
  if (
    (t & 1 && (Ua$1(0, 'div', 2), mv(1, Ss, 4, 0), mv(2, ws, 2, 0, 'button', 5), qa$1()), t & 2)
  ) {
    let e = _v();
    (Am(), yv(e.isSplittable() ? 1 : -1), Am(), yv(e.isClosable() ? 2 : -1));
  }
}
var Wt = class t {
  items = YO.required();
  manager = YO.required();
  paneId = YO.required();
  parentId = YO.required();
  isSplittable = YO(false);
  isClosable = YO(false);
  select(n) {
    this.manager().addHeader(this.paneId(), { tabs: [n.tab] });
  }
  split(n) {
    this.manager().split(this.parentId(), this.paneId(), n, 0);
  }
  close() {
    this.manager().closePane(this.paneId());
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = nv({
    type: t,
    selectors: [['app-empty-pane-picker']],
    inputs: {
      items: [1, 'items'],
      manager: [1, 'manager'],
      paneId: [1, 'paneId'],
      parentId: [1, 'parentId'],
      isSplittable: [1, 'isSplittable'],
      isClosable: [1, 'isClosable'],
    },
    decls: 4,
    vars: 1,
    consts: [
      [1, 'picker__grid'],
      [1, 'picker__tile'],
      [1, 'picker__actions'],
      [1, 'picker__tile', 3, 'click'],
      [1, 'picker__icon'],
      [1, 'picker__action', 'picker__action--close'],
      ['title', 'Split column', 1, 'picker__action', 3, 'click'],
      ['title', 'Split row', 1, 'picker__action', 3, 'click'],
      [1, 'picker__action', 'picker__action--close', 3, 'click'],
    ],
    template: function (e, r) {
      (e & 1 &&
        (Ua$1(0, 'div', 0), Ev(1, bs, 4, 4, 'button', 1, Cs), qa$1(), mv(3, Rs, 3, 2, 'div', 2)),
        e & 2 && (Am(), Iv(r.items()), Am(2), yv(r.isSplittable() || r.isClosable() ? 3 : -1)));
    },
    styles: [
      '[_nghost-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:12px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}.picker__grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.picker__tile[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px;background:transparent;color:var(--ndl-color-text);border:1px solid color-mix(in srgb,var(--ndl-color-text) 12%,transparent);border-radius:var(--ndl-radius-sm, 6px);font-size:11px;cursor:pointer;transition:background .12s,border-color .12s}.picker__tile[_ngcontent-%COMP%]:hover{background:color-mix(in srgb,var(--ndl-color-text) 8%,transparent);border-color:color-mix(in srgb,var(--ndl-color-text) 28%,transparent)}.picker__icon[_ngcontent-%COMP%]{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff}.picker__actions[_ngcontent-%COMP%]{display:flex;gap:6px}.picker__action[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;padding:5px 10px;background:transparent;color:var(--ndl-color-text);border:1px solid color-mix(in srgb,var(--ndl-color-text) 12%,transparent);border-radius:var(--ndl-radius-sm, 6px);font-size:11px;opacity:.6;cursor:pointer;transition:opacity .12s,background .12s}.picker__action[_ngcontent-%COMP%]:hover{opacity:1;background:color-mix(in srgb,var(--ndl-color-text) 8%,transparent)}.picker__action--close[_ngcontent-%COMP%]{color:#e06c75;border-color:color-mix(in srgb,#e06c75 30%,transparent)}.picker__action--close[_ngcontent-%COMP%]:hover{background:color-mix(in srgb,#e06c75 10%,transparent)}',
    ],
  });
};
var Es = (t, n) => ({ manager: t, tab: n }),
  Ts = (t) => ({ tab: t }),
  or = (t, n) => n.id;
function Ms(t, n) {
  t & 1 && yf(0);
}
function xs(t, n) {
  if ((t & 1 && cf(0, Ms, 1, 0, 'ng-container', 28), t & 2)) {
    let e = _v().$implicit;
    _v();
    let r = kv(43);
    pf('ngTemplateOutlet', r)('ngTemplateOutletContext', pE(2, Ts, e.tab));
  }
}
function Is(t, n) {
  if ((t & 1 && hf(0, 'ndl-drag-preview', 27), t & 2)) {
    let e = _v().$implicit;
    pf('tab', e.tab);
  }
}
function As(t, n) {
  if (
    (t & 1 &&
      (Fo$1(0, 'div', 9)(1, 'span', 23),
      tE(2),
      $a$1(),
      Fo$1(3, 'div', 24)(4, 'span', 25),
      tE(5),
      $a$1(),
      Fo$1(6, 'span', 26),
      tE(7, 'Drag to create'),
      $a$1()(),
      Fo$1(8, 'ndl-drag-preview-container'),
      mv(9, xs, 1, 4, 'ng-container')(10, Is, 1, 1, 'ndl-drag-preview', 27),
      $a$1()()),
    t & 2)
  ) {
    let e = n.$implicit,
      r = _v();
    (pf('ndlDraggableElement', hE(6, Es, r.layoutManager, e.tab)),
      Am(),
      xf('background', e.color),
      Am(),
      za$1(' ', e.initials, ' '),
      Am(3),
      jf(e.label),
      Am(4),
      yv(r.useCustomDragPreview() ? 9 : 10));
  }
}
function Ds(t, n) {
  if (t & 1) {
    let e = bv();
    (Fo$1(0, 'button', 19),
      Tf('click', function () {
        let i = Nl(e).$implicit,
          o = _v();
        return Sl(o.setTheme(i));
      }),
      tE(1),
      $a$1());
  }
  if (t & 2) {
    let e = n.$implicit,
      r = _v();
    (Af('sidebar__theme-btn--active', r.theme() === e), Am(), za$1(' ', e, ' '));
  }
}
function Ps(t, n) {
  if (t & 1) {
    let e = bv();
    (Fo$1(0, 'button', 33),
      Tf('click', function () {
        let i = Nl(e).$implicit,
          o = _v(2);
        return Sl(o.onPickHeader(i));
      }),
      Fo$1(1, 'span', 23),
      tE(2),
      $a$1(),
      tE(3),
      $a$1());
  }
  if (t & 2) {
    let e = n.$implicit;
    (Am(),
      xf('background', e.color),
      Am(),
      za$1(' ', e.initials, ' '),
      Am(),
      za$1(' ', e.label, ' '));
  }
}
function Os(t, n) {
  if (t & 1) {
    let e = bv();
    (Fo$1(0, 'div', 29),
      Tf('click', function () {
        Nl(e);
        let i = _v();
        return Sl(i.pendingAddHeaderPane.set(void 0));
      }),
      Fo$1(1, 'div', 30),
      Tf('click', function (i) {
        return i.stopPropagation();
      }),
      Fo$1(2, 'div', 31),
      tE(3, 'Open panel'),
      $a$1(),
      Ev(4, Ps, 4, 4, 'button', 32, or),
      $a$1()());
  }
  if (t & 2) {
    let e = _v();
    (Am(4), Iv(e.panelItems));
  }
}
function Ns(t, n) {
  if (t & 1) {
    let e = bv();
    (Fo$1(0, 'button', 33),
      Tf('click', function () {
        let i = Nl(e).$implicit,
          o = _v(2);
        return Sl(o.onPickTab(i));
      }),
      Fo$1(1, 'span', 23),
      tE(2),
      $a$1(),
      tE(3),
      $a$1());
  }
  if (t & 2) {
    let e = n.$implicit;
    (Am(),
      xf('background', e.color),
      Am(),
      za$1(' ', e.initials, ' '),
      Am(),
      za$1(' ', e.label, ' '));
  }
}
function ks(t, n) {
  if (t & 1) {
    let e = bv();
    (Fo$1(0, 'div', 29),
      Tf('click', function () {
        Nl(e);
        let i = _v();
        return Sl(i.pendingAddTabHeader.set(void 0));
      }),
      Fo$1(1, 'div', 30),
      Tf('click', function (i) {
        return i.stopPropagation();
      }),
      Fo$1(2, 'div', 31),
      tE(3, 'Add tab'),
      $a$1(),
      Ev(4, Ns, 4, 4, 'button', 32, or),
      $a$1()());
  }
  if (t & 2) {
    let e = _v();
    (Am(4), Iv(e.panelItems));
  }
}
function Us(t, n) {
  if (
    (t & 1 &&
      (Fo$1(0, 'div', 34)(1, 'div', 35)(2, 'span', 36),
      tE(3),
      $a$1(),
      Fo$1(4, 'span', 37),
      tE(5),
      $a$1()(),
      hf(6, 'div', 38),
      $a$1()),
    t & 2)
  ) {
    let e = n.tab,
      r = _v().getPanelItem(e);
    (Am(2), xf('background', r?.color), Am(), jf(r?.initials), Am(2), jf(e.title));
  }
}
function Ls(t, n) {
  if ((t & 1 && hf(0, 'app-empty-pane-picker', 39), t & 2)) {
    let e = n.layoutManager,
      r = n.pane,
      i = n.parent,
      o = _v();
    pf('items', o.panelItems)('manager', e)('paneId', r.id)('parentId', i.id)(
      'isSplittable',
      r.isSplittable,
    )('isClosable', r.isClosable);
  }
}
var Kt = class t {
  defaultLayout = {
    root: {
      type: 'row',
      children: [
        {
          type: 'pane',
          size: 50,
          header: {
            type: 'header',
            tabs: [{ type: 'tab', title: 'Counter', isActive: true, component: { id: 'counter' } }],
          },
        },
        {
          type: 'pane',
          size: 50,
          header: {
            type: 'header',
            tabs: [
              { type: 'tab', title: 'Notes', isActive: true, component: { id: 'notes' } },
              { type: 'tab', title: 'Context', component: { id: 'context' } },
            ],
          },
        },
      ],
    },
    settings: { panes: { headers: { tabs: {} } } },
  };
  layoutManager = qn$1.init({
    layout: this.getStorageConfig(this.defaultLayout),
    components: {
      counter: () => import('./chunk-ey_2lktG.js').then((n) => n.CounterComponent),
      notes: () => import('./chunk-BGDZJPZc.js').then((n) => n.NotesComponent),
      context: () => import('./chunk-B47jtqMy.js').then((n) => n.ContextComponent),
    },
  });
  theme = lo(localStorage.getItem('theme') ?? 'light');
  builtinThemes = ['light', 'dark', 'abyss'];
  useCustomDragPreview = lo(false);
  pendingAddTabHeader = lo(void 0);
  pendingAddHeaderPane = lo(void 0);
  panelItems = [
    {
      id: 'di-counter',
      label: 'Counter',
      color: '#007acc',
      initials: 'C',
      tab: { title: 'Counter', component: { id: 'counter' } },
    },
    {
      id: 'di-notes',
      label: 'Notes',
      color: '#4ec9b0',
      initials: 'N',
      tab: { title: 'Notes', component: { id: 'notes' } },
    },
    {
      id: 'di-context',
      label: 'Context',
      color: '#c586c0',
      initials: 'Ctx',
      tab: { title: 'Context', component: { id: 'context' } },
    },
  ];
  constructor() {
    (Zl(() => {
      let n = this.theme();
      (localStorage.setItem('theme', n),
        document.body.classList.remove('dark', 'abyss', 'custom'),
        n !== 'light' && document.body.classList.add(n));
    }),
      Zl(() => {
        let n = this.layoutManager.config();
        localStorage.setItem('ndl-layout', JSON.stringify(n));
      }));
  }
  onKeyEvent(n) {
    let e = n.ctrlKey;
    (e && n.key === 'z' && this.layoutManager.backConfig(),
      e && n.key === 'y' && this.layoutManager.nextConfig());
  }
  getStorageConfig(n) {
    let e = localStorage.getItem('ndl-layout');
    return e ? JSON.parse(e) : n;
  }
  onReset() {
    (this.layoutManager.setConfig(this.defaultLayout), localStorage.removeItem('ndl-layout'));
  }
  setTheme(n) {
    this.theme.set(n);
  }
  onPickHeader(n) {
    let e = this.pendingAddHeaderPane();
    e &&
      (this.layoutManager.addHeader(e.id, { tabs: [n.tab] }),
      this.pendingAddHeaderPane.set(void 0));
  }
  onPickTab(n) {
    let e = this.pendingAddTabHeader();
    e && (this.layoutManager.addTab(e.id, n.tab), this.pendingAddTabHeader.set(void 0));
  }
  getPanelItem(n) {
    return this.panelItems.find((e) => e.tab.component?.id === n.component?.id);
  }
  static ɵfac = function (e) {
    return new (e || t)();
  };
  static ɵcmp = nv({
    type: t,
    selectors: [['app-root']],
    hostBindings: function (e, r) {
      e & 1 &&
        Tf(
          'keyup',
          function (o) {
            return r.onKeyEvent(o);
          },
          Ug,
        );
    },
    features: [
      dE([Fr(), { provide: he, useValue: B$1(H({}, xn$1), { closeTabTooltip: 'Fermer' }) }]),
    ],
    decls: 46,
    vars: 9,
    consts: [
      ['customDragPreviewTemplate', ''],
      ['emptyPaneTemplate', ''],
      [1, 'container'],
      [1, 'sidebar'],
      [1, 'sidebar__logo'],
      [1, 'sidebar__logo-mark'],
      [1, 'sidebar__logo-name'],
      [1, 'sidebar__section'],
      [1, 'sidebar__section-title'],
      [1, 'sidebar__panel-item', 3, 'ndlDraggableElement'],
      [1, 'sidebar__btn', 3, 'click'],
      [1, 'sidebar__toggle'],
      ['type', 'checkbox', 1, 'sidebar__toggle-input', 3, 'change', 'checked'],
      [1, 'sidebar__toggle-label'],
      [1, 'sidebar__section', 'sidebar__section--grow'],
      [3, 'manager'],
      [1, 'sidebar__theme-label'],
      [1, 'sidebar__theme-row'],
      [1, 'sidebar__theme-btn', 3, 'sidebar__theme-btn--active'],
      [1, 'sidebar__theme-btn', 3, 'click'],
      [1, 'layout-wrapper'],
      [
        1,
        'layout',
        3,
        'addTab',
        'addHeader',
        'manager',
        'emptyPaneTemplate',
        'dragPreviewTemplate',
      ],
      [1, 'tab-picker-overlay'],
      [1, 'sidebar__panel-icon'],
      [1, 'sidebar__panel-info'],
      [1, 'sidebar__panel-label'],
      [1, 'sidebar__panel-hint'],
      [3, 'tab'],
      [4, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
      [1, 'tab-picker-overlay', 3, 'click'],
      [1, 'tab-picker', 3, 'click'],
      [1, 'tab-picker__title'],
      [1, 'tab-picker__item'],
      [1, 'tab-picker__item', 3, 'click'],
      [1, 'app-drag-preview'],
      [1, 'app-drag-preview__header'],
      [1, 'app-drag-preview__icon'],
      [1, 'app-drag-preview__title'],
      [1, 'app-drag-preview__body'],
      [3, 'items', 'manager', 'paneId', 'parentId', 'isSplittable', 'isClosable'],
    ],
    template: function (e, r) {
      if (
        (e & 1 &&
          (Fo$1(0, 'div', 2)(1, 'aside', 3)(2, 'div', 4)(3, 'span', 5),
          tE(4, 'NDL'),
          $a$1(),
          Fo$1(5, 'span', 6),
          tE(6, 'ngx-dock-layout'),
          $a$1()(),
          Fo$1(7, 'div', 7)(8, 'div', 8),
          tE(9, 'Panels'),
          $a$1(),
          Ev(10, As, 11, 9, 'div', 9, or),
          $a$1(),
          Fo$1(12, 'div', 7)(13, 'div', 8),
          tE(14, 'Layout'),
          $a$1(),
          Fo$1(15, 'button', 10),
          Tf('click', function () {
            return r.onReset();
          }),
          tE(16, '\u21BA Reset layout'),
          $a$1(),
          Fo$1(17, 'label', 11)(18, 'input', 12),
          Tf('change', function () {
            return r.useCustomDragPreview.set(!r.useCustomDragPreview());
          }),
          $a$1(),
          Fo$1(19, 'span', 13),
          tE(20, 'Custom drag preview'),
          $a$1()()(),
          Fo$1(21, 'div', 14)(22, 'div', 8),
          tE(23, 'Actions'),
          $a$1(),
          hf(24, 'app-action-history', 15),
          $a$1(),
          Fo$1(25, 'div', 7)(26, 'div', 8),
          tE(27, 'Theme'),
          $a$1(),
          Fo$1(28, 'span', 16),
          tE(29, 'Built-in'),
          $a$1(),
          Fo$1(30, 'div', 17),
          Ev(31, Ds, 2, 3, 'button', 18, vv),
          $a$1(),
          Fo$1(33, 'span', 16),
          tE(34, 'Custom'),
          $a$1(),
          Fo$1(35, 'div', 17)(36, 'button', 19),
          Tf('click', function () {
            return r.setTheme('custom');
          }),
          tE(37, ' custom '),
          $a$1()()()(),
          Fo$1(38, 'div', 20)(39, 'ngx-dock-layout', 21),
          Tf('addTab', function (o) {
            return r.pendingAddTabHeader.set(o);
          })('addHeader', function (o) {
            return r.pendingAddHeaderPane.set(o);
          }),
          $a$1(),
          mv(40, Os, 6, 0, 'div', 22),
          mv(41, ks, 6, 0, 'div', 22),
          $a$1(),
          cf(42, Us, 7, 4, 'ng-template', null, 0, IE)(44, Ls, 1, 6, 'ng-template', null, 1, IE),
          $a$1()),
        e & 2)
      ) {
        let i = kv(43),
          o = kv(45);
        (Am(10),
          Iv(r.panelItems),
          Am(8),
          pf('checked', r.useCustomDragPreview()),
          Am(6),
          pf('manager', r.layoutManager),
          Am(7),
          Iv(r.builtinThemes),
          Am(5),
          Af('sidebar__theme-btn--active', r.theme() === 'custom'),
          Am(3),
          pf('manager', r.layoutManager)('emptyPaneTemplate', o)(
            'dragPreviewTemplate',
            r.useCustomDragPreview() ? i : void 0,
          ),
          Am(),
          yv(r.pendingAddHeaderPane() ? 40 : -1),
          Am(),
          yv(r.pendingAddTabHeader() ? 41 : -1));
      }
    },
    dependencies: [dt$1, mt, Dt$1, Gt, Wt, De, Be$1, me],
    styles: [
      '@charset "UTF-8";.container[_ngcontent-%COMP%]{display:flex;flex-direction:row;height:100%;width:100%;overflow:hidden}.layout-wrapper[_ngcontent-%COMP%]{position:relative;height:100%;flex:1;min-width:0}.layout[_ngcontent-%COMP%]{position:relative;height:100%;width:100%}.sidebar[_ngcontent-%COMP%]{width:220px;height:100%;display:flex;flex-direction:column;flex-shrink:0;background:#1e1e1e;color:#ccc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:12px;overflow:hidden}.sidebar__logo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:9px;padding:12px 14px;border-bottom:1px solid #2d2d2d;flex-shrink:0}.sidebar__logo-mark[_ngcontent-%COMP%]{background:#007acc;color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.06em}.sidebar__logo-name[_ngcontent-%COMP%]{font-size:12px;font-weight:600;color:#ddd;white-space:nowrap}.sidebar__section[_ngcontent-%COMP%]{padding:10px 0 8px;border-bottom:1px solid #2d2d2d;flex-shrink:0}.sidebar__section[_ngcontent-%COMP%]:last-child{border-bottom:none}.sidebar__section--grow[_ngcontent-%COMP%]{flex:1;overflow:hidden}.sidebar__section-title[_ngcontent-%COMP%]{padding:0 14px 6px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#666}.sidebar__panel-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:5px 14px;cursor:grab;transition:background .1s;position:relative}.sidebar__panel-item[_ngcontent-%COMP%]:hover{background:#ffffff0d}.sidebar__panel-item[_ngcontent-%COMP%]:active{cursor:grabbing}.sidebar__panel-icon[_ngcontent-%COMP%]{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0}.sidebar__panel-info[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;min-width:0}.sidebar__panel-label[_ngcontent-%COMP%]{font-size:12px;font-weight:500;color:#ddd}.sidebar__panel-hint[_ngcontent-%COMP%]{font-size:10px;color:#555}.sidebar__btn[_ngcontent-%COMP%]{display:block;margin:0 14px;padding:6px 10px;width:calc(100% - 28px);background:#2a2a2a;border:1px solid #3c3c3c;border-radius:5px;color:#bbb;font-size:11px;text-align:left;cursor:pointer;transition:background .15s,color .15s}.sidebar__btn[_ngcontent-%COMP%]:hover{background:#333;color:#eee}.sidebar__toggle[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;padding:5px 14px 0;cursor:pointer}.sidebar__toggle-input[_ngcontent-%COMP%]{accent-color:#007acc;width:13px;height:13px;cursor:pointer;flex-shrink:0}.sidebar__toggle-label[_ngcontent-%COMP%]{font-size:11px;color:#bbb;-webkit-user-select:none;user-select:none}.sidebar__theme-row[_ngcontent-%COMP%]{display:flex;gap:5px;padding:0 14px}.sidebar__theme-btn[_ngcontent-%COMP%]{flex:1;padding:5px 0;background:#2a2a2a;border:1px solid #3c3c3c;border-radius:5px;color:#777;font-size:10px;text-transform:capitalize;cursor:pointer;transition:background .15s,color .15s,border-color .15s}.sidebar__theme-btn--active[_ngcontent-%COMP%]{background:#007acc;border-color:#007acc;color:#fff;font-weight:600}.tab-picker-overlay[_ngcontent-%COMP%]{position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:#0000004d}.tab-picker[_ngcontent-%COMP%]{background:#1e1e1e;border:1px solid #3c3c3c;border-radius:6px;padding:8px 0;min-width:180px;box-shadow:0 8px 24px #0006}.tab-picker__title[_ngcontent-%COMP%]{padding:4px 14px 8px;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#666;border-bottom:1px solid #2d2d2d;margin-bottom:4px}.tab-picker__item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;width:100%;padding:5px 14px;background:transparent;border:none;color:#ccc;font-size:12px;text-align:left;cursor:pointer}.tab-picker__item[_ngcontent-%COMP%]:hover{background:#ffffff0d;color:#eee}.tab-picker__item[_ngcontent-%COMP%]   .sidebar__panel-icon[_ngcontent-%COMP%]{width:22px;height:22px;font-size:8px}.sidebar__theme-label[_ngcontent-%COMP%]{display:block;padding:4px 14px 2px;font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#555}.sidebar__theme-btn[_ngcontent-%COMP%]:not(.sidebar__theme-btn--active):hover{background:#333;color:#ccc}.app-drag-preview[_ngcontent-%COMP%]{display:flex;flex-direction:column;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.1);box-shadow:0 16px 40px #0000008c,0 4px 10px #0000004d;pointer-events:none}.app-drag-preview__header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:0 12px;height:36px;background:#1e1e1e;flex-shrink:0}.app-drag-preview__icon[_ngcontent-%COMP%]{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0}.app-drag-preview__title[_ngcontent-%COMP%]{font-size:12px;font-weight:500;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-drag-preview__body[_ngcontent-%COMP%]{flex:1;background:#252526;background-image:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.03) 3px,rgba(255,255,255,.03) 4px)}',
    ],
    changeDetection: 1,
  });
};
Cn(Kt, co).catch((t) => console.error(t));
export {
  Am as A,
  Cf as C,
  Df as D,
  E,
  Lt$1 as L,
  Ua$1 as U,
  jf as j,
  lo as l,
  nv as n,
  qa$1 as q,
  tE as t,
};
