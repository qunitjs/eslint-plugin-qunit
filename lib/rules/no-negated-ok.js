/**
 * @fileoverview Forbid the use of negations in assert.ok/notOk.
 * @author Kevin Partington
 */
"use strict";

const assert = require("node:assert"),
    utils = require("../utils");

const ASSERTION_OPPOSITES = {
    false: "true",
    notOk: "ok",
    ok: "notOk",
    true: "false",
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow negation in assert.ok/assert.notOk",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-negated-ok.md",
        },
        fixable: "code",
        messages: {
            noNegationInOk: "Unexpected negation in {{callee}}() assertion.",
        },
        schema: [],
    },

    create: function (context) {
        const POSITIVE_ASSERTIONS = ["ok", "true"];
        const NEGATIVE_ASSERTIONS = ["notOk", "false"];

        // Declare a stack in case of nested test cases (not currently supported
        // in QUnit).
        /** @type {Array<{assertContextVar: string | null}>} */
        const asyncStateStack = [],
            ASSERTIONS_TO_CHECK = new Set([
                ...POSITIVE_ASSERTIONS,
                ...NEGATIVE_ASSERTIONS,
            ]),
            /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
            sourceCode = context.sourceCode ?? context.getSourceCode();

        function getAssertVar() {
            let result = null;

            /* istanbul ignore else: correctly returns null */
            if (asyncStateStack.length > 0) {
                result =
                    asyncStateStack[asyncStateStack.length - 1]
                        .assertContextVar;
            }

            return result;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isOkOrNotOk(calleeNode) {
            assert.ok(calleeNode);

            let result = false;

            if (calleeNode.type === "MemberExpression") {
                result =
                    calleeNode.object &&
                    calleeNode.object.type === "Identifier" &&
                    calleeNode.object.name === getAssertVar() &&
                    calleeNode.property &&
                    calleeNode.property.type === "Identifier" &&
                    ASSERTIONS_TO_CHECK.has(calleeNode.property.name);
            }

            return result;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isAssertion(calleeNode) {
            assert.ok(calleeNode);
            const assertVar = getAssertVar();
            if (!assertVar) {
                return false;
            }
            return utils.isAssertion(calleeNode, assertVar);
        }

        /**
         * @param {import('estree').Node} argNode
         * @returns {number}
         */
        function getNegationDepth(argNode) {
            let negationDepth = 0,
                node = argNode;

            while (
                node &&
                node.type === "UnaryExpression" &&
                node.operator === "!"
            ) {
                ++negationDepth;
                node = node.argument;
            }

            return negationDepth;
        }

        /**
         * @param {import('estree').Node} argNode
         * @returns {import('estree').Node}
         */
        function unwrapNegation(argNode) {
            let node = argNode;

            while (
                node &&
                node.type === "UnaryExpression" &&
                node.operator === "!"
            ) {
                node = node.argument;
            }

            return node;
        }

        /**
         * @param {import('eslint').Rule.Node} callExprNode
         */
        function checkForNegation(callExprNode) {
            if (
                callExprNode.type === "CallExpression" &&
                callExprNode.arguments &&
                callExprNode.arguments.length > 0
            ) {
                const firstArgNode = callExprNode.arguments[0],
                    negationDepth = getNegationDepth(firstArgNode);

                if (negationDepth % 2 === 1) {
                    context.report({
                        node: callExprNode,
                        messageId: "noNegationInOk",
                        data: {
                            callee: sourceCode.getText(callExprNode.callee),
                        },
                        fix(fixer) {
                            // Conversions:
                            // * assert.notOk(!foo) => assert.ok(foo)
                            // * assert.ok(!foo) => assert.notOk(foo)

                            if (
                                callExprNode.callee.type !==
                                    "MemberExpression" ||
                                callExprNode.callee.object.type !==
                                    "Identifier" ||
                                callExprNode.callee.property.type !==
                                    "Identifier"
                            ) {
                                return null;
                            }

                            const assertionVariableName =
                                callExprNode.callee.object.name;

                            const propertyName =
                                callExprNode.callee.property.name;
                            if (
                                propertyName !== "true" &&
                                propertyName !== "false" &&
                                propertyName !== "ok" &&
                                propertyName !== "notOk"
                            ) {
                                return null;
                            }

                            const oppositeAssertionFunctionName =
                                ASSERTION_OPPOSITES[propertyName];
                            const newArgsTextArray = [
                                unwrapNegation(firstArgNode),
                                ...callExprNode.arguments.slice(1),
                            ].map((arg) => sourceCode.getText(arg));
                            const newArgsTextJoined =
                                newArgsTextArray.join(", ");
                            return fixer.replaceText(
                                callExprNode,
                                `${assertionVariableName}.${oppositeAssertionFunctionName}(${newArgsTextJoined})`,
                            );
                        },
                    });
                }
            }
        }

        return {
            CallExpression: function (node) {
                if (utils.isTest(node.callee)) {
                    asyncStateStack.push({
                        assertContextVar: utils.getAssertContextNameForTest(
                            node.arguments,
                        ),
                    });
                } else if (
                    isAssertion(node.callee) &&
                    isOkOrNotOk(node.callee)
                ) {
                    checkForNegation(node);
                }
            },

            "CallExpression:exit": function (node) {
                if (utils.isTest(node.callee)) {
                    asyncStateStack.pop();
                }
            },
        };
    },
};
