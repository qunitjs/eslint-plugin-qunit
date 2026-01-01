# qunit/literal-compare-order

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Enforce comparison assertions have arguments in the right order.

<!-- end auto-generated rule header -->

QUnit's many comparison assertions (`equal`, `strictEqual`, etc.) distinguish
between an expected value and an actual value, and report incorrect assertions
accordingly. The QUnit reporters will show how the actual value is different
from the expected value, allowing the developer to quickly see what is wrong.

If the developer writes the assertion with the arguments in the wrong order,
this functionality becomes more confusing and less useful. In this case, QUnit
will report the actual value as the expected value, and the developer may make
the wrong change.

This rule attempts to catch mistakes in the argument order. It does so by
assuming that literal values used as arguments to assertion methods should be
regarded as "expected" values, rather than actual values, and then flags
assertions in which the literal/"expected" value is known to be in the argument
slot reserved for the "actual" value.

## Rule Details

The following patterns are considered warnings:

```js

// equal
assert.equal("Literal", variable);
assert.equal("Literal", variable, "message");

// strictEqual
assert.strictEqual("Literal", variable);
assert.strictEqual("Literal", variable, "message");

// deepEqual
assert.deepEqual("Literal", variable);
assert.deepEqual("Literal", variable, "message");

// propEqual
assert.propEqual("Literal", variable);
assert.propEqual("Literal", variable, "message");

// notEqual
assert.notEqual("Literal", variable);
assert.notEqual("Literal", variable, "message");

// notStrictEqual
assert.notStrictEqual("Literal", variable);
assert.notStrictEqual("Literal", variable, "message");

// notDeepEqual
assert.notDeepEqual("Literal", variable);
assert.notDeepEqual("Literal", variable, "message");

// notPropEqual
assert.notPropEqual("Literal", variable);
assert.notPropEqual("Literal", variable, "message");

```

The following patterns are not considered warnings:

```js

// equal
assert.equal(variable, "Literal");
assert.equal(variable, "Literal", "message");

// strictEqual
assert.strictEqual(variable, "Literal");
assert.strictEqual(variable, "Literal", "message");

// deepEqual
assert.deepEqual(variable, "Literal");
assert.deepEqual(variable, "Literal", "message");

// propEqual
assert.propEqual(variable, "Literal");
assert.propEqual(variable, "Literal", "message");

// notEqual
assert.notEqual(variable, "Literal");
assert.notEqual(variable, "Literal", "message");

// notStrictEqual
assert.notStrictEqual(variable, "Literal");
assert.notStrictEqual(variable, "Literal", "message");

// notDeepEqual
assert.notDeepEqual(variable, "Literal");
assert.notDeepEqual(variable, "Literal", "message");

// notPropEqual
assert.notPropEqual(variable, "Literal");
assert.notPropEqual(variable, "Literal", "message");

```

## When Not to Use It

This rule can be disabled if you aren't concerned about the readability of test
reports.

## Further Reading

* [QUnit's Assertions](https://api.qunitjs.com/category/assert/)
