# qunit/no-arrow-tests

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Disallow arrow functions as QUnit test/module callbacks.

<!-- end auto-generated rule header -->

QUnit test and module callbacks can share state by modifying properties of
`this` within those callbacks.

This only works when using function expressions, which allow for dynamic
binding of `this` by the QUnit library. Arrow function expressions will not
work in this case, because arrow functions will always bind to whatever the
value of `this` was in the enclosing scope (in QUnit tests, usually the global
object). This means that developers who use arrow function expressions as test
or module callbacks will not be able to share state and may encounter other
problems.

## Rule Details

This rule aims to forbid arrow function expressions as QUnit test or module
callbacks, to avoid the shared state issues described above.

The following patterns are considered warnings:

```js
QUnit.test("test", (assert) => {
    assert.ok(true);
});

QUnit.test("test", () => {
    ok(true);
});

test("test", (assert) => {
    assert.ok(true);
});

test("test", () => {
    ok(true);
});

QUnit.module("module", {
    beforeEach: (assert) => {},
    afterEach: (assert) => {}
});

module("module", {
    setup: (assert) => {},
    teardown: (assert) => {}
});

```

The following patterns are not warnings:

```js
QUnit.test("test", function (assert) {
    assert.ok(true);
});

QUnit.test("test", function () {
    ok(true);
});

test("test", function (assert) {
    assert.ok(true);
});

test("test", function () {
    ok(true);
});

QUnit.module("module", {
    beforeEach: function (assert) {},
    afterEach: function (assert) {}
});

module("module", {
    setup: function (assert) {},
    teardown: function (assert) {}
});

```

## When Not To Use It

If your tests do not involve shared state or you are otherwise not worried
about potential issues that could arise from arrow functions (or if you are in
a pre-ES2015 environment), it is safe to disable this rule.
