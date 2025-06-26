/**
 * @fileoverview Forbid the use of async within loops.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-async-in-loops"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-async-in-loops", rule, {
    valid: [
        // stop()/start()
        "test('name', function () { stop(); start(); });",
        "asyncTest('name', function () { stop(); start(); });",

        // assert.async()
        "test('name', function (assert) { var done = assert.async(); });",
        "asyncTest('name', function (assert) { var done = assert.async(); });",
    ],

    invalid: [
        // stop()
        {
            code: "test('name', function () { while (false) stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { while (false) { stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do stop(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do { stop(); } while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) { stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) { stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) { stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },

        // QUnit.stop()
        {
            code: "test('name', function () { while (false) QUnit.stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { while (false) { QUnit.stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do QUnit.stop(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do { QUnit.stop(); } while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) QUnit.stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) { QUnit.stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) QUnit.stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) { QUnit.stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) QUnit.stop(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) { QUnit.stop(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "stop()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },

        // start()
        {
            code: "test('name', function () { while (false) start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { while (false) { start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do start(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do { start(); } while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) { start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) { start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) { start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },

        // QUnit.start()
        {
            code: "test('name', function () { while (false) QUnit.start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { while (false) { QUnit.start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do QUnit.start(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { do { QUnit.start(); } while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) QUnit.start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (;;) { QUnit.start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) QUnit.start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i in x) { QUnit.start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) QUnit.start(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function () { for (i of x) { QUnit.start(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "start()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },

        // assert.async()
        {
            code: "test('name', function (assert) { while (false) assert.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "test('name', function (this: LocalTestContext, assert) { while (false) assert.async(); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', (assert) => { while (false) assert.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { while (false) { assert.async(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { do assert.async(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { do { assert.async(); } while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { for (;;) assert.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { for (;;) { assert.async(); } });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { for (i in x) assert.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (assert) { for (i of x) assert.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "assert.async()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },

        // assert.async() with other assert context variable
        {
            code: "test('name', function (foo) { while (false) foo.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "foo.async()",
                        loopTypeText: "while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (foo) { do foo.async(); while (false); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "foo.async()",
                        loopTypeText: "do-while loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (foo) { for (;;) foo.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "foo.async()",
                        loopTypeText: "for loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (foo) { for (i in {}) foo.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "foo.async()",
                        loopTypeText: "for-in loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test('name', function (foo) { for (i of {}) foo.async(); });",
            errors: [
                {
                    messageId: "unexpectedAsyncInLoop",
                    data: {
                        call: "foo.async()",
                        loopTypeText: "for-of loop",
                    },
                    type: "CallExpression",
                },
            ],
        },
    ],
});
