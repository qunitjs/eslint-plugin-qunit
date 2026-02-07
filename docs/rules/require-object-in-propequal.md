# qunit/require-object-in-propequal

📝 Enforce use of objects as expected value in `assert.propEqual`.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

The `assert.propEqual` assertion is for the strict-equality comparison of own-properties
of two objects. If the expected value is a string or other non-object, the assertion
result can be unexpected.

For string comparisons, `assert.strictEqual` should be used. For arrays,
`assert.deepEqual` should be used.

## Rule Details

The following patterns are considered warnings:

```js
assert.propEqual(actual, 0);

assert.propEqual(actual, "foo");

assert.propEqual(actual, `foo`);

assert.propEqual(actual, /regex/);
```

The following patterns are not considered warnings:

```js
assert.propEqual(actual, { foo: "bar" });

assert.propEqual(actual, ["array"]);

// Variables are not checked
assert.propEqual(actual, foo);
```

## When Not to Use It

This rule should be reasonably safe to use in all circumstances.

## Further Reading

[`assert.propEqual`](https://api.qunitjs.com/assert/propEqual/)
