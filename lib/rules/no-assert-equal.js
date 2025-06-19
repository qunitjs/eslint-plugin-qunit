/**
 * @fileoverview Forbid the use of assert.equal and suggest other assertions.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
    utils = require("../utils"),
    { ReferenceTracker } = require("eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow the use of assert.equal",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-assert-equal.md",
        },
        messages: {
            unexpectedGlobalEqual:
                "Unexpected equal. Use strictEqual, deepEqual, or propEqual.",
            unexpectedAssertEqual:
                "Unexpected {{assertVar}}.equal. Use {{assertVar}}.strictEqual, {{assertVar}}.deepEqual, or {{assertVar}}.propEqual.",
            switchToDeepEqual: "Switch to deepEqual.",
            switchToPropEqual: "Switch to propEqual.",
            switchToStrictEqual: "Switch to strictEqual.",
        },
        schema: [],
        hasSuggestions: true,
    },

    create: function (context) {
        // Declare a test stack in case of nested test cases (not currently
        // supported by QUnit).
        /** @type {Array<{assertVar: string | null}>} */
        const testStack = [];

        // We check upfront to find all the references to global equal(),
        // and then report them if they end up being inside test contexts.
        const globalEqualCallNodes = new Set();

        function getCurrentAssertContextVariable() {
            assert(testStack.length, "Test stack should not be empty");

            return testStack[testStack.length - 1].assertVar;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isAssertEqual(calleeNode) {
            return (
                calleeNode &&
                calleeNode.type === "MemberExpression" &&
                calleeNode.property.type === "Identifier" &&
                calleeNode.property.name === "equal" &&
                calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === getCurrentAssertContextVariable()
            );
        }

        /**
         * @param {import('estree').Node} node
         * @param {boolean} isGlobal
         */
        function reportError(node, isGlobal) {
            const assertVar = isGlobal
                ? null
                : getCurrentAssertContextVariable();
            context.report({
                node: node,
                messageId: isGlobal
                    ? "unexpectedGlobalEqual"
                    : "unexpectedAssertEqual",
                data: assertVar
                    ? {
                          assertVar,
                      }
                    : {},
                suggest: [
                    {
                        messageId: "switchToDeepEqual",
                        fix(fixer) {
                            if (node.type !== "CallExpression") {
                                return null;
                            }

                            // eslint-disable-next-line no-nested-ternary
                            const nodeToReplace = isGlobal
                                ? node.callee
                                : // eslint-disable-next-line unicorn/no-nested-ternary
                                  node.callee.type === "MemberExpression"
                                  ? node.callee.property
                                  : null;
                            if (!nodeToReplace) {
                                return null;
                            }
                            return fixer.replaceText(
                                nodeToReplace,
                                "deepEqual",
                            );
                        },
                    },
                    {
                        messageId: "switchToPropEqual",
                        fix(fixer) {
                            if (node.type !== "CallExpression") {
                                return null;
                            }
                            // eslint-disable-next-line no-nested-ternary
                            const nodeToReplace = isGlobal
                                ? node.callee
                                : // eslint-disable-next-line unicorn/no-nested-ternary
                                  node.callee.type === "MemberExpression"
                                  ? node.callee.property
                                  : null;
                            if (!nodeToReplace) {
                                return null;
                            }
                            return fixer.replaceText(
                                nodeToReplace,
                                "propEqual",
                            );
                        },
                    },
                    {
                        messageId: "switchToStrictEqual",
                        fix(fixer) {
                            if (node.type !== "CallExpression") {
                                return null;
                            }
                            // eslint-disable-next-line no-nested-ternary
                            const nodeToReplace = isGlobal
                                ? node.callee
                                : // eslint-disable-next-line unicorn/no-nested-ternary
                                  node.callee.type === "MemberExpression"
                                  ? node.callee.property
                                  : null;
                            if (!nodeToReplace) {
                                return null;
                            }
                            return fixer.replaceText(
                                nodeToReplace,
                                "strictEqual",
                            );
                        },
                    },
                ],
            });
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
                } else if (testStack.length > 0) {
                    if (isAssertEqual(node.callee)) {
                        reportError(node, false);
                    } else if (globalEqualCallNodes.has(node)) {
                        reportError(node, true);
                    }
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
            Program: function (node) {
                // Gather all calls to global `equal()`.
                /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
                const sourceCode =
                    context.sourceCode ?? context.getSourceCode();
                /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
                const scope = sourceCode.getScope
                    ? sourceCode.getScope(node)
                    : context.getScope();

                const tracker = new ReferenceTracker(scope);
                const traceMap = { equal: { [ReferenceTracker.CALL]: true } };

                for (const { node } of tracker.iterateGlobalReferences(
                    traceMap,
                )) {
                    globalEqualCallNodes.add(node);
                }
            },
        };
    },
};
