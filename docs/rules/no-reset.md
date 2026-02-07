# qunit/no-reset

📝 Disallow QUnit.reset.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

Early versions of QUnit exposed the `QUnit.reset()` function, which allowed
consumers to invoke the internal QUnit fixture reset logic. This has been
discouraged for a long time since QUnit now automatically invokes this method
between tests. In QUnit 2.0, the function will be removed from the public API.
Tests that rely on this functionality will need to be split into multiple tests.

This rule will detect and report calls to `QUnit.reset()`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.reset();

```

The following patterns are not warnings:

```js

QUnit.reset;  // Only attempting to invoke the function is reported

```

## When Not To Use It

This rule can be disabled if there are tests that rely on this functionality and
there are no plans to migrate to QUnit 2.0. For the other 99.9% of use cases,
use of this rule is *highly* recommended.

## Further Reading

* [QUnit Upgrade Guide: Stop using `QUnit.reset`](https://qunitjs.com/upgrade-guide-2.x/#stop-using-qunit-reset-split-one-test-into-multiple-tests)
