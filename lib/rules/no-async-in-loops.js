/**
 * @fileoverview Forbid async calls in loops.
 * @author Kevin Partington
 */
"use strict";

const assert = require("node:assert"),
    utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow async calls in loops",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-async-in-loops.md",
        },
        messages: {
            unexpectedAsyncInLoop: "Unexpected {{call}} in {{loopTypeText}}.",
        },
        schema: [],
    },

    create: function (context) {
        /** @type {Array<import('eslint').Rule.Node>} */
        const loopStack = [];
        /** @type {Array<string>} */
        const assertVariableStack = [];

        /**
         * @param {import('eslint').Rule.Node} node
         * @returns {boolean}
         */
        function isAsyncCallExpression(node) {
            const assertContextVar =
                assertVariableStack[assertVariableStack.length - 1];
            if (!assertContextVar) {
                return false;
            }
            return utils.isAsyncCallExpression(node, assertContextVar);
        }

        /**
         * @param {import('eslint').Rule.Node} expectedNode
         */
        function popAndMatch(expectedNode) {
            const actualNode = loopStack.pop();
            assert.strictEqual(
                actualNode,
                expectedNode,
                "Node mismatch in loop stack",
            );
        }

        /**
         * @param {import('eslint').Rule.NodeTypes} loopType
         * @returns {string}
         */
        function getLoopTypeText(loopType) {
            switch (loopType) {
                case "WhileStatement": {
                    return "while loop";
                }
                case "DoWhileStatement": {
                    return "do-while loop";
                }
                case "ForStatement": {
                    return "for loop";
                }
                case "ForInStatement": {
                    return "for-in loop";
                }
                case "ForOfStatement": {
                    return "for-of loop";
                }
                /* istanbul ignore next */
                default: {
                    throw new RangeError(`Invalid loop type: ${loopType}`);
                }
            }
        }

        /**
         * @param {import('eslint').Rule.Node} node
         * @returns {string | undefined}
         */
        function getAsyncCallType(node) {
            let callType;

            /* istanbul ignore else: correctly returning undefined */
            if (isAsyncCallExpression(node)) {
                const assertContextVar =
                    assertVariableStack[assertVariableStack.length - 1];
                callType = `${assertContextVar}.async()`;
            } else if (
                node.type === "CallExpression" &&
                utils.isStop(node.callee)
            ) {
                callType = "stop()";
            } else if (
                node.type === "CallExpression" &&
                utils.isStart(node.callee)
            ) {
                callType = "start()";
            }

            return callType;
        }

        /**
         * @param {import('eslint').Rule.Node} node
         */
        function reportError(node) {
            const loopNode = loopStack[loopStack.length - 1],
                loopType = loopNode.type;

            context.report({
                node: node,
                messageId: "unexpectedAsyncInLoop",
                data: {
                    call: getAsyncCallType(node) ?? "",
                    loopTypeText: getLoopTypeText(loopType),
                },
            });
        }

        return {
            CallExpression: function (node) {
                /* istanbul ignore else: correctly not doing anything */
                if (utils.isTest(node.callee)) {
                    const assertContextVar = utils.getAssertContextNameForTest(
                        node.arguments,
                    );
                    if (!assertContextVar) {
                        return;
                    }
                    assertVariableStack.push(assertContextVar);
                } else if (loopStack.length > 0) {
                    const isStopOrStartOrAsync =
                        isAsyncCallExpression(node) ||
                        utils.isStop(node.callee) ||
                        utils.isStart(node.callee);

                    /* istanbul ignore else: correctly not doing anything */
                    if (isStopOrStartOrAsync) {
                        reportError(node);
                    }
                }
            },
            "CallExpression:exit": function (node) {
                if (utils.isTest(node.callee)) {
                    assertVariableStack.pop();
                }
            },
            WhileStatement: function (node) {
                loopStack.push(node);
            },
            "WhileStatement:exit": function (node) {
                popAndMatch(node);
            },
            DoWhileStatement: function (node) {
                loopStack.push(node);
            },
            "DoWhileStatement:exit": function (node) {
                popAndMatch(node);
            },
            ForStatement: function (node) {
                loopStack.push(node);
            },
            "ForStatement:exit": function (node) {
                popAndMatch(node);
            },
            ForInStatement: function (node) {
                loopStack.push(node);
            },
            "ForInStatement:exit": function (node) {
                popAndMatch(node);
            },
            ForOfStatement: function (node) {
                loopStack.push(node);
            },
            "ForOfStatement:exit": function (node) {
                popAndMatch(node);
            },
        };
    },
};
