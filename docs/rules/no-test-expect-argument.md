# qunit/no-test-expect-argument

📝 Disallow the expect argument in QUnit.test.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit 2.0 is deprecating expect counts as the second argument of `QUnit.test`. Users are expected to use `assert.expect()` instead.

## Rule Details

The following patterns are considered warnings:

```js

test("test name", 0, function () { });

QUnit.test("test name", 0, function () { });

asyncTest("test name", 0, function () { });

QUnit.asyncTest("test name", 0, function () { });

```

The following patterns are not warnings:

```js

// No expect call at all
test("test name", function () { });
QUnit.test("test name", function () { });
asyncTest("test name", function () { });
QUnit.asyncTest("test name", function () { });

// Global expect() is not checked by this rule
test("test name", function () { expect(0); });
QUnit.test("test name", function () { expect(0); });
asyncTest("test name", function () { expect(0); });
QUnit.asyncTest("test name", function () { expect(0); });

// assert.expect() is best
test("test name", function (assert) { assert.expect(0); });
QUnit.test("test name", function (assert) { assert.expect(0); });
asyncTest("test name", function (assert) { assert.expect(0); });
QUnit.asyncTest("test name", function (assert) { assert.expect(0); });

```

## When Not To Use It

This rule can be safely disabled if you want to tolerate an expect argument in `QUnit.test()`, especially if your codebase does not use QUnit 2.0 syntax yet.

## Further Reading

* [QUnit 2.x Migration Guide (Replace expect argument in QUnit.test)](https://qunitjs.com/upgrade-guide-2.x/#replace-expected-argument-in-qunit-test)
