function $(e) {
  return { ...e };
}
var a;
// @__NO_SIDE_EFFECTS__
function P(e) {
  return {
    lang: (e == null ? void 0 : e.lang) ?? (a == null ? void 0 : a.lang),
    message: e == null ? void 0 : e.message,
    abortEarly: (e == null ? void 0 : e.abortEarly) ?? (a == null ? void 0 : a.abortEarly),
    abortPipeEarly: (e == null ? void 0 : e.abortPipeEarly) ?? (a == null ? void 0 : a.abortPipeEarly)
  };
}
var v;
// @__NO_SIDE_EFFECTS__
function S(e) {
  return v == null ? void 0 : v.get(e);
}
var d;
// @__NO_SIDE_EFFECTS__
function x(e) {
  return d == null ? void 0 : d.get(e);
}
var o;
// @__NO_SIDE_EFFECTS__
function _(e, t) {
  var n;
  return (n = o == null ? void 0 : o.get(e)) == null ? void 0 : n.get(t);
}
// @__NO_SIDE_EFFECTS__
function m(e) {
  var n, u;
  const t = typeof e;
  return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && ((u = (n = Object.getPrototypeOf(e)) == null ? void 0 : n.constructor) == null ? void 0 : u.name)) ?? "null" : t;
}
function b(e, t, n, u, s) {
  const y = s && "input" in s ? s.input : n.value, i = (s == null ? void 0 : s.expected) ?? e.expects ?? null, r = (s == null ? void 0 : s.received) ?? /* @__PURE__ */ m(y), l = {
    kind: e.kind,
    type: e.type,
    input: y,
    expected: i,
    received: r,
    message: `Invalid ${t}: ${i ? `Expected ${i} but r` : "R"}eceived ${r}`,
    requirement: e.requirement,
    path: s == null ? void 0 : s.path,
    issues: s == null ? void 0 : s.issues,
    lang: u.lang,
    abortEarly: u.abortEarly,
    abortPipeEarly: u.abortPipeEarly
  }, p = e.kind === "schema", c = (s == null ? void 0 : s.message) ?? e.message ?? /* @__PURE__ */ _(e.reference, l.lang) ?? (p ? /* @__PURE__ */ x(l.lang) : null) ?? u.message ?? /* @__PURE__ */ S(l.lang);
  c && (l.message = typeof c == "function" ? (
    // @ts-expect-error
    c(l)
  ) : c), p && (n.typed = !1), n.issues ? n.issues.push(l) : n.issues = [l];
}
// @__NO_SIDE_EFFECTS__
function k(e) {
  return {
    version: 1,
    vendor: "valibot",
    validate(t) {
      return e["~run"]({ value: t }, /* @__PURE__ */ P());
    }
  };
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
  const n = [...new Set(e)];
  return n.length > 1 ? `(${n.join(` ${t} `)})` : n[0] ?? "never";
}
// @__NO_SIDE_EFFECTS__
function w(e, t, n) {
  return typeof e.fallback == "function" ? (
    // @ts-expect-error
    e.fallback(t, n)
  ) : (
    // @ts-expect-error
    e.fallback
  );
}
// @__NO_SIDE_EFFECTS__
function M(e, t, n) {
  return typeof e.default == "function" ? (
    // @ts-expect-error
    e.default(t, n)
  ) : (
    // @ts-expect-error
    e.default
  );
}
// @__NO_SIDE_EFFECTS__
function E(e, t) {
  return {
    kind: "schema",
    type: "object",
    reference: E,
    expects: "Object",
    async: !1,
    entries: e,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ k(this);
    },
    "~run"(n, u) {
      var y;
      const s = n.value;
      if (s && typeof s == "object") {
        n.typed = !0, n.value = {};
        for (const i in this.entries) {
          const r = this.entries[i];
          if (i in s || (r.type === "exact_optional" || r.type === "optional" || r.type === "nullish") && // @ts-expect-error
          r.default !== void 0) {
            const l = i in s ? (
              // @ts-expect-error
              s[i]
            ) : /* @__PURE__ */ M(r), p = r["~run"]({ value: l }, u);
            if (p.issues) {
              const c = {
                type: "object",
                origin: "value",
                input: s,
                key: i,
                value: l
              };
              for (const f of p.issues)
                f.path ? f.path.unshift(c) : f.path = [c], (y = n.issues) == null || y.push(f);
              if (n.issues || (n.issues = p.issues), u.abortEarly) {
                n.typed = !1;
                break;
              }
            }
            p.typed || (n.typed = !1), n.value[i] = p.value;
          } else if (r.fallback !== void 0)
            n.value[i] = /* @__PURE__ */ w(r);
          else if (r.type !== "exact_optional" && r.type !== "optional" && r.type !== "nullish" && (b(this, "key", n, u, {
            input: void 0,
            expected: `"${i}"`,
            path: [
              {
                type: "object",
                origin: "key",
                input: s,
                key: i,
                // @ts-expect-error
                value: s[i]
              }
            ]
          }), u.abortEarly))
            break;
        }
      } else
        b(this, "type", n, u);
      return n;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function j(e, t) {
  return {
    kind: "schema",
    type: "picklist",
    reference: j,
    expects: /* @__PURE__ */ I(e.map(m), "|"),
    async: !1,
    options: e,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ k(this);
    },
    "~run"(n, u) {
      return this.options.includes(n.value) ? n.typed = !0 : b(this, "type", n, u), n;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function g(e) {
  return {
    kind: "schema",
    type: "string",
    reference: g,
    expects: "string",
    async: !1,
    message: e,
    get "~standard"() {
      return /* @__PURE__ */ k(this);
    },
    "~run"(t, n) {
      return typeof t.value == "string" ? t.typed = !0 : b(this, "type", t, n), t;
    }
  };
}
const O = $({
  user: /* @__PURE__ */ E({
    provider: /* @__PURE__ */ j(["github"]),
    providerId: /* @__PURE__ */ g(),
    username: /* @__PURE__ */ g()
  })
}), h = "woah";
export {
  O as subjects,
  h as what
};
