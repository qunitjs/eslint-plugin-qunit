/**
 * @fileoverview Forbid the use of assert.ok/notOk and suggest other assertions.
 * @author ventuno
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-assert-ok"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-assert-ok", rule, {
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

        // equal is not within test context
        "equal(a, b);",
    ],

    invalid: [
        {
            code: "QUnit.test('Name', function (assert) { assert.ok(a); });",
            errors: [
                {
                    messageId: "unexpectedLocalOkNotOk",
                    data: {
                        assertVar: "assert",
                        assertion: "ok",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', (assert) => { assert.ok(a); });",
            errors: [
                {
                    messageId: "unexpectedLocalOkNotOk",
                    data: {
                        assertVar: "assert",
                        assertion: "ok",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (foo) { foo.ok(a); });",
            errors: [
                {
                    messageId: "unexpectedLocalOkNotOk",
                    data: {
                        assertVar: "foo",
                        assertion: "ok",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.notOk(a); });",
            errors: [
                {
                    messageId: "unexpectedLocalOkNotOk",
                    data: {
                        assertVar: "assert",
                        assertion: "notOk",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (foo) { foo.notOk(a); });",
            errors: [
                {
                    messageId: "unexpectedLocalOkNotOk",
                    data: {
                        assertVar: "foo",
                        assertion: "notOk",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { ok(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalOkNotOk",
                    data: { assertion: "ok" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { notOk(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalOkNotOk",
                    data: { assertion: "notOk" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function () { ok(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalOkNotOk",
                    data: { assertion: "ok" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function () { notOk(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalOkNotOk",
                    data: { assertion: "notOk" },
                },
            ],
        },
    ],
});
