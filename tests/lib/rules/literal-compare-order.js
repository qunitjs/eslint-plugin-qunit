/**
 * @fileoverview Check the location of literals in arguments to QUnit's assertion functions.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/literal-compare-order"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("literal-compare-order", rule, {
    valid: [
        // equal
        testUtils.wrapInTest("equal(variable, 'Literal');"),
        testUtils.wrapInTest("equal(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.equal(variable, 'Literal');"),
        testUtils.wrapInTest("assert.equal(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("equal();"), // avoid crash with missing arguments
        testUtils.wrapInTest("equal(variable);"), // avoid crash with missing arguments

        // strictEqual
        testUtils.wrapInTest("strictEqual(variable, 'Literal');"),
        testUtils.wrapInTest("strictEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.strictEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.strictEqual(variable, 'Literal', 'Message');",
        ),

        // deepEqual
        testUtils.wrapInTest("deepEqual(variable, 'Literal');"),
        testUtils.wrapInTest("deepEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.deepEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.deepEqual(variable, 'Literal', 'Message');",
        ),

        // propEqual
        testUtils.wrapInTest("propEqual(variable, 'Literal');"),
        testUtils.wrapInTest("propEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.propEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.propEqual(variable, 'Literal', 'Message');",
        ),

        // notEqual
        testUtils.wrapInTest("notEqual(variable, 'Literal');"),
        testUtils.wrapInTest("notEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.notEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.notEqual(variable, 'Literal', 'Message');",
        ),

        // notStrictEqual
        testUtils.wrapInTest("notStrictEqual(variable, 'Literal');"),
        testUtils.wrapInTest("notStrictEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.notStrictEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.notStrictEqual(variable, 'Literal', 'Message');",
        ),

        // notDeepEqual
        testUtils.wrapInTest("notDeepEqual(variable, 'Literal');"),
        testUtils.wrapInTest("notDeepEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.notDeepEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.notDeepEqual(variable, 'Literal', 'Message');",
        ),

        // notPropEqual
        testUtils.wrapInTest("notPropEqual(variable, 'Literal');"),
        testUtils.wrapInTest("notPropEqual(variable, 'Literal', 'Message');"),
        testUtils.wrapInTest("assert.notPropEqual(variable, 'Literal');"),
        testUtils.wrapInTest(
            "assert.notPropEqual(variable, 'Literal', 'Message');",
        ),

        // avoid crash in BDD-style assertions
        "QUnit.test('Name', function() { expect(variable).to.equal('Literal'); });",

        "QUnit.test('Name', function() { router.on('routerDidChange', () => {}); });",
    ],
    invalid: [
        // equal
        {
            code: testUtils.wrapInTest("equal('Literal', variable);"),
            output: testUtils.wrapInTest("equal(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: testUtils.wrapInTest(
                "QUnit.test('test', (this: LocalTestContext) => { equal('Literal', variable); });",
            ),
            output: testUtils.wrapInTest(
                "QUnit.test('test', (this: LocalTestContext) => { equal(variable, 'Literal'); });",
            ),
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "equal('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "equal(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.equal('Literal', variable);"),
            output: testUtils.wrapInTest("assert.equal(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInArrowTest(
                "assert.equal('Literal', variable);",
            ),
            output: testUtils.wrapInArrowTest(
                "assert.equal(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.equal('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.equal(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // strictEqual
        {
            code: testUtils.wrapInTest("strictEqual('Literal', variable);"),
            output: testUtils.wrapInTest("strictEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "strictEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "strictEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.strictEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.strictEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.strictEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.strictEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // deepEqual
        {
            code: testUtils.wrapInTest("deepEqual('Literal', variable);"),
            output: testUtils.wrapInTest("deepEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "deepEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "deepEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.deepEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.deepEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.deepEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.deepEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // propEqual
        {
            code: testUtils.wrapInTest("propEqual('Literal', variable);"),
            output: testUtils.wrapInTest("propEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "propEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "propEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.propEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.propEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.propEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.propEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // notEqual
        {
            code: testUtils.wrapInTest("notEqual('Literal', variable);"),
            output: testUtils.wrapInTest("notEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "notEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "notEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notEqual('Literal', variable);"),
            output: testUtils.wrapInTest(
                "assert.notEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.notEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // notStrictEqual
        {
            code: testUtils.wrapInTest("notStrictEqual('Literal', variable);"),
            output: testUtils.wrapInTest(
                "notStrictEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "notStrictEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "notStrictEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notStrictEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.notStrictEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notStrictEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.notStrictEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // notDeepEqual
        {
            code: testUtils.wrapInTest("notDeepEqual('Literal', variable);"),
            output: testUtils.wrapInTest("notDeepEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "notDeepEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "notDeepEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notDeepEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.notDeepEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notDeepEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.notDeepEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },

        // notPropEqual
        {
            code: testUtils.wrapInTest("notPropEqual('Literal', variable);"),
            output: testUtils.wrapInTest("notPropEqual(variable, 'Literal');"),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "notPropEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "notPropEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notPropEqual('Literal', variable);",
            ),
            output: testUtils.wrapInTest(
                "assert.notPropEqual(variable, 'Literal');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest(
                "assert.notPropEqual('Literal', variable, 'message');",
            ),
            output: testUtils.wrapInTest(
                "assert.notPropEqual(variable, 'Literal', 'message');",
            ),
            errors: [
                {
                    messageId: "actualFirst",
                    data: {
                        expected: "'Literal'",
                        actual: "variable",
                    },
                },
            ],
        },
    ],
});
