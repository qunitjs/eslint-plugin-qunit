# qunit/no-jsdump

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow use of QUnit.jsDump.

<!-- end auto-generated rule header -->

When QUnit was first developed, it used the `jsDump` library for serializing
objects as strings. Since then, QUnit has forked and evolved the library. To
reflect that this new serialization code no longer uses jsDump, `QUnit.dump()`
was added to the API, with `QUnit.jsDump()` allowed to remain for reasons of
backward compatibility.

With the release of QUnit 2.0, `QUnit.jsDump()` will be removed from the public
API. This rule can be used to detect uses of `QUnit.jsDump()` and replace them
with `QUnit.dump()`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.jsDump(obj);

```

The following patterns are not warnings:

```js

QUnit.dump(obj);

```

## When Not To Use It

If you are developing in a legacy codebase which will not use QUnit 2.0, this
rule can be safely disabled.

## Further Reading

[QUnit 2.x Upgrade Guide: Replace QUnit.jsDump() with QUnit.dump()](https://qunitjs.com/upgrade-guide-2.x/#replace-qunit-jsdump-with-qunit-dump)
