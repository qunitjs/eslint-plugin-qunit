# qunit/no-ok-equality

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Disallow equality comparisons in assert.ok/assert.notOk.

<!-- end auto-generated rule header -->

Equality comparisons in `assert.ok` or `assert.notOk` calls are not valuable
because if the assertion fails, QUnit cannot reveal any comparison information.
Instead, developers should use `assert.equal`, `assert.strictEqual`,
`assert.notEqual`, or `assert.notStrictEqual` to allow QUnit to track the
expected and actual values and show a useful diff. This makes test output much
easier to read.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test("Name", function (assert) { assert.ok(x === 1); });

QUnit.test("Name", function (assert) { assert.notOk(x === 1); });

QUnit.test("Name", function (assert) { assert.ok(x !== 1); });

QUnit.test("Name", function (assert) { assert.notOk(x !== 1); });

```

In addition, if `{ allowGlobals: true }` option is on (the default), the following patterns are also considered warnings:

```js

QUnit.test("Name", function () { ok(x === 1); });

QUnit.test("Name", function () { notOk(x === 1); });

QUnit.test("Name", function () { ok(x !== 1); });

QUnit.test("Name", function () { notOk(x !== 1); });

```

The previous patterns are not warnings if `{ allowGlobals: false }` is passed
in as an option.

The following patterns are not considered warnings:

```js

QUnit.test("Name", function (assert) { assert.ok(x); });

QUnit.test("Name", function (assert) { assert.ok(x > 1); });

QUnit.test("Name", function (assert) { assert.ok(x < 1); });

QUnit.test("Name", function (assert) { assert.ok(x >= 1); });

QUnit.test("Name", function (assert) { assert.ok(x <= 1); });

QUnit.test("Name", function (assert) { assert.ok(x instanceof Number); });

```

## Options

<!-- begin auto-generated rule options list -->

| Name          | Description                                      | Type    | Default |
| :------------ | :----------------------------------------------- | :------ | :------ |
| `allowGlobal` | Whether the rule should check global assertions. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

## When Not to Use It

It is best to enable this rule, but since it is possible to test a codebase
using equality comparisons in `assert.ok` and `assert.notOk` calls, this rule
can be disabled if enabling it would be too much of a pain.

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
