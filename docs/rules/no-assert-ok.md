# qunit/no-assert-ok

📝 Disallow the use of assert.ok/assert.notOk.

<!-- end auto-generated rule header -->

`assert.ok` and `assert.notOk` pass for any truthy/falsy argument. As [many expressions evaluate to true/false in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) the usage of `assert.ok` is potentially error prone. In general, it should be advisable to always test for exact values in tests which makes tests a lot more solid.

An example when using `assert.ok` can involuntarily go wrong:

```js
test('test myFunc returns a truthy value', (assert) => {
    assert.ok(myFunc);
});
```

Here by mistake a developer just passed to `assert.ok` a pointer to `myFunc` instead of explicitly calling it. This test is going to pass no matter how `myFunc` changes. Using `assert.strictEqual(myFunc, theReturnValue)` solves the problem as this becomes an explicit check for equality.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test('Name', function (assert) { assert.ok(a); });

QUnit.test('Name', function (foo) { foo.ok(a); });

QUnit.test('Name', function () { ok(a); });

QUnit.test('Name', function (assert) { assert.notOk(a); });

QUnit.test('Name', function (foo) { foo.notOk(a); });

QUnit.test('Name', function () { notOk(a); });

```

The following patterns are not considered warnings:

```js

QUnit.test('Name', function (assert) { assert.strictEqual(a, true); });

QUnit.test('Name', function (foo) { foo.strictEqual(a, true); });

QUnit.test('Name', function () { strictEqual(a, true); });

QUnit.test('Name', function (assert) { assert.strictEqual(a, false); });

QUnit.test('Name', function (foo) { foo.strictEqual(a, false); });

QUnit.test('Name', function () { strictEqual(a, false); });

QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });

QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });

QUnit.test('Name', function () { deepEqual(a, b); });

QUnit.test('Name', function (assert) { assert.propEqual(a, b); });

QUnit.test('Name', function (foo) { foo.propEqual(a, b); });

QUnit.test('Name', function () { propEqual(a, b); });

```

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
