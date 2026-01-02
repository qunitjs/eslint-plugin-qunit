# qunit/no-global-assertions

📝 Disallow global QUnit assertions.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit 2.0 is deprecating and removing global QUnit assertions such as `ok()`, requiring consumers to instead use scoped assertions provided on the test callback argument.

## Rule Details

The following patterns are considered warnings:

```js

ok(true);

equal(a, b);

strictEqual(a, b);

deepEqual(a, b);

propEqual(a, b);

notEqual(a, b);

notStrictEqual(a, b);

notDeepEqual(a, b);

notPropEqual(a, b);

raises(function () {}, TypeError);

throws(function () {}, TypeError);

```

The following patterns are not considered warnings:

```js

assert.ok(true);

assert.equal(a, b);

assert.strictEqual(a, b);

assert.deepEqual(a, b);

assert.propEqual(a, b);

assert.notEqual(a, b);

assert.notStrictEqual(a, b);

assert.notDeepEqual(a, b);

assert.notPropEqual(a, b);

assert.raises(function () {}, TypeError);

assert.throws(function () {}, TypeError);

```

Where `assert` is the name of the first argument to your test callback.

## When Not to Use It

This rule can be safely disabled if you want to tolerate global assertions, especially if your codebase does not use QUnit 2.0 syntax yet.

## Further Reading

* [QUnit 2.x Migration Guide (Assertions)](https://qunitjs.com/upgrade-guide-2.x/#replace-global-assertions-with-assert-arguments)
