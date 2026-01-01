# qunit/no-reassign-log-callbacks

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow overwriting of QUnit logging callbacks.

<!-- end auto-generated rule header -->

In early versions of QUnit, it was possible to create logging functions that
would be invoked as QUnit processed tests and modules by assigning to specific
properties of the QUnit object. This became problematic when multiple logging
functions would overwrite each other, and QUnit quickly adopted a callback
consumer approach.

This rule will detect assignments to `QUnit.log` and other logging callbacks
and recommend that the corresponding functions be invoked instead.

## Rule Details

The full list of QUnit logging callbacks are as follows:

* `QUnit.begin()`
* `Qunit.done()`
* `QUnit.log()`
* `QUnit.moduleDone()`
* `QUnit.moduleStart()`
* `QUnit.testDone()`
* `QUnit.testStart()`

The following patterns are considered warnings:

```js

QUnit.begin = function () { };

QUnit.done = function () { };

QUnit.log = function () { };

QUnit.moduleDone = function () { };

QUnit.moduleStart = function () { };

QUnit.testDone = function () { };

QUnit.testStart = function () { };

```

The following patterns are not warnings:

```js

QUnit.begin(function () { });

QUnit.done(function () { });

QUnit.log(function () { });

QUnit.moduleDone(function () { });

QUnit.moduleStart(function () { });

QUnit.testDone(function () { });

QUnit.testStart(function () { });

```

## When Not To Use It

This rule should probably be enabled, unless working in a legacy codebase that
will not be upgrading to QUnit 2.0 and which has no concerns of overwriting
others' logging callbacks.

## Further Reading

* [QUnit 2.0 Migration Guide: Logging Callbacks](https://qunitjs.com/upgrade-guide-2.x/#replace-qunit-log-callback-with-qunit-log-callback-for-all-reporting-callbacks)
