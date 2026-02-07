# qunit/no-async-module-callbacks

📝 Disallow async module callbacks.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit does not support async module callbacks. Only test and hook callbacks
will work as expected when using `async` and `await`. Code after an `await`
statement in an async module callback will run in an unexpected way.

The following example will result in QUnit only running the first `test`
as part of the first `module`. The second `test` will be treated as
if it was within the last `module` that QUnit processes.

```js
QUnit.module('An async module', async function () {
    QUnit.test('a passing test', function (assert) {
        assert.ok(true);
    });

    await Promise.resolve();

    QUnit.test('another passing test', function (assert) {
        assert.ok(true);
    });
});

QUnit.module('Some other module');

// Runner output:
// ok 1 An async module > a passing test
// ok 2 Some other module > another passing test
```

## Rule Details

The following patterns are considered warnings:

```js
QUnit.module('example module', async function () {});

QUnit.module('example module', async () => {});
```

The following patterns are not warnings:

```js
QUnit.module('example module', function () {});

QUnit.module('example module', () => {});
```
