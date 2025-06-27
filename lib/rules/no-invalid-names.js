/**
 * @fileoverview Disallow invalid and missing test names.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow invalid and missing test names",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/master/docs/rules/no-invalid-names.md"
        },
        fixable: "code",
        messages: {
            moduleNameEmpty: "Module name is empty.",
            moduleNameInvalidType: "Module name \"{{ name }}\" is invalid type: {{ type }}.",
            moduleNameMissing: "Module name is missing.",
            moduleNameOuterQUnitDelimiters: "Module name \"{{ name }}\" has leading and/or trailing QUnit delimiter: (> or :).",
            moduleNameOuterSpaces: "Module name has leading and/or trailing spaces.",
            testNameEmpty: "Test name is empty.",
            testNameInvalidType: "Test name \"{{ name }}\" is invalid type: {{ type }}.",
            testNameMissing: "Test name is missing.",
            testNameOuterQUnitDelimiters: "Test name \"{{ name }}\" has leading and/or trailing QUnit delimiter (> or :).",
            testNameOuterSpaces: "Test name has leading and/or trailing spaces."
        },
        schema: []
    },

    create: function (context) {
        const sourceCode = context.getSourceCode();

        const FUNCTION_TYPES = new Set(["FunctionExpression", "ArrowFunctionExpression"]);
        const INVALID_NAME_AST_TYPES = new Set([
            "ArrayExpression",
            "ObjectExpression",
            "ThisExpression",
            "UnaryExpression",
            "UpdateExpression",
            "BinaryExpression",
            "AssignmentExpression",
            "LogicalExpression"
        ]);
        const QUNIT_NAME_DELIMITERS = [">", ":"];

        /**
         * Check name for starting or ending with QUnit delimiters.
         * @param {string} name The test or module name to check.
         * @returns {boolean} True if the name starts or ends with a QUnit name delimiter, false otherwise.
         */
        function nameHasOuterQUnitDelimiters(name) {
            return QUNIT_NAME_DELIMITERS.some(delimiter =>
                name.startsWith(delimiter) || name.endsWith(delimiter)
            );
        }

        /**
         * Check the name argument of a module or test CallExpression.
         * @param {ASTNode} firstArg The first argument of the test/module call.
         * @param {"test"|"module"} objectType Whether this is a test or module call.
         * @param {ASTNode} calleeForMissingName The callee, used as report location if the test/module name is missing.
         * @returns {void}
         */
        function checkNameArgument(firstArg, objectType, calleeForMissingName) {
            if (!firstArg || FUNCTION_TYPES.has(firstArg.type)) {
                context.report({
                    node: calleeForMissingName,
                    messageId: `${objectType}NameMissing`
                });
            } else if (INVALID_NAME_AST_TYPES.has(firstArg.type)) {
                context.report({
                    node: firstArg,
                    messageId: `${objectType}NameInvalidType`,
                    data: {
                        type: firstArg.type,
                        name: sourceCode.getText(firstArg)
                    }
                });
            } else if (firstArg.type === "Literal") {
                if (typeof firstArg.value !== "string") {
                    context.report({
                        node: firstArg,
                        messageId: `${objectType}NameInvalidType`,
                        data: {
                            type: typeof firstArg.value,
                            name: sourceCode.getText(firstArg)
                        }
                    });
                } else if (firstArg.value.trim().length === 0) {
                    context.report({
                        node: firstArg,
                        messageId: `${objectType}NameEmpty`
                    });
                } else if (firstArg.value.trim() !== firstArg.value) {
                    const trimmedValue = firstArg.value.trim();

                    const raw = firstArg.raw;
                    const startDelimiter = raw[0];
                    const endDelimiter = raw[raw.length - 1];

                    context.report({
                        node: firstArg,
                        messageId: `${objectType}NameOuterSpaces`,
                        fix: fixer => fixer.replaceText(
                            firstArg,
                            `${startDelimiter}${trimmedValue}${endDelimiter}`
                        )
                    });
                } else if (nameHasOuterQUnitDelimiters(firstArg.value)) {
                    context.report({
                        node: firstArg,
                        messageId: `${objectType}NameOuterQUnitDelimiters`,
                        data: { name: firstArg.value }
                    });
                }
            }
        }

        return {
            "CallExpression": function (node) {
                /* istanbul ignore else: Correctly does nothing */
                if (utils.isTest(node.callee)) {
                    checkNameArgument(node.arguments[0], "test", node.callee);
                } else if (utils.isModule(node.callee)) {
                    checkNameArgument(node.arguments[0], "module", node.callee);
                }
            }
        };
    }
};
