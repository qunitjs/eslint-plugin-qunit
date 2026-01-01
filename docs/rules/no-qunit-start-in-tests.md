# qunit/no-qunit-start-in-tests

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/README.md#configurations).

📝 Disallow QUnit.start() within tests or test hooks.

<!-- end auto-generated rule header -->

The purpose of this rule is to ensure that `QUnit.start()` is not used within tests or test hooks.

Prior to QUnit 2.0, `QUnit.start()` was the way to resume an asynchronous test. However, with QUnit 2.0, that usage has been disallowed, and now `QUnit.start()` should only be used to start the test runner for the first time (if `QUnit.config.autostart` is set to `false`.

## Rule Details

The following patterns are considered warnings:

```js

QUnit.asyncTest("A test", function() {
    setTimeout(function() {
        QUnit.start();
    });
});

QUnit.test("A test", function(assert) {
    var done = assert.async();

    setTimeout(function() {
        QUnit.start();
    });
});

QUnit.module("A module", {
    beforeEach: function() {
        var done = assert.async();
        setTimeout(function() {
            QUnit.start();
        });
    },

    afterEach: function() {
        var done = assert.async();
        setTimeout(function() {
            QUnit.start();
        });
    }
});

QUnit.module("A module", function(hooks) {
    hooks.beforeEach(function() {
        var done = assert.async();
        setTimeout(function() {
            QUnit.start();
        });
    });

    hooks.afterEach(function() {
        var done = assert.async();
        setTimeout(function() {
            QUnit.start();
        });
    });
});

```

The following patterns are not warnings:

```js

QUnit.test("A test", function(assert) {
    var done = assert.async();

    setTimeout(function() {
        done();
    });
});

QUnit.module("A module", {
    beforeEach: function() {
        var done = assert.async();
        setTimeout(function() {
            done();
        });
    },

    afterEach: function() {
        var done = assert.async();
        setTimeout(function() {
            done();
        });
    }
});

QUnit.module("A module", function(hooks) {
    hooks.beforeEach(function() {
        var done = assert.async();
        setTimeout(function() {
            done();
        });
    });

    hooks.afterEach(function() {
        var done = assert.async();
        setTimeout(function() {
            done();
        });
    });
});

// Using QUnit.start() outside of tests or module hooks will not be warned
QUnit.start();

```

## When Not To Use It

If you are not upgrading to QUnit 2.x anytime soon, this rule can be safely disabled.

## Further Reading

* [`QUnit.start()`](https://api.qunitjs.com/QUnit/start/)
