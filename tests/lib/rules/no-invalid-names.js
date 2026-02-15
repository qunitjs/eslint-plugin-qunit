/**
 * @fileoverview Disallow missing and invalid test/module names.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-invalid-names"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const TEST_FUNCTIONS = [
    "test",
    "asyncTest",
    "QUnit.test",
    "QUnit.only"
];

const MODULE_FUNCTIONS = [
    "module",
    "QUnit.module"
];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-invalid-names", rule, {
    valid: [...TEST_FUNCTIONS, ...MODULE_FUNCTIONS].flatMap(callee => [
        `${callee}("simple valid name");`,
        `${callee}("simple valid name", function () {});`,

        // Cannot check variables
        `${callee}(name, function () {});`
    ]),

    invalid: [[TEST_FUNCTIONS, "test"], [MODULE_FUNCTIONS, "module"]].flatMap(
        ([callees, objType]) => callees.flatMap(callee => [
            {
                code: `${callee}(function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameMissing` }]
            },
            {
                code: `${callee}(1, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "number",
                        name: "1"
                    }
                }]
            },
            {
                code: `${callee}(true, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "boolean",
                        name: "true"
                    }
                }]
            },
            {
                code: `${callee}(null, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        name: "null",
                        type: "object"
                    }
                }]
            },
            {
                code: `${callee}(/regex/, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "object",
                        name: "/regex/"
                    }
                }]
            },
            {
                code: `${callee}([], function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "ArrayExpression",
                        name: "[]"
                    }
                }]
            },
            {
                code: `${callee}({}, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "ObjectExpression",
                        name: "{}"
                    }
                }]
            },
            {
                code: `${callee}(this, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "ThisExpression",
                        name: "this"
                    }
                }]
            },
            {
                code: `${callee}(typeof foo, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "UnaryExpression",
                        name: "typeof foo"
                    }
                }]
            },
            {
                code: `${callee}(void foo, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "UnaryExpression",
                        name: "void foo"
                    }
                }]
            },
            {
                code: `${callee}(++foo, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "UpdateExpression",
                        name: "++foo"
                    }
                }]
            },
            {
                code: `${callee}(foo + bar, function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "BinaryExpression",
                        name: "foo + bar"
                    }
                }]
            },
            {
                code: `${callee}(foo = "name", function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "AssignmentExpression",
                        name: "foo = \"name\""
                    }
                }]
            },
            {
                code: `${callee}(foo || "name", function () {});`,
                output: null,
                errors: [{
                    messageId: `${objType}NameInvalidType`,
                    data: {
                        type: "LogicalExpression",
                        name: "foo || \"name\""
                    }
                }]
            },
            {
                code: `${callee}("", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameEmpty` }]
            },
            {
                code: `${callee}("   \\t\\n ", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameEmpty` }]
            },
            {
                code: `${callee}("\\t Leading and trailing space ", function () {});`,
                output: `${callee}("Leading and trailing space", function () {});`,
                errors: [{ messageId: `${objType}NameOuterSpaces` }]
            },
            {
                code: `${callee}("> Leading QUnit delimiter", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameOuterQUnitDelimiters` }]
            },
            {
                code: `${callee}(": Leading QUnit delimiter", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameOuterQUnitDelimiters` }]
            },
            {
                code: `${callee}("Trailing QUnit delimiter >", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameOuterQUnitDelimiters` }]
            },
            {
                code: `${callee}("Trailing QUnit delimiter :", function () {});`,
                output: null,
                errors: [{ messageId: `${objType}NameOuterQUnitDelimiters` }]
            }
        ])
    )
});
