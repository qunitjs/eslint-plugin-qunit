# qunit/no-loose-assertions

📝 Disallow the use of assert.equal/assert.ok/assert.notEqual/assert.notOk.

<!-- end auto-generated rule header -->

The `assert.equal`/`assert.notEqual` assertion methods in QUnit use loose equality comparison. In a project which favors strict equality comparison, it is better to use `assert.strictEqual`/`assert.notStrictEqual` for scalar values and either `assert.deepEqual` or `assert.propEqual` for more complex objects.

`assert.ok` and `assert.notOk` pass for any truthy/falsy argument. As [many expressions evaluate to true/false in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) the usage of `assert.ok` is potentially error prone. In general, it should be advisable to always test for exact values in tests which makes tests a lot more solid.

An example when using `assert.ok` can involuntarily go wrong:

```js
test('test myFunc returns a truthy value', (assert) => {
    assert.ok(myFunc);
});
```

Here by mistake a developer just passed to `assert.ok` a pointer to `myFunc` instead of explicitly calling it. This test is going pass no matter how `myFunc` changes. Using `assert.strictEqual(myFunc, theReturnValue)` solves the problem as this becomes an explicit check for equality.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test('Name', function (assert) { assert.ok(a); });

QUnit.test('Name', function (foo) { foo.ok(a); });

QUnit.test('Name', function () { ok(a); });

QUnit.test('Name', function (assert) { assert.notOk(a); });

QUnit.test('Name', function (foo) { foo.notOk(a); });

QUnit.test('Name', function () { notOk(a); });

QUnit.test('Name', function (assert) { assert.equal(a, b); });

QUnit.test('Name', function (foo) { foo.equal(a, b); });

QUnit.test('Name', function () { equal(a, b); });

QUnit.test('Name', function (assert) { assert.notEqual(a, b); });

QUnit.test('Name', function (foo) { foo.notEqual(a, b); });

QUnit.test('Name', function () { notEqual(a, b); });

```

The following patterns are not considered warnings:

```js

QUnit.test('Name', function (assert) { assert.strictEqual(a, true); });

QUnit.test('Name', function (foo) { foo.strictEqual(a, true); });

QUnit.test('Name', function () { strictEqual(a, true); });

QUnit.test('Name', function (assert) { assert.notStrictEqual(a, false); });

QUnit.test('Name', function (foo) { foo.notStrictEqual(a, false); });

QUnit.test('Name', function () { notStrictEqual(a, false); });

QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });

QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });

QUnit.test('Name', function () { deepEqual(a, b); });

QUnit.test('Name', function (assert) { assert.propEqual(a, b); });

QUnit.test('Name', function (foo) { foo.propEqual(a, b); });

QUnit.test('Name', function () { propEqual(a, b); });

/* With rule config: ["error", ["strictEqual", "ok", "notOk"]] */
QUnit.test('Name', function (assert) { assert.notEqual(a, b); });

```

## Options

The assertions to lint against can be controlled with an array of assertions (default `["equal", "notEqual", "ok", "notOk"]`).

To fine tune the error message (which by default will recommend to use `strictEqual`, `notStrictEqual`, `deepEqual`, or `propEqual`) a configuration object can be passed as an option instead of a string. The configuration object has two properties:

* `disallowed`: the name of the assertion to disallow (either `equal`, `ok`, or `notOk`);
* `recommended`: an array of strings representing the recommended options to display as an error message. The strings in the array will be concatenated to build the error message: `Unexpected {{assertVar}}.{{assertion}}. Use {{assertVar}}.<recommended_1>, {{assertVar}}.<recommended_2>.` when using local assertions and `Unexpected {{assertion}}. Use <recommended_1>, <recommended_2>.` when using global assertions.

If an assertion is passed twice as a string and object the first configuration will be used and any other configuration will be ignored.

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
