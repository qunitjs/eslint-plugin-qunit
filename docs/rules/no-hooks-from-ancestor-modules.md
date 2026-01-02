# qunit/no-hooks-from-ancestor-modules

📝 Disallow the use of hooks from ancestor modules.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

When a QUnit `module` is used with a nested callback, the callback provides a `hooks`
object as its first argument. This allows calling `hooks.beforeEach` and `hooks.afterEach`
within that callback's body.

More deeply nested `module` uses should use their own callback's provided `hooks` argument
and not one from an ancestor `module`.

## Rule Details

The following patterns are considered warnings:

```js
QUnit.module("outer module", function(hooks) {
    QUnit.module("inner module", function() {
        hooks.beforeEach(function() {});
    });
});

QUnit.module("outer module", function(outerHooks) {
    QUnit.module("inner module", function(innerHooks) {
        outerHooks.beforeEach(function() {});
    });
});
```

The following patterns are not warnings:

```js
QUnit.module("example module", function(hooks) {
    hooks.beforeEach(function() {});
});

QUnit.module("outer module", function() {
    QUnit.module("inner module", function(hooks) {
        hooks.beforeEach(function() {});
    });
});
```

## When Not To Use It

This rule may be safely disabled if you are working in a legacy codebase that
will not migrate to QUnit 2.0.

## Further Reading

* [QUnit.module](https://api.qunitjs.com/QUnit/module/#nested-scope)
