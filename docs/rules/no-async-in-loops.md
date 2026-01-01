# qunit/no-async-in-loops

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow async calls in loops.

<!-- end auto-generated rule header -->

Asynchronous operations are much harder to reason about in loops. To increase
maintainability, asynchronous operations should not be placed within loops.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test("Test name", function () {
    while (false) { QUnit.stop(); }
});

QUnit.test("Test name", function () {
    while (false) { QUnit.start(); }
});

QUnit.test("Test name", function (assert) {
    while (false) { assert.async(); }
});

QUnit.test("Test name", function () {
    do { QUnit.stop(); } while (false);
});

QUnit.test("Test name", function () {
    do { QUnit.start(); } while (false);
});

QUnit.test("Test name", function (assert) {
    do { assert.async(); } while (false);
});

QUnit.test("Test name", function () {
    for (;;) { QUnit.stop(); }
});

QUnit.test("Test name", function () {
    for (;;) { QUnit.start(); }
});

QUnit.test("Test name", function (assert) {
    for (;;) { assert.async(); }
});

QUnit.test("Test name", function () {
    for (i in obj) { QUnit.stop(); }
});

QUnit.test("Test name", function () {
    for (i in obj) { QUnit.start(); }
});

QUnit.test("Test name", function (assert) {
    for (i in obj) { assert.async(); }
});

QUnit.test("Test name", function () {
    for (i of obj) { QUnit.stop(); }
});

QUnit.test("Test name", function () {
    for (i of obj) { QUnit.start(); }
});

QUnit.test("Test name", function (assert) {
    for (i of obj) { assert.async(); }
});

```

The following patterns are not warnings:

```js

QUnit.test("Test name", function () {
    QUnit.stop();
    QUnit.start();
});

QUnit.test("Test name", function (assert) {
    var done = assert.async();
});

```

## When Not to Use This Rule

This rule can be disabled if it is common to write async setup or resolution
calls in loops in your codebase.

## Further Reading

* [QUnit.stop()](https://api.qunitjs.com/QUnit.stop/)
* [QUnit.start()](https://api.qunitjs.com/QUnit/start/)
* [assert.async()](https://api.qunitjs.com/async/)
