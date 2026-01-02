# qunit/no-qunit-stop

📝 Disallow QUnit.stop.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit's handling of asynchronous tests used to be via tracking a global
semaphore and not starting a test until the previous test had decremented the
semaphore. However, in order to avoid tests interfering with each other,
`QUnit.stop()` (and also `QUnit.start()`) have been deprecated (to be removed
in 2.0) and have been replaced with `assert.async()`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.stop();

QUnit.stop(2);

```

The following patterns are not warnings:

```js

var done = assert.async();

```

## When Not To Use It

This rule may be safely disabled if you are working in a legacy codebase that
will not migrate to QUnit 2.0.

## Further Reading

* [QUnit.stop()](https://api.qunitjs.com/QUnit.stop/)
