# qunit/no-global-module-test

📝 Disallow global module/test/asyncTest.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit 2.0 is deprecating and removing global functions related to declaring tests and modules. This rule will warn when the global functions are used.

## Rule Details

The following patterns are considered warnings:

```js

module("A module");

module("A module", {
    beforeEach: function () { },
    afterEach: function () { }
});

test("A test", function () { });

asyncTest("A test", function () { });

```

The following patterns are not considered warnings:

```js

QUnit.module("A module");

QUnit.module("A module", {
    beforeEach: function () { },
    afterEach: function () { }
});

QUnit.test("A test", function () { });

QUnit.asyncTest("A test", function () { });

// Other globals are not warned. no-global-assertions catches global assertions.
ok(true);

```

## When Not to Use It

This rule can be safely disabled if you want to tolerate global module/test declarations, especially if your codebase does not use QUnit 2.0 syntax yet.

## Further Reading

* [QUnit 2.x Migration Guide (Globals)](https://qunitjs.com/upgrade-guide-2.x/#removed-globals)
