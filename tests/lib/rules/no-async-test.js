/**
 * @fileoverview Forbid the use of asyncTest and QUnit.asyncTest.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-async-test"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-async-test", rule, {
    valid: [
        "QUnit.test('a test', function () { });",
        "QUnit.test('a test', function () { var done = assert.async(); done(); });",
    ],

    invalid: [
        {
            code: "asyncTest('a test', function () { });",
            errors: [
                {
                    messageId: "unexpectedAsyncTest",
                },
            ],
        },
        {
            code: "QUnit.asyncTest('a test', function () { });",
            errors: [
                {
                    messageId: "unexpectedAsyncTest",
                },
            ],
        },
    ],
});
