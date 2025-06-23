/**
 * @fileoverview Check the number of arguments to QUnit's assertion functions.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/assert-args"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("assert-args", rule, {
    valid: [
        // ok
        testUtils.wrapInTest("ok(result);"),
        testUtils.wrapInTest("ok(result, 'Result is true');"),
        testUtils.wrapInTest("ok(obj[key], key + ' value is true');"),
        testUtils.wrapInTest("assert.ok(result);"),
        testUtils.wrapInTest("assert.ok(result, 'Result is true');"),
        testUtils.wrapInTest("assert.ok(obj[key], key + ' value is true');"),

        // equal
        testUtils.wrapInTest("equal(result, expected);"),
        testUtils.wrapInTest("equal(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "equal(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.equal(result, expected);"),
        testUtils.wrapInTest("assert.equal(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "assert.equal(obj[key], expected, key + ' value is true');",
        ),

        // false
        testUtils.wrapInTest("assert.false(result);"),
        testUtils.wrapInTest("assert.false(result, 'Message');"),

        // strictEqual
        testUtils.wrapInTest("strictEqual(result, expected);"),
        testUtils.wrapInTest("strictEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "strictEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.strictEqual(result, expected);"),
        testUtils.wrapInTest(
            "assert.strictEqual(result, expected, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.strictEqual(obj[key], expected, key + ' value is true');",
        ),

        // deepEqual
        testUtils.wrapInTest("deepEqual(result, expected);"),
        testUtils.wrapInTest("deepEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "deepEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.deepEqual(result, expected);"),
        testUtils.wrapInTest("assert.deepEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "assert.deepEqual(obj[key], expected, key + ' value is true');",
        ),

        // propEqual
        testUtils.wrapInTest("propEqual(result, expected);"),
        testUtils.wrapInTest("propEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "propEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.propEqual(result, expected);"),
        testUtils.wrapInTest("assert.propEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "assert.propEqual(obj[key], expected, key + ' value is true');",
        ),

        // raises
        testUtils.wrapInTest("raises(function () {});"),
        testUtils.wrapInTest("raises(function () {}, 'Message');"),
        testUtils.wrapInTest("raises(function () {}, expectedMessage);"),
        testUtils.wrapInTest("raises(function () {}, TypeError, 'Message');"),
        testUtils.wrapInTest("raises(function () {}, /error/, 'Message');"),
        testUtils.wrapInTest("raises(function () {}, 'Error', 'Message');"),
        testUtils.wrapInTest(
            "raises(function () {}, TypeError, expectedMessage);",
        ),
        testUtils.wrapInTest("assert.raises(function () {}, 'Message');"),
        testUtils.wrapInTest(
            "assert.raises(function () {}, TypeError, 'Message');",
        ),
        testUtils.wrapInTest("assert.raises(function () {}, expectedMessage);"),
        testUtils.wrapInTest(
            "assert.raises(function () {}, /error/, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.raises(function () {}, 'Error', 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.raises(function () {}, TypeError, expectedMessage);",
        ),

        // throws
        testUtils.wrapInTest("throws(function () {});"),
        testUtils.wrapInTest("throws(function () {}, 'Message');"),
        testUtils.wrapInTest("throws(function () {}, expectedMessage);"),
        testUtils.wrapInTest("throws(function () {}, TypeError, 'Message');"),
        testUtils.wrapInTest("throws(function () {}, /error/, 'Message');"),
        testUtils.wrapInTest("throws(function () {}, 'Error', 'Message');"),
        testUtils.wrapInTest(
            "throws(function () {}, TypeError, expectedMessage);",
        ),
        testUtils.wrapInTest("assert.throws(function () {}, 'Message');"),
        testUtils.wrapInTest(
            "assert.throws(function () {}, TypeError, 'Message');",
        ),
        testUtils.wrapInTest("assert.throws(function () {}, expectedMessage);"),
        testUtils.wrapInTest(
            "assert.throws(function () {}, /error/, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.throws(function () {}, 'Error', 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.throws(function () {}, TypeError, expectedMessage);",
        ),

        // true
        testUtils.wrapInTest("assert.true(result);"),
        testUtils.wrapInTest("assert.true(result, 'Message');"),

        // notOk
        testUtils.wrapInTest("notOk(result);"),
        testUtils.wrapInTest("notOk(result, 'Result is true');"),
        testUtils.wrapInTest("notOk(obj[key], key + ' value is true');"),
        testUtils.wrapInTest("assert.notOk(result);"),
        testUtils.wrapInTest("assert.notOk(result, 'Result is true');"),
        testUtils.wrapInTest("assert.notOk(obj[key], key + ' value is true');"),

        // notEqual
        testUtils.wrapInTest("notEqual(result, expected);"),
        testUtils.wrapInTest("notEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "notEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.notEqual(result, expected);"),
        testUtils.wrapInTest("assert.notEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "assert.notEqual(obj[key], expected, key + ' value is true');",
        ),

        // notStrictEqual
        testUtils.wrapInTest("notStrictEqual(result, expected);"),
        testUtils.wrapInTest("notStrictEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "notStrictEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.notStrictEqual(result, expected);"),
        testUtils.wrapInTest(
            "assert.notStrictEqual(result, expected, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.notStrictEqual(obj[key], expected, key + ' value is true');",
        ),

        // notDeepEqual
        testUtils.wrapInTest("notDeepEqual(result, expected);"),
        testUtils.wrapInTest("notDeepEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "notDeepEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.notDeepEqual(result, expected);"),
        testUtils.wrapInTest(
            "assert.notDeepEqual(result, expected, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.notDeepEqual(obj[key], expected, key + ' value is true');",
        ),

        // notPropEqual
        testUtils.wrapInTest("notPropEqual(result, expected);"),
        testUtils.wrapInTest("notPropEqual(result, expected, 'Message');"),
        testUtils.wrapInTest(
            "notPropEqual(obj[key], expected, key + ' value is true');",
        ),
        testUtils.wrapInTest("assert.notPropEqual(result, expected);"),
        testUtils.wrapInTest(
            "assert.notPropEqual(result, expected, 'Message');",
        ),
        testUtils.wrapInTest(
            "assert.notPropEqual(obj[key], expected, key + ' value is true');",
        ),

        // not actually assertions
        testUtils.wrapInTest("notAnAssertion(result, expected);"),
        testUtils.wrapInTest("getAssertion()(result, expected);"),

        // Object prototype properties (also not actually assertions)
        testUtils.wrapInTest("hasOwnProperty('prop');"),
        testUtils.wrapInTest("assert.hasOwnProperty('prop');"),

        // unwrapped
        "notAnAssertion(result, expected);",
    ],

    invalid: [
        // ok
        {
            code: testUtils.wrapInTest("ok();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "ok",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("ok(a, b);"),
            errors: ["Unexpected call to ok with 2 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("ok(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "ok",
                        argCount: 3,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.ok();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.ok",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('test', (this: LocalTestContext, assert) => { assert.ok(); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.ok",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.ok(a, b);"),
            errors: ["Unexpected call to assert.ok with 2 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.ok(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.ok",
                        argCount: 3,
                    },
                },
            ],
        },

        // equal
        {
            code: testUtils.wrapInTest("equal();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "equal",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("equal(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "equal",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("equal(a, b, c);"),
            errors: ["Unexpected call to equal with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("equal(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "equal",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.equal();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.equal",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.equal(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.equal",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.equal(a, b, c);"),
            errors: ["Unexpected call to assert.equal with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.equal(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.equal",
                        argCount: 4,
                    },
                },
            ],
        },

        // false
        {
            code: testUtils.wrapInTest("assert.false();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.false",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.false(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.false",
                        argCount: 3,
                    },
                },
            ],
        },

        // true
        {
            code: testUtils.wrapInTest("assert.true();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.true",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.true(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.true",
                        argCount: 3,
                    },
                },
            ],
        },

        // strictEqual
        {
            code: testUtils.wrapInTest("strictEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "strictEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("strictEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "strictEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("strictEqual(a, b, c);"),
            errors: ["Unexpected call to strictEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("strictEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "strictEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.strictEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.strictEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInArrowTest("assert.strictEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.strictEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.strictEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.strictEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.strictEqual(a, b, c);"),
            errors: ["Unexpected call to assert.strictEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.strictEqual(a, b, c, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.strictEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // deepEqual
        {
            code: testUtils.wrapInTest("deepEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "deepEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("deepEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "deepEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("deepEqual(a, b, c);"),
            errors: ["Unexpected call to deepEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("deepEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "deepEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.deepEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.deepEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.deepEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.deepEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.deepEqual(a, b, c);"),
            errors: ["Unexpected call to assert.deepEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.deepEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.deepEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // propEqual
        {
            code: testUtils.wrapInTest("propEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "propEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("propEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "propEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("propEqual(a, b, c);"),
            errors: ["Unexpected call to propEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("propEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "propEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.propEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.propEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.propEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.propEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.propEqual(a, b, c);"),
            errors: ["Unexpected call to assert.propEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.propEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.propEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // raises
        {
            code: testUtils.wrapInTest("raises();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "raises",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("raises(function () {}, TypeError, blah);"),
            errors: ["Unexpected call to raises with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "raises(function () {}, TypeError, blah, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "raises",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.raises();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.raises",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.raises(function () {}, TypeError, blah);"),
            errors: ["Unexpected call to assert.raises with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.raises(function () {}, TypeError, blah, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.raises",
                        argCount: 4,
                    },
                },
            ],
        },

        // throws
        {
            code: testUtils.wrapInTest("throws();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "throws",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("throws(function () {}, TypeError, blah);"),
            errors: ["Unexpected call to throws with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "throws(function () {}, TypeError, blah, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "throws",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.throws();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.throws",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.throws(function () {}, TypeError, blah);"),
            errors: ["Unexpected call to assert.throws with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.throws(function () {}, TypeError, blah, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.throws",
                        argCount: 4,
                    },
                },
            ],
        },

        // notOk
        {
            code: testUtils.wrapInTest("notOk();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notOk",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("notOk(a, b);"),
            errors: ["Unexpected call to notOk with 2 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("notOk(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "notOk",
                        argCount: 3,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notOk();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notOk",
                        argCount: 0,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.notOk(a, b);"),
            errors: ["Unexpected call to assert.notOk with 2 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.notOk(a, b, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.notOk",
                        argCount: 3,
                    },
                },
            ],
        },

        // notEqual
        {
            code: testUtils.wrapInTest("notEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("notEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("notEqual(a, b, c);"),
            errors: ["Unexpected call to notEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("notEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "notEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.notEqual(a, b, c);"),
            errors: ["Unexpected call to assert.notEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("assert.notEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.notEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // notStrictEqual
        {
            code: testUtils.wrapInTest("notStrictEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notStrictEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("notStrictEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notStrictEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("notStrictEqual(a, b, c);"),
            errors: ["Unexpected call to notStrictEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("notStrictEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "notStrictEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notStrictEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notStrictEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notStrictEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notStrictEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.notStrictEqual(a, b, c);"),
            errors: ["Unexpected call to assert.notStrictEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.notStrictEqual(a, b, c, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.notStrictEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // notDeepEqual
        {
            code: testUtils.wrapInTest("notDeepEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notDeepEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("notDeepEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notDeepEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("notDeepEqual(a, b, c);"),
            errors: ["Unexpected call to notDeepEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("notDeepEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "notDeepEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notDeepEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notDeepEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notDeepEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notDeepEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.notDeepEqual(a, b, c);"),
            errors: ["Unexpected call to assert.notDeepEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.notDeepEqual(a, b, c, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.notDeepEqual",
                        argCount: 4,
                    },
                },
            ],
        },

        // notPropEqual
        {
            code: testUtils.wrapInTest("notPropEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notPropEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("notPropEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "notPropEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("notPropEqual(a, b, c);"),
            errors: ["Unexpected call to notPropEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest("notPropEqual(a, b, c, 'Message');"),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "notPropEqual",
                        argCount: 4,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notPropEqual();"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notPropEqual",
                        argCount: 0,
                    },
                },
            ],
        },
        {
            code: testUtils.wrapInTest("assert.notPropEqual(a);"),
            errors: [
                {
                    messageId: "unexpectedArgCountNoMessage",
                    data: {
                        callee: "assert.notPropEqual",
                        argCount: 1,
                    },
                },
            ],
        },
        /* Allowed for now.
        {
            code: testUtils.wrapInTest("assert.notPropEqual(a, b, c);"),
            errors: ["Unexpected call to assert.notPropEqual with 3 arguments and no error message."]
        },
        */
        {
            code: testUtils.wrapInTest(
                "assert.notPropEqual(a, b, c, 'Message');",
            ),
            errors: [
                {
                    messageId: "unexpectedArgCount",
                    data: {
                        callee: "assert.notPropEqual",
                        argCount: 4,
                    },
                },
            ],
        },
    ],
});
