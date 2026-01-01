# qunit/no-setup-teardown

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

📝 Disallow setup/teardown module hooks.

<!-- end auto-generated rule header -->

QUnit supports two hooks at the module level: `beforeEach` and `afterEach`.
These hooks are run before and after each test, respectively. Before QUnit
1.16.0, these hooks were known as `setup` and `teardown`, which sometimes
caused ambiguity because it wasn't clear from the names whether these hooks
would run before/after each test, or before any tests/after all tests.

QUnit 2.0 will remove support for `setup` and `teardown` hooks. This rule can
be used to find module hooks with those names and rename them to `beforeEach`
and `afterEach`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.module('A module', {
    setup: function () {},
    teardown: function () {}
});

```

The following patterns are not warnings:

```js

QUnit.module('A module', {
    beforeEach: function () {},
    afterEach: function () {}
});

```

## When Not To Use It

If you are working in a codebase that does not need to conform to QUnit 2.0
APIs, this rule can be safely disabled.

## Further Reading

* [QUnit 2.0 upgrade guide: Module hooks](https://qunitjs.com/upgrade-guide-2.x/#rename-module-hooks)
