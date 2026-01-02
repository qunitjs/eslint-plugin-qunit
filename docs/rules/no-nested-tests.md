# qunit/no-nested-tests

📝 Disallow nested QUnit.test() calls.

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

<!-- end auto-generated rule header -->

This rule prevents from incorrect usage of [Nested Scope](https://github.com/qunitjs/qunit/blob/master/docs/QUnit/module.md#nested-scope). Developer can write nested test instead of nested module by mistake. In this case test will still be executed, but effects may be unexpected.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.test('Parent', function () {
    QUnit.test('Child', function () {});
});

test('Parent', function () {
    test('Child', function () {});
});

QUnit.test('ParentTest', function () {
    QUnit.module('ChildModule', function () {
        QUnit.test('ChildTest', function () {});
    });
});

```

The following patterns are not considered warnings:

```js

QUnit.test('First', function () {});
QUnit.test('Second', function () {});

QUnit.module('ParentModule', function () {
    QUnit.test('Parent', function () {});

    QUnit.module('ChildModule', function () {
        QUnit.test('ChildTest', function () {});
    });
});

```

## When Not to Use It

It should be safe to use this rule. However it may cause false positive when using same namespace `test` during act or arrange stages.

## Further Reading

* [QUnit.module() Nested Scope](https://github.com/qunitjs/qunit/blob/master/docs/QUnit/module.md#nested-scope)
* [QUnit.test](https://github.com/qunitjs/qunit/blob/master/docs/QUnit/test.md)
