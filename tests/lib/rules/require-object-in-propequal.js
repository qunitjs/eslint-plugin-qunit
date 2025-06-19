/**
 * @fileoverview Enforce use of objects as expected values in `assert.propEqual`
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-object-in-propequal"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {string} assertionCode
 * @param {string} invalidValue
 * @returns {{code: string, errors: {messageId: string, data: Record<string, string>}[]}}
 */
function createInvalid(assertionCode, invalidValue) {
    return {
        code: testUtils.wrapInTest(assertionCode),
        errors: [
            {
                messageId: "useObject",
                data: {
                    value: invalidValue,
                },
            },
        ],
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: { jsx: true },
    },
});

ruleTester.run("require-object-in-propequal", rule, {
    valid: [
        // Object expressions/array expressions
        testUtils.wrapInTest("assert.propEqual(actual, { foo: 'bar' });"),
        testUtils.wrapInTest("assert.propEqual(actual, ['string']);"),

        // Identifiers, member expressions, calls, and new expressions are fine
        testUtils.wrapInTest("assert.propEqual(actual, someVar);"),
        testUtils.wrapInTest("assert.propEqual(actual, obj.prop);"),
        testUtils.wrapInTest("assert.propEqual(actual, func());"),
        testUtils.wrapInTest("assert.propEqual(actual, new Foo());"),

        // this is fine
        testUtils.wrapInTest("assert.propEqual(actual, this);"),

        // Global assertion
        testUtils.wrapInTest("propEqual(actual, { foo: 'bar' });"),

        // Not propEqual
        testUtils.wrapInTest("assert.deepEqual(actual, { foo: 'bar' });"),
        testUtils.wrapInTest("assert.deepEqual(actual, 0);"),
        testUtils.wrapInTest("assert.deepEqual(actual, -1);"),
        testUtils.wrapInTest("assert.deepEqual(actual, 'string');"),
        testUtils.wrapInTest("assert.deepEqual(actual, `template`);"),
        testUtils.wrapInTest("assert.deepEqual(actual, true);"),
        testUtils.wrapInTest("assert.deepEqual(actual, false);"),
        testUtils.wrapInTest("assert.deepEqual(actual, null);"),
        testUtils.wrapInTest("assert.deepEqual(actual, /regex/);"),
        testUtils.wrapInTest("assert.deepEqual(actual, ++foo);"),
        testUtils.wrapInTest("assert.deepEqual(actual, foo++);"),
        testUtils.wrapInTest("assert.deepEqual(actual, --foo);"),
        testUtils.wrapInTest("assert.deepEqual(actual, foo--);"),
        testUtils.wrapInTest("assert.deepEqual(actual, <JSX />);"),

        testUtils.wrapInTest("assert.deepEqual(actual, 0n);"),

        testUtils.wrapInTest("assert.propEqual(actual, foo?.bar);"),
        testUtils.wrapInTest("assert.propEqual(actual, foo?.bar?.());"),
    ],

    invalid: [
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, 0);"),
            "0",
        ),
        createInvalid(
            testUtils.wrapInArrowTest("assert.propEqual(actual, 0);"),
            "0",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, -1);"),
            "-1",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, 'string');"),
            "'string'",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, `template`);"),
            "`template`",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, true);"),
            "true",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, false);"),
            "false",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, null);"),
            "null",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, /regex/);"),
            "/regex/",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, ++foo);"),
            "++foo",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, foo++);"),
            "foo++",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, --foo);"),
            "--foo",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, foo--);"),
            "foo--",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, <JSX />)"),
            "<JSX />",
        ),
        createInvalid(
            testUtils.wrapInTest("assert.propEqual(actual, 0n);"),
            "0n",
        ),
    ],
});
