# qunit/resolve-async

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Require that async calls are resolved.

<!-- end auto-generated rule header -->

Asynchronous operations on QUnit tests should be resolved within the scope of
the test to maximize readability and maintainability. Also, if there are more
async setup calls than async resolution calls, the test runner will hang, so
this rule also helps to ensure correctness in test files.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test("Test name", function () {
    QUnit.stop();
});

QUnit.asyncTest("Test name", function () {
});

QUnit.test("Test name", function () {
    QUnit.stop();
    QUnit.stop();
    QUnit.start();
});

QUnit.test("Test name", function () {
    QUnit.stop(2);
    QUnit.start();
});

QUnit.test("Test name", function (assert) {
    var done = assert.async();
});

QUnit.test("Test name", function (assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    done1();
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
    done();
});

QUnit.test("Test name", function (assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    done1();
    done2();
});

```

## When Not to Use It

This rule should generally not be disabled, but if you tend to put most of your
async setup or resolution in common functions, this rule will raise warnings
unnecessarily and can be disabled.

## Further Reading

* [QUnit.stop()](https://api.qunitjs.com/QUnit.stop/)
* [QUnit.start()](https://api.qunitjs.com/QUnit/start/)
* [assert.async()](https://api.qunitjs.com/async/)
