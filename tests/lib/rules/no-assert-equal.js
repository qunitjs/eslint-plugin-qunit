/**
 * @fileoverview Forbid the use of assert.equal and suggest other assertions.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-assert-equal"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-assert-equal", rule, {
    valid: [
        "QUnit.test('Name', function (assert) { assert.strictEqual(a, b); });",
        "QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });",
        "QUnit.test('Name', function (assert) { assert.propEqual(a, b); });",
        "QUnit.test('Name', function (foo) { foo.strictEqual(a, b); });",
        "QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });",
        "QUnit.test('Name', function (foo) { foo.propEqual(a, b); });",
        "QUnit.test('Name', function (assert) { strictEqual(a, b); });",
        "QUnit.test('Name', function (assert) { deepEqual(a, b); });",
        "QUnit.test('Name', function (assert) { propEqual(a, b); });",
        "QUnit.test('Name', function () { strictEqual(a, b); });",
        "QUnit.test('Name', function () { deepEqual(a, b); });",
        "QUnit.test('Name', function () { propEqual(a, b); });",
        "QUnit.test('Name', notAFunction);",

        // global `equal` but not within test context
        {
            code: "equal(a, b);",
            languageOptions: { globals: { equal: true } },
        },

        // `equal` but not the global
        "function equal(a,b) {}; QUnit.test('Name', function () { equal(a, b); });",
    ],

    invalid: [
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedAssertEqual",
                    data: { assertVar: "assert" },
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', function (assert) { assert.propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', function (assert) { assert.strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            code: "QUnit.test('Name', (assert) => { assert.equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedAssertEqual",
                    data: { assertVar: "assert" },
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', (assert) => { assert.deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', (assert) => { assert.propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', (assert) => { assert.strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (foo) { foo.equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedAssertEqual",
                    data: { assertVar: "foo" },
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', function (foo) { foo.propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', function (foo) { foo.strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { equal(a, b); });",
            languageOptions: { globals: { equal: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalEqual",
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', function (assert) { deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', function (assert) { propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', function (assert) { strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            code: "QUnit.test('Name', function () { equal(a, b); });",
            languageOptions: { globals: { equal: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalEqual",
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', function () { deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', function () { propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', function () { strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.equal(a, b); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "unexpectedAssertEqual",
                    data: { assertVar: "assert" },
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.deepEqual(a, b); });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.propEqual(a, b); });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.strictEqual(a, b); });",
                        },
                    ],
                },
            ],
        },
        {
            // assert.equal in module hooks
            code: "QUnit.module('My module', { before: function (assert) { assert.equal(1, 1); } });",
            parser: require.resolve("@typescript-eslint/parser"),
            errors: [
                {
                    messageId: "unexpectedAssertEqual",
                    data: { assertVar: "assert" },
                    suggestions: [
                        {
                            messageId: "switchToDeepEqual",
                            output: "QUnit.module('My module', { before: function (assert) { assert.deepEqual(1, 1); } });",
                        },
                        {
                            messageId: "switchToPropEqual",
                            output: "QUnit.module('My module', { before: function (assert) { assert.propEqual(1, 1); } });",
                        },
                        {
                            messageId: "switchToStrictEqual",
                            output: "QUnit.module('My module', { before: function (assert) { assert.strictEqual(1, 1); } });",
                        },
                    ],
                },
            ],
        },
    ],
});
