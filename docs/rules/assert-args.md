# qunit/assert-args

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Enforce that the correct number of assert arguments are used.

<!-- end auto-generated rule header -->

QUnit's assertions expect a certain number of arguments based on what sort of
condition is being evaluated.

For example, `assert.ok()` checks one argument for truthiness and also accepts
an assertion message. This means that we can check that one or two arguments
are passed to it, and if two arguments are passed, the last should be an
assertion message (i.e., a string).

We can apply the same analysis to all of QUnit's assertions. In general,
`assert.ok()` and `assert.notOk()` expect one argument and one optional message;
`assert.throws()` and `assert.raises()` expect one or two arguments and one
optional message; and the other assertions expect two arguments and one optional
message.

## Rule Details

The following patterns are considered warnings:

```js

// ok
assert.ok();
assert.ok(result, expected);
assert.ok(result, expected, 'message');

// equal
assert.equal();
assert.equal(result);
assert.equal(result, expected, extra);
assert.equal(result, expected, extra, 'message');

// strictEqual
assert.strictEqual();
assert.strictEqual(result);
assert.strictEqual(result, expected, extra);
assert.strictEqual(result, expected, extra, 'message');

// deepEqual
assert.deepEqual();
assert.deepEqual(result);
assert.deepEqual(result, expected, extra);
assert.deepEqual(result, expected, extra, 'message');

// propEqual
assert.propEqual();
assert.propEqual(result);
assert.propEqual(result, expected, extra);
assert.propEqual(result, expected, extra, 'message');

// throws
assert.throws();
assert.throws(block, expected, extra);
assert.throws(block, expected, extra, 'message');

// raises
assert.raises();
assert.raises(block, expected, extra);
assert.raises(block, expected, extra, 'message');

// notOk
assert.notOk();
assert.notOk(result, expected);
assert.notOk(result, expected, 'message');

// notEqual
assert.notEqual();
assert.notEqual(result);
assert.notEqual(result, expected, extra);
assert.notEqual(result, expected, extra, 'message');

// notStrictEqual
assert.notStrictEqual();
assert.notStrictEqual(result);
assert.notStrictEqual(result, expected, extra);
assert.notStrictEqual(result, expected, extra, 'message');

// notDeepEqual
assert.notDeepEqual();
assert.notDeepEqual(result);
assert.notDeepEqual(result, expected, extra);
assert.notDeepEqual(result, expected, extra, 'message');

// notPropEqual
assert.notPropEqual();
assert.notPropEqual(result);
assert.notPropEqual(result, expected, extra);
assert.notPropEqual(result, expected, extra, 'message');

```

The following patterns are not considered warnings:

```js

// ok
assert.ok(result);
assert.ok(result, 'message');

// equal
assert.equal(result, expected);
assert.equal(result, expected, 'message');

// strictEqual
assert.strictEqual(result, expected);
assert.strictEqual(result, expected, 'message');

// deepEqual
assert.deepEqual(result, expected);
assert.deepEqual(result, expected, 'message');

// propEqual
assert.propEqual(result, expected);
assert.propEqual(result, expected, 'message');

// throws
assert.throws(function () {});
assert.throws(function () {}, 'message');
assert.throws(function () {}, expected, 'message');

// raises
assert.raises(function () {});
assert.raises(function () {}, 'message');
assert.raises(function () {}, expected, 'message');

// notOk
assert.notOk(result);
assert.notOk(result, 'message');

// notEqual
assert.notEqual(result, expected);
assert.notEqual(result, expected, 'message');

// notStrictEqual
assert.notStrictEqual(result, expected);
assert.notStrictEqual(result, expected, 'message');

// notDeepEqual
assert.notDeepEqual(result, expected);
assert.notDeepEqual(result, expected, 'message');

// notPropEqual
assert.notPropEqual(result, expected);
assert.notPropEqual(result, expected, 'message');

```

## Known Limitations

At this point, there is no special validation for assertion message arguments.
We eventually want to add support for different types of validation for
assertion message arguments (for example, requiring that assertion messages be
string literals). However, we learned early on that enforcing string literal
assertion messages makes the rule nearly unusable in some codebases.

## When Not to Use It

This rule should be reasonably safe to use in all circumstances.

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
