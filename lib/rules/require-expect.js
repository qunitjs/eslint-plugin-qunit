/**
 * @fileoverview Require the use of `expect` when using `assert` inside of a
 * block or when passing `assert` to a function.
 * @author Mitch Lloyd
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
            description: "enforce that `expect` is called",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/require-expect.md",
        },
        messages: {
            expectRequired: "Test is missing `{{expect}}()` call.",
            expectForbidden: "Unexpected use of `{{expect}}()` call.",
            expectRequiredComplexTest:
                "Should use `{{expect}}()` when using assertions outside of the top-level test callback.",
        },
        schema: [
            {
                enum: ["always", "except-simple", "never", "never-except-zero"],
            },
        ],
    },

    create: function (context) {
        /** @typedef {{assertName: string|null, node: import('estree').CallExpression, blockDepth: number, isExpectUsed: boolean, didReport: boolean, isNonZeroExpectUsed?: boolean}} TestContext */
        /** @type {TestContext|undefined} */
        let currentTest;

        /**
         * @param {import('estree').Node} callee
         * @returns {boolean}
         */
        function isGlobalExpectCall(callee) {
            return callee.type === "Identifier" && callee.name === "expect";
        }

        /**
         * @param {import('estree').Node} callee
         * @returns {boolean}
         */
        function isAssertExpectCall(callee) {
            return (
                callee.type === "MemberExpression" &&
                callee.object &&
                callee.object.type === "Identifier" &&
                callee.object.name === currentTest?.assertName &&
                callee.property.type === "Identifier" &&
                callee.property.name === "expect"
            );
        }

        /**
         * @param {import('estree').Node} callee
         * @returns {boolean}
         */
        function isExpectCall(callee) {
            return isGlobalExpectCall(callee) || isAssertExpectCall(callee);
        }

        /**
         * @param {import('estree').CallExpression} node
         * @returns {boolean}
         */
        function isNonZeroExpectCall(node) {
            if (node.type !== "CallExpression") {
                return false;
            }
            return (
                isExpectCall(node.callee) &&
                !(
                    node.arguments.length === 1 &&
                    node.arguments[0].type === "Literal" &&
                    node.arguments[0].raw === "0"
                )
            );
        }

        /**
         * @param {import('estree').Node} callee
         * @returns {boolean}
         */
        function isTopLevelExpectCall(callee) {
            if (!currentTest) {
                return false;
            }
            return isExpectCall(callee) && currentTest.blockDepth === 1;
        }

        /**
         * @param {import('eslint').Rule.Node} node
         * @returns {boolean}
         */
        function isUsingAssertInNestedBlock(node) {
            if (!currentTest) {
                return false;
            }
            return (
                currentTest.blockDepth > 1 &&
                node.type === "CallExpression" &&
                (!currentTest.assertName ||
                    utils.isAssertion(node.callee, currentTest.assertName))
            );
        }

        /**
         * @param {import('estree').Node} node
         * @returns {boolean}
         */
        function isPassingAssertAsArgument(node) {
            if (!currentTest?.assertName) {
                return false;
            }

            if (node.type !== "CallExpression") {
                return false;
            }
            for (let i = 0; i < node.arguments.length; i++) {
                const arg = node.arguments[i];
                if (
                    arg.type === "Identifier" &&
                    arg.name === currentTest.assertName
                ) {
                    return true;
                }
            }
            return false;
        }

        /**
         * @param {import('eslint').Rule.Node} node
         * @returns {boolean}
         */
        function isViolatingExceptSimpleRule(node) {
            if (!currentTest) {
                return false;
            }
            return (
                !currentTest.isExpectUsed &&
                (isUsingAssertInNestedBlock(node) ||
                    isPassingAssertAsArgument(node))
            );
        }

        /**
         * @param {import('eslint').Rule.Node} node
         */
        function captureTestContext(node) {
            if (node.type !== "CallExpression") {
                return;
            }
            currentTest = {
                assertName: utils.getAssertContextNameForTest(node.arguments),
                node: node,
                blockDepth: 0,
                isExpectUsed: false,
                didReport: false,
            };
        }

        function releaseTestContext() {
            currentTest = undefined;
        }

        function assertionMessageData() {
            return {
                expect: currentTest?.assertName
                    ? `${currentTest.assertName}.expect`
                    : "expect",
            };
        }

        const ExceptSimpleStrategy = {
            /**
             * @param {import('eslint').Rule.Node} node
             */
            CallExpression: function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (currentTest && !currentTest.didReport) {
                    if (isTopLevelExpectCall(node.callee)) {
                        currentTest.isExpectUsed = true;
                    } else if (isViolatingExceptSimpleRule(node)) {
                        context.report({
                            node: currentTest.node,
                            messageId: "expectRequiredComplexTest",
                            data: assertionMessageData(),
                        });
                        currentTest.didReport = true;
                    }
                } else if (utils.isTest(node.callee)) {
                    captureTestContext(node);
                }
            },

            /**
             * @param {import('eslint').Rule.Node} node
             */
            "CallExpression:exit": function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (utils.isTest(node.callee)) {
                    releaseTestContext();
                }
            },

            "BlockStatement, ArrowFunctionExpression[body.type!='BlockStatement']":
                function () {
                    if (currentTest) {
                        currentTest.blockDepth++;
                    }
                },

            "BlockStatement, ArrowFunctionExpression[body.type!='BlockStatement']:exit":
                function () {
                    if (currentTest) {
                        currentTest.blockDepth--;
                    }
                },
        };

        const AlwaysStrategy = {
            /**
             * @param {import('eslint').Rule.Node} node
             */
            CallExpression: function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (currentTest && isExpectCall(node.callee)) {
                    currentTest.isExpectUsed = true;
                } else if (utils.isTest(node.callee)) {
                    captureTestContext(node);
                }
            },

            /**
             * @param {import('eslint').Rule.Node} node
             */
            "CallExpression:exit": function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (!currentTest) {
                    return;
                }
                if (utils.isTest(node.callee)) {
                    if (!currentTest.isExpectUsed) {
                        context.report({
                            node: currentTest.node,
                            messageId: "expectRequired",
                            data: assertionMessageData(),
                        });
                    }

                    releaseTestContext();
                }
            },
        };

        const NeverStrategy = {
            /**
             * @param {import('eslint').Rule.Node} node
             */
            CallExpression: function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (currentTest && isExpectCall(node.callee)) {
                    currentTest.isExpectUsed = true;
                } else if (utils.isTest(node.callee)) {
                    captureTestContext(node);
                }
            },

            /**
             * @param {import('eslint').Rule.Node} node
             */
            "CallExpression:exit": function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (!currentTest) {
                    return;
                }
                if (utils.isTest(node.callee)) {
                    if (currentTest.isExpectUsed) {
                        context.report({
                            node: currentTest.node,
                            messageId: "expectForbidden",
                            data: assertionMessageData(),
                        });
                    }
                    releaseTestContext();
                }
            },
        };

        const NeverExceptZeroStrategy = {
            /**
             * @param {import('eslint').Rule.Node} node
             */
            CallExpression: function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (currentTest && isNonZeroExpectCall(node)) {
                    currentTest.isNonZeroExpectUsed = true;
                } else if (utils.isTest(node.callee)) {
                    captureTestContext(node);
                }
            },

            /**
             * @param {import('eslint').Rule.Node} node
             */
            "CallExpression:exit": function (node) {
                if (node.type !== "CallExpression") {
                    return;
                }
                if (!currentTest) {
                    return;
                }
                if (utils.isTest(node.callee)) {
                    if (currentTest.isNonZeroExpectUsed) {
                        context.report({
                            node: currentTest.node,
                            messageId: "expectForbidden",
                            data: assertionMessageData(),
                        });
                    }
                    releaseTestContext();
                }
            },
        };

        /** @type {"always" | "except-simple" | "never" | "never-except-zero"} */
        const option = context.options[0];

        return (
            {
                always: AlwaysStrategy,
                "except-simple": ExceptSimpleStrategy,
                never: NeverStrategy,
                "never-except-zero": NeverExceptZeroStrategy,
            }[option] || NeverExceptZeroStrategy
        );
    },
};
