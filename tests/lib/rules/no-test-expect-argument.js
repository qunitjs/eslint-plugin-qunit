/**
 * @fileoverview forbid expect argument in QUnit.test
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-test-expect-argument"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-test-expect-argument", rule, {
    valid: [
        // No expect at all is allowed (see "require-expect")
        "test('test name', function () { });",
        "QUnit.test('test name', function () { });",
        "asyncTest('test name', function () { });",
        "QUnit.asyncTest('test name', function () { });",

        // Global expect() okay by this rule (see "no-global-expect")
        "test('test name', function () { expect(0); });",
        "QUnit.test('test name', function () { expect(0); });",
        "asyncTest('test name', function () { expect(0); });",
        "QUnit.asyncTest('test name', function () { expect(0); });",

        // assert.expect() preferred
        "test('test name', function (assert) { assert.expect(0); });",
        "QUnit.test('test name', function (assert) { assert.expect(0); });",
        "asyncTest('test name', function (assert) { assert.expect(0); });",
        "QUnit.asyncTest('test name', function (assert) { assert.expect(0); });",
    ],

    invalid: [
        {
            code: "test('test name', 0, function () { });",
            errors: [
                {
                    messageId: "noExpectArgument",
                    data: {
                        callee: "test",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('test name', 0, function () { });",
            errors: [
                {
                    messageId: "noExpectArgument",
                    data: {
                        callee: "QUnit.test",
                    },
                },
            ],
        },
        {
            code: "asyncTest('test name', 0, function () { });",
            errors: [
                {
                    messageId: "noExpectArgument",
                    data: {
                        callee: "asyncTest",
                    },
                },
            ],
        },
        {
            code: "QUnit.asyncTest('test name', 0, function () { });",
            errors: [
                {
                    messageId: "noExpectArgument",
                    data: {
                        callee: "QUnit.asyncTest",
                    },
                },
            ],
        },
    ],
});
