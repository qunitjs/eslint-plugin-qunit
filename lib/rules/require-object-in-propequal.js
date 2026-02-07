/**
 * @fileoverview Enforce use of objects as expected values in `assert.propEqual`
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
    utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description:
                "enforce use of objects as expected value in `assert.propEqual`",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/require-object-in-propequal.md",
        },
        messages: {
            useObject:
                "Use object as propEqual expected value (found: {{ value }}).",
        },
        schema: [],
    },

    create: function (context) {
        // Declare a test stack in case of nested test cases (not currently supported by QUnit).
        /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
        const sourceCode = context.sourceCode ?? context.getSourceCode(),
            /** @type {Array<{assertVar: string | null}>} */
            testStack = [];

        function getCurrentAssertContextVariable() {
            assert(testStack.length, "Test stack should not be empty");

            return testStack[testStack.length - 1].assertVar;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @return {boolean}
         */
        function isGlobalPropEqual(calleeNode) {
            return (
                calleeNode &&
                calleeNode.type === "Identifier" &&
                calleeNode.name === "propEqual"
            );
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @return {boolean}
         */
        function isAssertPropEqual(calleeNode) {
            return (
                calleeNode &&
                calleeNode.type === "MemberExpression" &&
                calleeNode.property.type === "Identifier" &&
                calleeNode.property.name === "propEqual" &&
                calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === getCurrentAssertContextVariable()
            );
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @return {boolean}
         */
        function isPropEqual(calleeNode) {
            return (
                isAssertPropEqual(calleeNode) || isGlobalPropEqual(calleeNode)
            );
        }

        /**
         * @param {import('estree').Node|{type: 'JSXElement'}} argNode
         * @return {boolean}
         */
        function isValidExpectedValue(argNode) {
            switch (argNode.type) {
                case "Literal":
                case "TemplateLiteral":
                case "JSXElement":
                case "UpdateExpression":
                case "UnaryExpression": {
                    return false;
                }
                default: {
                    return true;
                }
            }
        }

        /**
         * @param {import('estree').Node} callExpressionNode
         * @return {boolean}
         */
        function hasNonObjectExpectedValue(callExpressionNode) {
            return (
                callExpressionNode.type === "CallExpression" &&
                callExpressionNode &&
                callExpressionNode.arguments &&
                callExpressionNode.arguments.length >= 2 &&
                !isValidExpectedValue(callExpressionNode.arguments[1])
            );
        }

        return {
            CallExpression: function (node) {
                /* istanbul ignore else: correctly does nothing */
                if (
                    utils.isTest(node.callee) ||
                    utils.isAsyncTest(node.callee)
                ) {
                    testStack.push({
                        assertVar: utils.getAssertContextNameForTest(
                            node.arguments,
                        ),
                    });
                } else if (
                    testStack.length > 0 &&
                    isPropEqual(node.callee) &&
                    hasNonObjectExpectedValue(node)
                ) {
                    context.report({
                        node,
                        messageId: "useObject",
                        data: {
                            value: sourceCode.getText(node.arguments[1]),
                        },
                    });
                }
            },

            "CallExpression:exit": function (node) {
                /* istanbul ignore else: correctly does nothing */
                if (
                    utils.isTest(node.callee) ||
                    utils.isAsyncTest(node.callee)
                ) {
                    testStack.pop();
                }
            },
        };
    },
};
