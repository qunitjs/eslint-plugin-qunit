# qunit/no-skip

📝 Disallow QUnit.skip.

<!-- end auto-generated rule header -->

`QUnit.skip` is useful to mark a test as skipped. This should be preferred over commenting out the test. However, leaving tests skipped in perpetuity is a bad practice, as the test ceases to provide any use in ensuring correctness of your code. Skipping tests should be done sparingly.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.module.skip('Name', function() { });

QUnit.skip('Name', function() { });

module.skip('Name', function() { });

skip('Name', function() { });

test.skip('Name', function() { });

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

* [QUnit.skip](https://api.qunitjs.com/QUnit.skip/)
