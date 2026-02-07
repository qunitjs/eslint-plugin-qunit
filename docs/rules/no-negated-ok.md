# qunit/no-negated-ok

📝 Disallow negation in assert.ok/assert.notOk.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Negated `assert.ok()` or `assert.notOk()` solutions can be misleading, because
the error message may show a double negative or otherwise be hard to read. It
is usually better to use the opposite assertion in order to get a better error
message.

`assert.notOk()` was introduced in QUnit 1.18.0. This rule can be used to find
assertions that can be converted to `assert.notOk()`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test('test', function (assert) {
    assert.ok(!foo);
});

QUnit.test('test', function (assert) {
    ok(!foo);
});

QUnit.test('test', function (assert) {
    assert.notOk(!foo);
});

```

The following patterns are not considered warnings:

```js

QUnit.test('test', function (assert) {
    assert.notOk(foo);
});

QUnit.test('test', function (assert) {
    assert.ok(foo);
});

QUnit.test('test', function (assert) {
    ok(foo);
});

```

## When Not to Use It

Since `assert.notOk()` was only introduced in QUnit 1.18.0, this rule can be
safely disabled if you are using an earlier version of QUnit.

In addition, `assert.notOk()` is not available in global scope, so if you are
in a codebase with many global assertions, switching `ok()` to `assert.notOk()`
may involve a fair amount of work, since the assert parameter must be added to
tests. If the cost of doing this work outweighs the benefit of this rule, it
can be safely disabled. (Note that QUnit 2.0 will remove support for global
assertion functions.)

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
