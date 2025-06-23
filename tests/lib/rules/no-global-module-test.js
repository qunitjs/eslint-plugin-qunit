/**
 * @fileoverview Forbid the use of global module/test/asyncTest.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-global-module-test"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-global-module-test", rule, {
    valid: [
        "QUnit.module();",
        "QUnit.test();",
        "QUnit.asyncTest();",

        // Other identifiers are perfectly valid
        "ok();",

        // Global overridden by local import/declaration.
        {
            code: "var module = require('foo'); module();",
            languageOptions: { globals: { module: true } },
        },
    ],

    invalid: [
        {
            code: "module();",
            languageOptions: { globals: { module: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalModuleTest",
                    data: {
                        callee: "module",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "test();",
            languageOptions: { globals: { test: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalModuleTest",
                    data: {
                        callee: "test",
                    },
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "asyncTest();",
            languageOptions: { globals: { asyncTest: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalModuleTest",
                    data: {
                        callee: "asyncTest",
                    },
                    type: "CallExpression",
                },
            ],
        },
    ],
});
