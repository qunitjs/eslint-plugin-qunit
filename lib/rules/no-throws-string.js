/**
 * @fileoverview forbid assert.throws() with block, string, and message args
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
    utils = require("../utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {Array<{assertVar: string | null}>} testStack
 * @returns {string | null}
 */
function getAssertVar(testStack) {
    assert.ok(testStack && testStack.length > 0);

    return testStack[testStack.length - 1].assertVar;
}

/**
 * @param {import('estree').Node} calleeNode
 * @param {string | null} assertVar
 * @returns {boolean}
 */
function isThrows(calleeNode, assertVar) {
    let result = false;

    /* istanbul ignore else: correctly returns false */
    if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === assertVar &&
            calleeNode.property.type === "Identifier" &&
            ["throws", "raises"].includes(calleeNode.property.name);
    } else if (calleeNode.type === "Identifier") {
        result = calleeNode.name === "throws";
    }

    return result;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow assert.throws() with block, string, and message args",
            category: "Possible errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-throws-string.md",
        },
        messages: {
            noThrowsWithString: "Do not use {{callee}}(block, string, string).",
        },
        schema: [],
    },

    create: function (context) {
        /** @type {Array<{assertVar: string | null}>} */
        const testStack = [],
            /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
            sourceCode = context.sourceCode ?? context.getSourceCode();

        /**
         * @param {import('eslint').Rule.Node} callExprNode
         */
        function checkAndReport(callExprNode) {
            if (callExprNode.type !== "CallExpression") {
                return;
            }
            const args = callExprNode.arguments,
                argCount = args.length;

            if (
                argCount > 2 &&
                args[1].type === "Literal" &&
                typeof args[1].value === "string"
            ) {
                context.report({
                    node: callExprNode,
                    messageId: "noThrowsWithString",
                    data: {
                        callee: sourceCode.getText(callExprNode.callee),
                    },
                });
            }
        }

        return {
            CallExpression: function (node) {
                if (utils.isTest(node.callee)) {
                    testStack.push({
                        assertVar: utils.getAssertContextNameForTest(
                            node.arguments,
                        ),
                    });
                } else if (
                    testStack.length > 0 &&
                    isThrows(node.callee, getAssertVar(testStack))
                ) {
                    checkAndReport(node);
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
