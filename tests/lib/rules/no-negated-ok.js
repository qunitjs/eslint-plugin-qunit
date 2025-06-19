/**
 * @fileoverview Forbid the use of negations in assert.ok/notOk.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-negated-ok"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Helper functions
//------------------------------------------------------------------------------

/**
 * @param {string} callee
 * @returns {{messageId: string, data: Record<string, string>}}
 */
function createError(callee) {
    return {
        messageId: "noNegationInOk",
        data: {
            callee,
        },
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-negated-ok", rule, {
    valid: [
        // ok
        testUtils.wrapInTest("ok(foo)"),
        testUtils.wrapInTest("ok(foo, 'message')"),
        testUtils.wrapInTest("assert.ok(foo)"),
        testUtils.wrapInTest("assert.ok(foo, 'message')"),

        // notOk
        testUtils.wrapInTest("assert.notOk(foo)"),
        testUtils.wrapInTest("assert.notOk(foo, 'message')"),

        // double negation is allowed
        testUtils.wrapInTest("ok(!!foo)"),
        testUtils.wrapInTest("ok(!!foo, 'message')"),
        testUtils.wrapInTest("assert.ok(!!foo)"),
        testUtils.wrapInTest("assert.ok(!!foo, 'message')"),
        testUtils.wrapInTest("assert.notOk(!!foo)"),
        testUtils.wrapInTest("assert.notOk(!!foo, 'message')"),

        // quadruple negation is allowed (but seriously?)
        testUtils.wrapInTest("ok(!!!!foo)"),
        testUtils.wrapInTest("ok(!!!!foo, 'message')"),
        testUtils.wrapInTest("assert.ok(!!!!foo)"),
        testUtils.wrapInTest("assert.ok(!!!!foo, 'message')"),
        testUtils.wrapInTest("assert.notOk(!!!!foo)"),
        testUtils.wrapInTest("assert.notOk(!!!!foo, 'message')"),

        // global ok with negation is accepted since there is no notOk
        testUtils.wrapInTest("ok(!foo)"),
        testUtils.wrapInTest("ok(!foo, 'message')"),

        // no such thing as global notOk, but want to make sure we don't flag
        testUtils.wrapInTest("notOk(!foo)"),
        testUtils.wrapInTest("notOk(!foo, 'message')"),

        // only logical negation should be reported
        testUtils.wrapInTest("ok(-foo)"),
        testUtils.wrapInTest("ok(~foo)"),
        testUtils.wrapInTest("assert.ok(-foo)"),
        testUtils.wrapInTest("assert.ok(~foo)"),
        testUtils.wrapInTest("assert.notOk(-foo)"),
        testUtils.wrapInTest("assert.notOk(~foo)"),

        // no arguments
        testUtils.wrapInTest("ok()"),
        testUtils.wrapInTest("assert.ok()"),
        testUtils.wrapInTest("assert.notOk()"),

        // different assertions can have negation
        testUtils.wrapInTest("equal(!a, true)"),

        // unknown objects in path
        testUtils.wrapInTest("assert.ok.foo(!a)"),
        testUtils.wrapInTest("foo.assert.ok(!a)"),
        testUtils.wrapInTest("foo.assert.bar.ok(!a)"),
        testUtils.wrapInTest("foo.assert.bar.ok.baz(!a)"),

        // Boolean assertions, no negation
        testUtils.wrapInTest("assert.true(foo)"),
        testUtils.wrapInTest("assert.true(foo, 'message')"),
        testUtils.wrapInTest("assert.false(foo)"),
        testUtils.wrapInTest("assert.false(foo, 'message')"),
    ],

    invalid: [
        // ok
        {
            code: testUtils.wrapInTest("assert.ok(!foo)"),
            output: testUtils.wrapInTest("assert.notOk(foo)"),
            errors: [createError("assert.ok")],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('test', (this: LocalTestContext, assert) => { assert.ok(!foo); });",
            output: "QUnit.test('test', (this: LocalTestContext, assert) => { assert.notOk(foo); });",
            parser: require.resolve("@typescript-eslint/parser"),
            errors: [createError("assert.ok")],
        },
        {
            code: testUtils.wrapInArrowTest("assert.ok(!foo)"),
            output: testUtils.wrapInArrowTest("assert.notOk(foo)"),
            parserOptions: { ecmaVersion: 6 },
            errors: [createError("assert.ok")],
        },

        // ok (with message)
        {
            code: testUtils.wrapInTest("assert.ok(!foo, 'message')"),
            output: testUtils.wrapInTest("assert.notOk(foo, 'message')"),
            errors: [createError("assert.ok")],
        },

        // notOk
        {
            code: testUtils.wrapInTest("assert.notOk(!foo)"),
            output: testUtils.wrapInTest("assert.ok(foo)"),
            errors: [createError("assert.notOk")],
        },
        {
            code: testUtils.wrapInTest("assert.notOk(!foo, 'message')"),
            output: testUtils.wrapInTest("assert.ok(foo, 'message')"),
            errors: [createError("assert.notOk")],
        },

        // triple negation is not allowed
        {
            code: testUtils.wrapInTest("assert.ok(!!!foo)"),
            output: testUtils.wrapInTest("assert.notOk(foo)"),
            errors: [createError("assert.ok")],
        },

        // triple negation is not allowed (with message)
        {
            code: testUtils.wrapInTest("assert.notOk(!!!foo)"),
            output: testUtils.wrapInTest("assert.ok(foo)"),
            errors: [createError("assert.notOk")],
        },

        // triple negation is not allowed (with notOk)
        {
            code: testUtils.wrapInTest("assert.notOk(!!!foo, 'message')"),
            output: testUtils.wrapInTest("assert.ok(foo, 'message')"),
            errors: [createError("assert.notOk")],
        },

        // true
        {
            code: testUtils.wrapInTest("assert.true(!foo)"),
            output: testUtils.wrapInTest("assert.false(foo)"),
            errors: [createError("assert.true")],
        },

        // false
        {
            code: testUtils.wrapInTest("assert.false(!foo)"),
            output: testUtils.wrapInTest("assert.true(foo)"),
            errors: [createError("assert.false")],
        },
    ],
});
