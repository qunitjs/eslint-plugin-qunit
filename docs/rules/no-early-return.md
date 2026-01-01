# qunit/no-early-return

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow early return in tests.

<!-- end auto-generated rule header -->

This rule aims to prevent early returns in a QUnit test. Unit tests which can return early are usually indications that a test is nondeterministic or too dependent on environmental factors. On the rare occasion that a test should be run conditionally, the whole test should be run or skipped, rather than having a test that can return early (which is harder to maintain).

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test("a test", function (assert) {
    if (!shouldRunTest()) {
        return;
    }

    assert.ok(true);
});

```

The following patterns are not warnings:

```js

QUnit[shouldRunTest() ? "test" : "skip"]("a test", function (assert) {
    assert.ok(true);
});

// Nested function scopes are okay because they do not cause the test to abort
QUnit.test("a test", function (assert) {
    (function () {
        if (true) {
            return;
        }
        assert.ok(true);
    }());
});

if (shouldRunTest()) {
    QUnit.test("a test", function (assert) {
        assert.ok(true);
    });
}

```

## When Not To Use It

This rule can be disabled if you are in an environment where external factors cannot be controlled and so tests must be run conditionally. However, even then, it is still worth trying to enable or disable entire tests rather than rely on nondeterminism in the test itself.
