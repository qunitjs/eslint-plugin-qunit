/**
 * @fileoverview forbid binary logical expressions in assert arguments
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
            description:
                "disallow binary logical expressions in assert arguments",
            category: "Best Practices",
            recommended: false,
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-assert-logical-expression.md",
        },
        fixable: null,
        messages: {
            noLogicalOperator:
                "Do not use '{{operator}}' in assertion arguments.",
        },
        schema: [],
    },

    create: function (context) {
        /** @type {Array<{assertContextVar: string}>} */
        const testStack = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * @param {import('estree').Node[]} argNodes
         */
        function checkAndReport(argNodes) {
            for (const arg of argNodes) {
                if (arg.type === "LogicalExpression") {
                    context.report({
                        node: arg,
                        messageId: "noLogicalOperator",
                        data: {
                            operator: arg.operator,
                        },
                    });
                }
            }
        }

        function getAssertVar() {
            let result = null;

            if (testStack.length > 0) {
                result = testStack[testStack.length - 1].assertContextVar;
            }

            return result;
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            CallExpression: function (node) {
                if (utils.isTest(node.callee)) {
                    const assertContextVar = utils.getAssertContextNameForTest(
                        node.arguments,
                    );
                    if (!assertContextVar) {
                        return;
                    }
                    testStack.push({
                        assertContextVar,
                    });
                } else {
                    const assertVar = getAssertVar();
                    if (
                        assertVar &&
                        utils.isAssertion(node.callee, assertVar)
                    ) {
                        const countNonMessageArgs = Math.max(
                            ...utils.getAllowedArities(node.callee, assertVar),
                        );
                        checkAndReport(
                            node.arguments.slice(0, countNonMessageArgs),
                        );
                    }
                }
            },

            "CallExpression:exit": function (node) {
                if (utils.isTest(node.callee)) {
                    testStack.pop();
                }
            },
        };
    },
};
