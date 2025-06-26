/**
 * @fileoverview forbid binary logical expressions in assert arguments
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-assert-logical-expression"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-assert-logical-expression", rule, {
    valid: [
        // Simple assertions
        testUtils.wrapInTest("assert.ok(foo);"),
        testUtils.wrapInTest("assert.equal(foo, bar);"),
        testUtils.wrapInTest("assert.false(foo);"),
        testUtils.wrapInTest("assert.strictEqual(foo, bar);"),
        testUtils.wrapInTest("assert.deepEqual(foo, bar);"),
        testUtils.wrapInTest("assert.propEqual(foo, bar);"),
        testUtils.wrapInTest("assert.notOk(foo);"),
        testUtils.wrapInTest("assert.notEqual(foo, bar);"),
        testUtils.wrapInTest("assert.notStrictEqual(foo, bar);"),
        testUtils.wrapInTest("assert.notDeepEqual(foo, bar);"),
        testUtils.wrapInTest("assert.notPropEqual(foo, bar);"),
        testUtils.wrapInTest("assert.raises(function () {}, /Message/);"),
        testUtils.wrapInTest("assert.throws(function () {}, /Message/);"),
        testUtils.wrapInTest("assert.true(foo);"),

        // Logical expressions inside raises/throw blocks are fine
        testUtils.wrapInTest(
            "assert.raises(function () { throw (foo || bar); });",
        ),
        testUtils.wrapInTest(
            "assert.throws(function () { throw (foo || bar); });",
        ),

        // Messages can have logical expressions.
        testUtils.wrapInTest(
            "assert.ok(foo, message || 'alternative message');",
        ),
        testUtils.wrapInTest(
            "assert.equal(foo, bar, message || 'alternative message');",
        ),

        // Not an assertion, not in a test
        "doSomething(foo && bar);",
    ],

    invalid: [
        {
            code: testUtils.wrapInTest("assert.ok(foo && bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 50,
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('test', (this: LocalTestContext, assert) => { assert.ok(foo && bar); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 68,
                },
            ],
        },
        {
            code: testUtils.wrapInArrowTest("assert.ok(foo && bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 44,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.ok(foo || bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 50,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notOk(foo && bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 53,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notOk(foo || bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 53,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.equal(foo && bar, baz && lol);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 53,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 65,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.equal(foo || bar, baz || lol);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 53,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 65,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.strictEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 59,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 71,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.strictEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 59,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 71,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.deepEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 57,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 69,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.deepEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 57,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 69,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.propEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 57,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 69,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.propEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 57,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 69,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 56,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 68,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 56,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 68,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notStrictEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 62,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 74,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notStrictEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 62,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 74,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notDeepEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 60,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 72,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notDeepEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 60,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 72,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notPropEqual(foo && bar, baz && lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 60,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 72,
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notPropEqual(foo || bar, baz || lol);",
            ),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 60,
                },
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "||",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 72,
                },
            ],
        },

        // Boolean assertions
        {
            code: testUtils.wrapInTest("assert.true(foo && bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 52,
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.false(foo && bar);"),
            errors: [
                {
                    messageId: "noLogicalOperator",
                    data: {
                        operator: "&&",
                    },
                    type: "LogicalExpression",
                    line: 1,
                    column: 53,
                },
            ],
        },
    ],
});
