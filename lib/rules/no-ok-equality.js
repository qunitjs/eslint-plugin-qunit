/**
 * @fileoverview Forbid the use of equality comparisons in assert.ok/notOk.
 * @author Kevin Partington
 */
"use strict";

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
                "disallow equality comparisons in assert.ok/assert.notOk",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-ok-equality.md",
        },
        fixable: "code",
        messages: {
            noEqualityCheckInOk:
                "Unexpected equality comparison in {{assertion}} call. Use {{suggestion}}({{a}}, {{b}}) instead.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    allowGlobal: {
                        type: "boolean",
                        description:
                            "Whether the rule should check global assertions.",
                        default: true,
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create: function (context) {
        // Declare a stack in case of nested test cases (not currently supported
        // in QUnit).
        /** @type {Array<{assertContextVar: string | null}>} */
        const asyncStateStack = [],
            DEFAULT_OPTIONS = {
                allowGlobal: true,
            },
            options = context.options[0] || DEFAULT_OPTIONS,
            sourceCode = context.getSourceCode();

        const POSITIVE_ASSERTIONS = new Set(["ok", "true"]);
        const NEGATIVE_ASSERTIONS = new Set(["notOk", "false"]);

        function getAssertContextVar() {
            const state = asyncStateStack[asyncStateStack.length - 1];
            return state && state.assertContextVar;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isOk(calleeNode) {
            const assertContextVar = getAssertContextVar();

            const isOk =
                calleeNode.type === "Identifier" &&
                POSITIVE_ASSERTIONS.has(calleeNode.name);

            const isAssertOk =
                calleeNode.type === "MemberExpression" &&
                calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === assertContextVar &&
                calleeNode.property.type === "Identifier" &&
                POSITIVE_ASSERTIONS.has(calleeNode.property.name);

            if (options.allowGlobal) {
                return isOk || isAssertOk;
            }

            return isAssertOk;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isNotOk(calleeNode) {
            const assertContextVar = getAssertContextVar();

            const isNotOk =
                calleeNode.type === "Identifier" &&
                NEGATIVE_ASSERTIONS.has(calleeNode.name);

            const isAssertNotOk =
                calleeNode.type === "MemberExpression" &&
                calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === assertContextVar &&
                calleeNode.property.type === "Identifier" &&
                NEGATIVE_ASSERTIONS.has(calleeNode.property.name);

            if (options.allowGlobal) {
                return isNotOk || isAssertNotOk;
            }

            return isAssertNotOk;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isOkOrNotOk(calleeNode) {
            return isOk(calleeNode) || isNotOk(calleeNode);
        }

        /**
         * @param {import('estree').Node} arg
         * @returns {boolean}
         */
        function isEqual(arg) {
            return (
                arg.type === "BinaryExpression" &&
                ["===", "==", "!==", "!="].includes(arg.operator)
            );
        }

        /**
         * @param {import('estree').Node} arg
         * @returns {boolean}
         */
        function isStrict(arg) {
            return (
                arg.type === "BinaryExpression" &&
                ["===", "!=="].includes(arg.operator)
            );
        }

        /**
         * @param {import('estree').Node} arg
         * @returns {boolean}
         */
        function isNegative(arg) {
            return (
                arg.type === "BinaryExpression" &&
                ["!==", "!="].includes(arg.operator)
            );
        }

        /**
         * @param {{strict: boolean, negative: boolean}} criteria
         * @returns {string}
         */
        function getSuggestedAssertion(criteria) {
            const assertVar = getAssertContextVar();
            let assertMethod;

            if (criteria.strict) {
                assertMethod = criteria.negative
                    ? "notStrictEqual"
                    : "strictEqual";
            } else {
                assertMethod = criteria.negative ? "notEqual" : "equal";
            }

            if (assertVar) {
                return `${assertVar}.${assertMethod}`;
            }

            return assertMethod;
        }

        /**
         * @param {import('estree').Node[]} args
         * @param {boolean} isCalleeNegative
         * @param {boolean} isGlobal
         * @param {import('estree').CallExpression} node
         */
        function checkArguments(args, isCalleeNegative, isGlobal, node) {
            /* istanbul ignore else: will correctly do nothing */
            if (args.length > 0) {
                const firstArg = args[0],
                    isArgEqual = isEqual(firstArg),
                    isArgStrictEqual = isStrict(firstArg),
                    isArgNegative = isNegative(firstArg);

                const suggestion = getSuggestedAssertion({
                    strict: isArgStrictEqual,
                    negative: isArgNegative !== isCalleeNegative,
                });

                if (firstArg.type !== "BinaryExpression") {
                    return;
                }

                const a = sourceCode.getText(firstArg.left);
                const b = sourceCode.getText(firstArg.right);

                if (isArgEqual) {
                    context.report({
                        node: node,
                        messageId: "noEqualityCheckInOk",
                        data: {
                            assertion: sourceCode.getText(node.callee),
                            suggestion,
                            a,
                            b,
                        },
                        fix(fixer) {
                            const newArgs = [
                                a,
                                b,
                                ...args
                                    .slice(1)
                                    .map((arg) => sourceCode.getText(arg)),
                            ];
                            return fixer.replaceText(
                                node,
                                `${suggestion}(${newArgs.join(", ")})`,
                            );
                        },
                    });
                }
            }
        }

        return {
            CallExpression: function (node) {
                if (asyncStateStack.length > 0 && isOkOrNotOk(node.callee)) {
                    const isGlobal = node.callee.type === "Identifier";
                    checkArguments(
                        node.arguments,
                        isNotOk(node.callee),
                        isGlobal,
                        node,
                    );
                } else if (utils.isTest(node.callee)) {
                    asyncStateStack.push({
                        assertContextVar: utils.getAssertContextNameForTest(
                            node.arguments,
                        ),
                    });
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
