# qunit/no-assert-equal

📝 Disallow the use of assert.equal.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

The `assert.equal` assertion method in QUnit uses loose equality comparison. In a project which favors strict equality comparison, it is better to use `assert.strictEqual` for scalar values and either `assert.deepEqual` or `assert.propEqual` for more complex objects.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test('Name', function (assert) { assert.equal(a, b); });

QUnit.test('Name', function (foo) { foo.equal(a, b); });

QUnit.test('Name', function () { equal(a, b); });

```

The following patterns are not considered warnings:

```js

QUnit.test('Name', function (assert) { assert.strictEqual(a, b); });

QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });

QUnit.test('Name', function (assert) { assert.propEqual(a, b); });

QUnit.test('Name', function (foo) { foo.strictEqual(a, b); });

QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });

QUnit.test('Name', function (foo) { foo.propEqual(a, b); });

QUnit.test('Name', function () { strictEqual(a, b); });

QUnit.test('Name', function () { deepEqual(a, b); });

QUnit.test('Name', function () { propEqual(a, b); });

```

## When Not to Use It

If loose equality comparisons are common throughout a project or it is necessary to rely on loose equality checks, this rule can be disabled.

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
