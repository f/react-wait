!(function(t, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n(exports, require("react"), require("hoist-non-react-statics"))
    : "function" == typeof define && define.amd
    ? define(["exports", "react", "hoist-non-react-statics"], n)
    : n((t.reactWait = {}), t.react, t.hoistNonReactStatics);
})(this, function(t, n, e) {
  var i = "default" in n ? n.default : n;
  e = e && e.hasOwnProperty("default") ? e.default : e;
  var r = n.createContext();
  function a(t) {
    return n.useContext(r).waiters.includes(t.on) ? t.fallback : t.children;
  }
  function u() {
    var t = n.useContext(r);
    return Object.assign({}, t, { Wait: a });
  }
  function o(t) {
    var e = n.useContext(r),
      u = e.isWaiting,
      o = e.startWaiting,
      c = e.endWaiting;
    return {
      isWaiting: function() {
        return u(t);
      },
      startWaiting: function() {
        return o(t);
      },
      endWaiting: function() {
        return c(t);
      },
      Wait: function(n) {
        return i.createElement(a, Object.assign({}, { on: t }, n));
      }
    };
  }
  var c = function(t) {
      return t.length > 0;
    },
    f = function(t, n) {
      return t.includes(n);
    },
    s = function(t, n) {
      return f(t, n) ? t : t.concat([n]);
    },
    d = function(t, n) {
      return t.filter(function(t) {
        return t !== n;
      });
    };
  (t.useWait = u),
    (t.Waiter = function(t) {
      var e = n.useState([]),
        a = e[0],
        u = e[1];
      return i.createElement(
        r.Provider,
        {
          value: {
            waiters: a,
            createWaitingContext: o,
            anyWaiting: function() {
              return c(a);
            },
            isWaiting: function(t) {
              return f(a, t);
            },
            startWaiting: function(t) {
              u(s(a, t));
            },
            endWaiting: function(t) {
              u(d(a, t));
            }
          }
        },
        t.children
      );
    }),
    (t.injectWaiting = function(t, n) {
      void 0 === n && (n = {});
      var a = n.forwardRef;
      void 0 === a && (a = !1);
      var o = n.propName;
      void 0 === o && (o = "waiting");
      var c,
        f = function(n) {
          var e = u().Wait;
          return i.createElement(r.Consumer, null, function(r) {
            var u;
            return (
              (r.Wait = e),
              i.createElement(
                t,
                Object.assign({}, n, (((u = {})[o] = r), u), {
                  ref: a ? n.forwardedRef : null
                })
              )
            );
          });
        };
      return (
        (f.displayName =
          "WithWaiting(" +
          ((c = t).displayName || c.name || "Component") +
          ")"),
        (f.WrappedComponent = t),
        e(
          a
            ? i.forwardRef(function(t, n) {
                return i.createElement(
                  f,
                  Object.assign({}, t, { forwardedRef: n })
                );
              })
            : f,
          t
        )
      );
    });
});
//# sourceMappingURL=react-wait.umd.js.map
