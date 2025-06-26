/**
 * @fileoverview Forbid the use of assert.equal/assert.notEqual/assert.ok/notOk and suggest other assertions.
 * @author ventuno
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-loose-assertions"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-loose-assertions", rule, {
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
                    messageId: "unexpectedLocalLooseAssertion",
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
                    messageId: "unexpectedLocalLooseAssertion",
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
                    messageId: "unexpectedLocalLooseAssertion",
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
                    messageId: "unexpectedLocalLooseAssertion",
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
                    messageId: "unexpectedLocalLooseAssertion",
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
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "ok" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { notOk(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "notOk" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function () { ok(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "ok" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function () { notOk(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "notOk" },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { assert.equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "equal",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (foo) { foo.equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "equal",
                    },
                },
            ],
        },
        {
            code: "QUnit.test('Name', function (assert) { equal(a, b); });",
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "equal" },
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function (assert) {
                          assert.ok(a, b);
                          assert.notOk(a, b);
                          assert.equal(a, b);
                          assert.notEqual(a, b);
                      });
                  `,
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "ok",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "notOk",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "equal",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "notEqual",
                    },
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function (foo) {
                          foo.ok(a, b);
                          foo.notOk(a, b);
                          foo.equal(a, b);
                          foo.notEqual(a, b);
                      });
                  `,
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "ok",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "notOk",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "equal",
                    },
                },
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "notEqual",
                    },
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function () {
                          ok(a, b);
                          notOk(a, b);
                          equal(a, b);
                          notEqual(a, b);
                      });
                  `,
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "ok" },
                },
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "notOk" },
                },
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "equal" },
                },
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "notEqual" },
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function (assert) {
                          assert.ok(a, b);
                          assert.notOk(a, b);
                          assert.equal(a, b);
                      });
                  `,
            options: [["ok", { disallowed: "equal", recommended: ["ab"] }]],
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "assert",
                        assertion: "ok",
                    },
                },
                {
                    message: "Unexpected assert.equal. Use assert.ab.",
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function (foo) {
                          foo.ok(a, b);
                          foo.notOk(a, b);
                          foo.equal(a, b);
                      });
                  `,
            options: [["ok", { disallowed: "equal", recommended: ["ab"] }]],
            errors: [
                {
                    messageId: "unexpectedLocalLooseAssertion",
                    data: {
                        assertVar: "foo",
                        assertion: "ok",
                    },
                },
                {
                    message: "Unexpected foo.equal. Use foo.ab.",
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function () {
                          ok(a, b);
                          notOk(a, b);
                          equal(a, b);
                      });
                  `,
            options: [["ok", "equal"]],
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "ok" },
                },
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "equal" },
                },
            ],
        },
        {
            code: `
                      QUnit.test('Name', function () {
                          ok(a, b);
                          notOk(a, b);
                          equal(a, b);
                      });
                  `,

            // Extra "equal" and "ok" definitions to make sure they are properly ignored while parsing options
            options: [
                [
                    "ok",
                    { disallowed: "equal", recommended: ["ab"] },
                    "equal",
                    { disallowed: "ok", recommended: ["ab"] },
                ],
            ],
            errors: [
                {
                    messageId: "unexpectedGlobalLooseAssertion",
                    data: { assertion: "ok" },
                },
                {
                    message: "Unexpected equal. Use ab.",
                },
            ],
        },
    ],
});
