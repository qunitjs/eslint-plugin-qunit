# qunit/no-compare-relation-boolean

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Disallow comparing relational expressions to booleans in assertions.

<!-- end auto-generated rule header -->

Sometimes, QUnit assertions contain relations (such as `expected === actual`). Many of these relations can be expressed better using different assertion methods (such as `assert.strictEqual`). However, even for those comparisons which cannot easily be expressed (such as `actual > expected`), comparing those results explicitly to `true` or `false` provides no added value, because the assertion will show that true equals or does not equal true.

In any comparison between a relational expression (`actual > expected`) and a boolean, it is at least possible to convert the assertion to use `assert.ok` or `assert.notOk`. In addition, custom assertions could be used or created to provide better output.

## Rule Details

The following patterns are considered warnings:

```js

assert.equal(a === b, true);
assert.equal(true, a === b);

assert.strictEqual(a > b, false);
assert.strictEqual(false, a > b);

assert.deepEqual(a === b, true);
assert.deepEqual(true, a === b);

assert.propEqual(a <= b, false);
assert.propEqual(false, a <= b);

assert.notEqual(a == b, true);
assert.notEqual(true, a == b);

// etc. for all negated equality assertions

```

The following patterns are not warnings:

```js

assert.equal(a, b);

assert.ok(a === b);

assert.ok(a > b);

```

## When Not To Use It

If you are not concerned with the formatting of assertions in any QUnit reporter, you can safely disable this rule.
