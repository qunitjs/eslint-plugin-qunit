# qunit/no-global-stop-start

📝 Disallow global stop/start.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

QUnit 2.0 is deprecating and removing all of its global exports, including
`stop()` and `start()`.

## Rule Details

The following patterns are considered warnings:

```js

stop();

start();

```

The following patterns are not warnings:

```js

QUnit.stop();

QUnit.start();

var done = assert.async();
done();

```

## When Not To Use It

If you are working in a codebase that will not use QUnit 2.0, this rule can be
safely disabled.

## Further Reading

* [QUnit 2.0 Migration Guide: Stop using stop/start](https://qunitjs.com/upgrade-guide-2.x/#replace-stop-and-start-with-assert-async)
