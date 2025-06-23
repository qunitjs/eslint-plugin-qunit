/**
 * @fileoverview prevent early return in a QUnit test
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-early-return"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-early-return", rule, {
    valid: [
        // Inside nested function (assertions outside of nested function)
        "QUnit.test('a test', function (assert) { function foo() { return; } assert.ok(true); });",
        "QUnit.test('a test', function (assert) { (function () { return; })(); assert.ok(true); });",
        "QUnit.test('a test', function (assert) { () => { return; }; assert.ok(true); });",

        // Inside nested function (assertions inside nested function before return)
        "QUnit.test('a test', function (assert) { function foo() { assert.ok(true); return; } });",
        "QUnit.test('a test', function (assert) { (function () { assert.ok(true); return; })(); });",
        "QUnit.test('a test', function (assert) { () => { assert.ok(true); return; }; });",

        // Conditionally run tests are okay
        "QUnit[shouldRunTest() ? 'test' : 'skip']('a test', function (assert) { assert.ok(true); });",
        "if (shouldRunTest()) { QUnit.test('a test', function (assert) { assert.ok(true); }); }",

        // Return statement outside of test is fine
        "(function () { return true; }());",
    ],

    invalid: [
        {
            code: "QUnit.test('a test', function (assert) { if (true) return; assert.ok(true); });",
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                },
            ],
        },

        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('a test', function (this: LocalTestContext, assert) { if (true) return; assert.ok(true); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                },
            ],
        },

        {
            code: "QUnit.test('a test', (assert) => { if (true) return; assert.ok(true); });",
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                },
            ],
        },

        // Return in nested function before assertion is considered early return
        {
            code: "QUnit.test('a test', function (assert) { setTimeout(function () { if (true) return; assert.ok(true); }, 0); });",
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                },
            ],
        },
        {
            code: "QUnit.test('a test', function (assert) { setTimeout(function () { assert.ok(true); if (true) return; assert.ok(true); }, 0); });",
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                },
            ],
        },

        // Report errors in multiple scopes with assertions
        {
            code: "QUnit.test('a test', function (assert) { setTimeout(function () { return; assert.ok(true); }, 0); return; assert.ok(true); });",
            errors: [
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                    line: 1,
                    column: 67,
                },
                {
                    messageId: "noEarlyReturn",
                    type: "ReturnStatement",
                    line: 1,
                    column: 99,
                },
            ],
        },
    ],
});
