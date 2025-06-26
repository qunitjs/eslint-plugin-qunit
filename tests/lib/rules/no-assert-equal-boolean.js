"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-assert-equal-boolean"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-assert-equal-boolean", rule, {
    valid: [
        // assert param
        "QUnit.test('Name', function (assert) { assert.equal(a, b); });",
        "QUnit.test('Name', function (assert) { assert.strictEqual(a, b); });",
        "QUnit.test('Name', function (assert) { assert.deepEqual(a, b); });",

        // non-standard assert param
        "QUnit.test('Name', function (foo) { foo.equal(a, b); });",
        "QUnit.test('Name', function (foo) { foo.strictEqual(a, b); });",
        "QUnit.test('Name', function (foo) { foo.deepEqual(a, b); });",

        // assert param but using global assert
        "QUnit.test('Name', function (assert) { equal(a, b); });",
        "QUnit.test('Name', function (assert) { strictEqual(a, b); });",
        "QUnit.test('Name', function (assert) { deepEqual(a, b); });",

        // Using global assert
        "QUnit.test('Name', function () { equal(a, b); });",
        "QUnit.test('Name', function () { strictEqual(a, b); });",
        "QUnit.test('Name', function () { deepEqual(a, b); });",

        // boolean as message parameter should be ignored
        "QUnit.test('Name', function (assert) { assert.equal(a, b, true); });",
        "QUnit.test('Name', function (assert) { assert.equal(a, b, false); });",

        // non-boolean literals allowed
        "QUnit.test('Name', function (assert) { assert.equal(a, 123); });",

        // booleans allowed with other assertion functions
        "QUnit.test('Name', function (assert) { assert.true(true); });",
        "QUnit.test('Name', function (assert) { assert.false(false); });",
        "QUnit.test('Name', function (assert) { assert.notEqual(a, true); });",
        "QUnit.test('Name', function (assert) { assert.notStrictEqual(a, true); });",
        "QUnit.test('Name', function (assert) { assert.notDeepEqual(a, true); });",
        "QUnit.test('Name', function (assert) { assert.notPropEqual(a, false); });",
        "QUnit.test('Name', function (assert) { assert.propEqual(a, true); });",

        // not within test context
        "equal(a, true);",
    ],

    invalid: [
        // assert param
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(a, true); });",
            output: "QUnit.test('Name', function (assert) { assert.true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', (assert) => { assert.equal(a, true); });",
            output: "QUnit.test('Name', (assert) => { assert.true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(a, false); });",
            output: "QUnit.test('Name', function (assert) { assert.false(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // deepEqual
        {
            code: "QUnit.test('Name', function (assert) { assert.deepEqual(a, true); });",
            output: "QUnit.test('Name', function (assert) { assert.true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // strictEqual
        {
            code: "QUnit.test('Name', function (assert) { assert.strictEqual(a, true); });",
            output: "QUnit.test('Name', function (assert) { assert.true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // with message param
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(a, true, 'msg'); });",
            output: "QUnit.test('Name', function (assert) { assert.true(a, 'msg'); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // Boolean as first parameter
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(true, b); });",
            output: "QUnit.test('Name', function (assert) { assert.true(b); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(false, b); });",
            output: "QUnit.test('Name', function (assert) { assert.false(b); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // multiple booleans
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(true, true); });",
            output: "QUnit.test('Name', function (assert) { assert.true(true); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(false, true); });",
            output: "QUnit.test('Name', function (assert) { assert.false(true); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(true, false); });",
            output: "QUnit.test('Name', function (assert) { assert.true(false); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(false, false); });",
            output: "QUnit.test('Name', function (assert) { assert.false(false); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // non-standard assert param
        {
            code: "QUnit.test('Name', function (foo) { foo.equal(true, b); });",
            output: "QUnit.test('Name', function (foo) { foo.true(b); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // assert param but using global assert
        {
            code: "QUnit.test('Name', function (assert) { equal(a, true); });",
            output: "QUnit.test('Name', function (assert) { true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // using global assert
        {
            code: "QUnit.test('Name', function () { equal(a, true); });",
            output: "QUnit.test('Name', function () { true(a); });",
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },

        // TypeScript: test callback is adding a type to `this`
        {
            code: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.equal(a, true); });",
            output: "QUnit.test('Name', function (this: LocalTestContext, assert) { assert.true(a); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [{ messageId: "useAssertTrueOrFalse" }],
        },
    ],
});
