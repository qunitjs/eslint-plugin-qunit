# qunit/no-conditional-assertions

📝 Disallow assertions within if statements or conditional expressions.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

This rule aims to detect non-deterministic unit testing by looking for assertions in an if statement or conditional expression.

Most of the time, a unit test should know what it is testing and what assertions should be run for a given test. Conditional assertions suggest that the developer is not sure how the unit test should run, or else that the developer is unfamiliar with testing boolean conditions within an assertion.

If a test is uncertain due to environmental factors (e.g., if a test should only be run in a browser environment), then a conditional test should be used. This rule does not flag conditional tests.

## Rule Details

The following patterns are considered warnings:

```js

if (condition) {
    assert.ok(foo);
}

condition ? assert.ok(foo) : assert.notOk(foo);

```

The following patterns are not warnings:

```js

if (condition) {
    QUnit.test("some test", function (assert) {
        assert.ok(true);
    });
}

```
