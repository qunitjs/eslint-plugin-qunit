# qunit/no-commented-tests

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow commented tests.

<!-- end auto-generated rule header -->

When developing non-trivial projects, it is unfortunately realistic that unit
tests may need to be temporarily prevented from running until an upstream
problem is fixed. However, in that case, the test should be disabled in a way
that allows QUnit (and your team) to be aware that it is disabled, so that it
may be re-enabled later on.

QUnit provides the `QUnit.skip()` function to mark a test as skipped. This
should be preferred over commenting out the test. A commented out unit test
will not show up in any reporter, but a skipped test will appear in all
reporters.

## Rule Details

The following patterns are considered warnings:

```js

// QUnit.test("Name", function () { ok(true); });

// QUnit.asyncTest("Name", function () { ok(true); });

// test("Name", function () { ok(true); });

// asyncTest("Name", function () { ok(true); });

```

The following patterns are not considered warnings:

```js

QUnit.skip("Name", function () { ok(true); });

```

## When Not to Use It

It is best to enable this rule. However, if you don't care about tests being
left in a disabled state in perpetuity, or if it would be too much trouble to
change all existing commented out tests, then this rule can be safely disabled.

## Further Reading

* [QUnit.skip()](https://api.qunitjs.com/QUnit.skip/)
