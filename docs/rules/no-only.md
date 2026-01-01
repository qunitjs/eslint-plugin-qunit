# qunit/no-only

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow QUnit.only.

<!-- end auto-generated rule header -->

`QUnit.only` is useful for restricting a test run to just one test while developing, but committing a test file using this function to a repository is dangerous because it will ensure that the rest of the test suite is not run.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.module.only('Name', function() { });

QUnit.only('Name', function() { });

module.only('Name', function() { });

only('Name', function() { });

test.only('Name', function() { });

```

The following patterns are not considered warnings:

```js

QUnit.module.test('Name', function() { });

QUnit.test('Name', function() { });

module.test('Name', function() { });

test('Name', function() { });

```

## When Not to Use It

If your development pipeline would make running this rule annoying, it could be safely disabled. However, it would be a good idea to ensure that this rule is run in continuous integration at the very least.

## Further Reading

* [QUnit.only](https://api.qunitjs.com/QUnit.only/)
