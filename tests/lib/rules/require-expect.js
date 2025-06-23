/**
 * @fileoverview Require the use of `expect` when using `assert` inside of a
 * block or when passing `assert` to a function.
 * @author Mitch Lloyd
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-expect"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
    returnAndIndent = "\n        ";

function alwaysErrorMessage(expectCallName) {
    return {
        messageId: "expectRequired",
        data: {
            expect: expectCallName,
        },
    };
}

function exceptSimpleErrorMessage(expectCallName) {
    return {
        messageId: "expectRequiredComplexTest",
        data: {
            expect: expectCallName,
        },
    };
}

function neverErrorMessage(expectCallName) {
    return {
        messageId: "expectForbidden",
        data: {
            expect: expectCallName,
        },
    };
}

ruleTester.run("require-expect", rule, {
    valid: [
        // default, calling expect is valid
        {
            code: "test('name', function(assert) { assert.expect(0) });",
            options: [], // Defaults to never-except-zero
        },

        // default, using global expect
        {
            code: "test('name', function() { expect(0) });",
            options: [], // Defaults to never-except-zero
        },

        // default, using global expect, TS
        {
            // TypeScript: test callback is adding a type to `this`
            code: "test('name', function(this: LocalTestContext) { expect(0) });",
            options: [], // Defaults to never-except-zero
            languageOptions: { parser: require("@typescript-eslint/parser") },
        },

        // CallExpression without parent object throws no errors
        {
            code: "test('name', function(assert) { assert.expect(0); noParentObject() });",
            options: [], // Defaults to never-except-zero
        },
        {
            code: "test('name', function(assert) { assert.expect(0); noParentObject() });",
            options: ["always"],
        },
        {
            // With arrow function
            code: "test('name', assert => { assert.expect(0); noParentObject() });",
            options: ["always"],
        },

        // assert at top of test context is ok
        {
            code: "test('name', function(assert) { assert.ok(true) });",
            options: ["except-simple"],
        },
        {
            code: "test('name', function(assert) { assert.ok(true) });",
            options: [], // Defaults to never-except-zero
        },

        // global assertion at top of test context is ok
        {
            code: "test('name', function() { ok(true) });",
            options: ["except-simple"],
        },

        // assert in block with expect at the top of test context is ok
        {
            code: "test('name', function(assert) { assert.expect(0); if (false) { assert.ok(false) } });",
            options: ["except-simple"],
        },

        // global assertion in block with expect at the top of test context is ok
        {
            code: "test('name', function() { expect(0); if (false) { ok(false) } });",
            options: ["except-simple"],
        },

        // nested modules
        {
            code: [
                "module('a', function() {",
                "    test('a - test', function(assert) {",
                "        assert.ok(true, 'no expect needed');",
                "    });",
                "",
                "    module('b', function() {",
                "        test('b - test', function() {",
                "            ok(true, 'still no expect needed');",
                "        });",
                "    });",
                "});",
            ].join(returnAndIndent),
            options: ["except-simple"],
        },

        // "except-simple" (with arrow function)
        {
            code: "test('name', assert => { assert.expect(2); assert.ok(true); assert.ok(true); });",
            options: ["except-simple"],
        },

        // "never" - assert without expect is fine
        {
            code: "test('name', function(assert) { assert.ok(true) });",
            options: ["never"],
        },

        // "never" - assert without expect is fine (with arrow function)
        {
            code: "test('name', assert => { assert.ok(true) });",
            options: ["never"],
        },

        // "never-except-zero" - assert without expect is fine
        {
            code: "test('name', function(assert) { assert.ok(true) });",
            options: ["never-except-zero"],
        },

        // "never-except-zero" - expect zero is fine
        {
            code: "test('name', function(assert) { assert.expect(0) });",
            options: ["never-except-zero"],
        },

        // "never-except-zero" - expect zero is fine (with arrow function)
        {
            code: "test('name', assert => { assert.expect(0) });",
            options: ["never-except-zero"],
        },
    ],

    invalid: [
        // always - make sure expect is identified correctly
        {
            code: "test('name', function(assert) { other.assert.expect(0) });",
            options: ["always"],
            errors: [alwaysErrorMessage("assert.expect")],
        },
        {
            code: "test('name', (assert) => { other.assert.expect(0) });",
            options: ["always"],
            errors: [alwaysErrorMessage("assert.expect")],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "test('name', function(this: LocalTestContext, assert) { other.assert.expect(0) });",
            options: ["always"],
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [alwaysErrorMessage("assert.expect")],
        },

        // assert in loop block
        {
            code: "test('name', function(assert) { while (false) { assert.ok(true) } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // global assertion in loop block
        {
            code: "test('name', function() { for (;;) { ok(true) } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("expect")],
        },

        // assert used in callback
        {
            code: "test('name', function(assert) { maybe(function() { assert.ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },
        {
            code: "test('name', function(assert) { maybe(() => { assert.ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },
        {
            code: "test('name', function(assert) { maybe(() => assert.ok(true)); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // "except-simple" with arrow function and assert used in callback
        {
            code: "test('name', assert => { maybe(() => { assert.ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },
        {
            code: "test('name', assert => { maybe(() => { maybe(() => { assert.ok(true) }); }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // global assertion used in callback
        {
            code: "test('name', function(assert) { maybe(function() { ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // assert in function expression
        {
            code: "test('name', function(assert) { var maybe = function() { assert.ok(true) }; });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // global assertion in function expression
        {
            code: "test('name', function() { var maybe = function() { ok(true) }; });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("expect")],
        },

        // `expect` does not count when used inside of a block.
        {
            code: "test('name', function(assert) { function name() { assert.expect(1); assert.ok(true) } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // global `expect` does not count when used inside of a block.
        {
            code: "test('name', function() { function name() { expect(1); ok(true) } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("expect")],
        },

        // `expect` does not count when used inside of a callback
        {
            code: "test('name', function(assert) { maybe(function() { assert.expect(1); assert.ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // global `expect` does not count when used inside of a callback
        {
            code: "test('name', function() { maybe(function() { expect(1); ok(true) }); });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("expect")],
        },

        // assert in outer test context and nested in a block
        {
            code: "test('name', function(assert) { assert.ok(true); if (true) { assert.ok(true); } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // Deeply nested
        {
            code: "test('name', function() { if (true) { if (true) { ok(true); } } });",
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("expect")],
        },

        // Sending assert to a function
        {
            code: [
                "function myAssertion(a, assert, c) { assert.ok(true); }",
                "test('name', function(assert) { myAssertion(null, assert, null); });",
            ].join(returnAndIndent),
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("assert.expect")],
        },

        // Sending assert to a function - renaming assert
        {
            code: [
                "function myAssertion(a, localAssert, c) { localAssert.ok(true); }",
                "test('name', function(myAssert) { myAssertion(null, myAssert, null); });",
            ].join(returnAndIndent),
            options: ["except-simple"],
            errors: [exceptSimpleErrorMessage("myAssert.expect")],
        },

        // nested modules
        {
            code: [
                "module('a', function() {",
                "    test('a - test', function(assert) {",
                "        if (false) {",
                "            assert.ok(true, 'needs expect');",
                "        }",
                "    });",
                "",
                "    module('b', function() {",
                "        test('b - test', function(assert) {",
                "            assert.expect(1);",
                "            assert.ok(true, 'has expect');",
                "        });",
                "    });",
                "});",
            ].join(returnAndIndent),
            options: ["except-simple"],
            errors: [
                Object.assign(exceptSimpleErrorMessage("assert.expect"), {
                    line: 2,
                }),
            ],
        },

        // Multiple assert statements only report one error per test
        {
            code: "test('name', function(assert) { maybe(function() { assert.ok(true); assert.ok(true); }) });",
            options: ["except-simple"],
            errors: [
                Object.assign(exceptSimpleErrorMessage("assert.expect"), {
                    column: 1,
                }),
            ],
        },

        // "always" configuration - simple case
        {
            code: "test('name', function(assert) { assert.ok(true) })",
            options: ["always"],
            errors: [alwaysErrorMessage("assert.expect")],
        },

        // "always" configuration - global assertion
        {
            code: "test('name', function() { equal(1, 1) })",
            options: ["always"],
            errors: [alwaysErrorMessage("expect")],
        },

        // "always" configuration checking that "expect" is called on assert.
        {
            code: "test('name', function(assert) { other.expect(1); assert.ok(true); });",
            options: ["always"],
            errors: [alwaysErrorMessage("assert.expect")],
        },

        // "always" configuration - errors are reported on `test()` line
        {
            code: [
                "module('some-module', function() {",
                "    test('some-test', function(assert) {",
                "        if (false) {",
                "            assert.ok(true, 'needs expect');",
                "        }",
                "    });",
                "});",
            ].join(returnAndIndent),
            options: ["always"],
            errors: [
                Object.assign(alwaysErrorMessage("assert.expect"), { line: 2 }),
            ],
        },

        // "always" configuration - multiple assert statements only report one error per test
        {
            code: "test('name', function(assert) { maybe(function() { assert.ok(true); assert.ok(true); }) });",
            options: ["always"],
            errors: [
                Object.assign(alwaysErrorMessage("assert.expect"), {
                    column: 1,
                }),
            ],
        },

        // "never" - expect is not fine
        {
            code: "test('name', function(assert) { assert.expect(1); assert.ok(true); });",
            options: ["never"],
            errors: [neverErrorMessage("assert.expect")],
        },

        // "never" - expect zero is not fine
        {
            code: "test('name', function(assert) { assert.expect(0) });",
            options: ["never"],
            errors: [neverErrorMessage("assert.expect")],
        },

        // "never-except-zero" - expect is not fine
        {
            code: "test('name', function(assert) { assert.expect(1); assert.ok(true); });",
            options: ["never-except-zero"],
            errors: [neverErrorMessage("assert.expect")],
        },
        {
            code: "test('name', function(assert) { assert.expect(1); assert.ok(true); });",
            options: [], // defaults to never-except-zero
            errors: [neverErrorMessage("assert.expect")],
        },
    ],
});
