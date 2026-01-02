# qunit/no-assert-equal-boolean

📝 Require use of boolean assertions.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

The boolean assertion functions `assert.true()` and `assert.false()` are available as of QUnit 2.11. These assertions can be stricter and clearer about intent when compared to using other assertion functions for boolean comparisons.

## Rule Details

The following patterns are considered warnings:

```js
QUnit.test('Name', function (assert) { assert.equal(a, true); });
```

```js
QUnit.test('Name', function (assert) { assert.strictEqual(a, true); });
```

```js
QUnit.test('Name', function (assert) { assert.deepEqual(false, a); });
```

The following patterns are not considered warnings:

```js
QUnit.test('Name', function (assert) { assert.true(a); });
```

```js
QUnit.test('Name', function (assert) { assert.false(a); });
```

## Further Reading

* [assert.true()](https://api.qunitjs.com/assert/true/)
* [assert.false()](https://api.qunitjs.com/assert/false/)
