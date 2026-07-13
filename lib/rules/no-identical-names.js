/**
 * @fileoverview Forbid identical test and module names
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @template T
 * @param {T[]} arr
 * @param {(item: T) => boolean} callback
 * @returns {T | undefined}
 */
function findLast(arr, callback) {
    return [...arr].reverse().find((item) => callback(item));
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow identical test and module names",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-identical-names.md",
        },
        messages: {
            duplicateTest:
                "Test name is used on line {{ line }} in the same module.",
            duplicateModule:
                "Module name is used by sibling on line {{ line }}.",
            duplicateModuleAncestor:
                "Module name is used by ancestor on line {{ line }}.",
        },
        schema: [],
    },

    create: function (context) {
        const TOP_LEVEL_MODULE_NODE = "top-level-module"; //  Constant representing the implicit top-level module.
        /** @type {Array<import('estree').Node | typeof TOP_LEVEL_MODULE_NODE>} */
        const modulesStack = [TOP_LEVEL_MODULE_NODE];
        /** @type {Map<import('estree').Node | typeof TOP_LEVEL_MODULE_NODE, {modules: import('estree').Node[], tests: import('estree').Node[], hasNestedTests: boolean}>} */
        const mapModuleNodeToInfo = new Map();
        mapModuleNodeToInfo.set(TOP_LEVEL_MODULE_NODE, {
            modules: [], // Children module nodes.
            tests: [], // Children test nodes.
            hasNestedTests: false, // Whether this module has tests nested inside it.
        });

        //----------------------------------------------------------------------
        // Helper functions
        //----------------------------------------------------------------------

        /**
         * @param {import('estree').Node} node
         * @returns {boolean}
         */
        function isFirstArgLiteral(node) {
            return (
                node.type === "CallExpression" &&
                node.arguments &&
                node.arguments[0] &&
                node.arguments[0].type === "Literal"
            );
        }

        /**
         * @param {import('estree').Node} node
         * @returns {boolean}
         */
        function moduleHasNestedTests(node) {
            const moduleInfo = mapModuleNodeToInfo.get(node);
            if (!moduleInfo) {
                return false;
            }
            return (
                moduleInfo.tests.length > 0 ||
                moduleInfo.modules.some((moduleNode) =>
                    moduleHasNestedTests(moduleNode),
                )
            );
        }

        function getCurrentModuleNode() {
            const parentModule = mapModuleNodeToInfo.get(
                modulesStack[modulesStack.length - 1],
            );
            if (parentModule && parentModule.modules.length > 0) {
                // Find the last test-less module at the current level if one exists, i.e: module('foo');
                const lastTestLessModule = findLast(
                    parentModule.modules,
                    (node) => !mapModuleNodeToInfo.get(node)?.hasNestedTests,
                );
                if (lastTestLessModule) {
                    return lastTestLessModule;
                }
            }
            return modulesStack[modulesStack.length - 1];
        }

        /**
         * @param {import('estree').Node} node
         */
        // eslint-disable-next-line complexity
        function handleTestNames(node) {
            if (node.type !== "CallExpression" || !utils.isTest(node.callee)) {
                return;
            }

            if (
                node.arguments.length === 0 ||
                node.arguments[0].type !== "Literal"
            ) {
                return;
            }

            const title = node.arguments[0].value;
            const currentModuleNode = getCurrentModuleNode();
            const currentModuleInfo =
                mapModuleNodeToInfo.get(currentModuleNode);
            if (!currentModuleInfo) {
                return;
            }

            // Check if we have seen this test name in the current module yet.
            const duplicateTestTitle = currentModuleInfo.tests.find(
                (t) =>
                    t.type === "CallExpression" &&
                    t.arguments[0].type === "Literal" &&
                    t.arguments[0].value === title,
            );
            if (
                duplicateTestTitle &&
                duplicateTestTitle.type === "CallExpression"
            ) {
                context.report({
                    node: node.arguments[0],
                    messageId: "duplicateTest",
                    data: {
                        line:
                            duplicateTestTitle.arguments[0]?.loc?.start?.line.toString() ??
                            "",
                    },
                });
            }

            // Add this test to the current module's list of tests.
            currentModuleInfo.tests.push(node);
        }

        /**
         * @param {import('estree').Node} node
         */
        // eslint-disable-next-line complexity
        function handleModuleNames(node) {
            if (node.type === "CallExpression" && utils.isModule(node.callee)) {
                if (node.arguments.length === 0) {
                    return;
                }
                if (node.arguments[0].type !== "Literal") {
                    return;
                }
                const title = node.arguments[0].value;
                const currentModuleNode = modulesStack[modulesStack.length - 1];

                const currentModuleInfo =
                    mapModuleNodeToInfo.get(currentModuleNode);

                if (!currentModuleInfo) {
                    return;
                }

                // Check if we have seen the same title in a sibling module.
                const duplicateModuleTitle = currentModuleInfo.modules.find(
                    (moduleNode) =>
                        moduleNode.type === "CallExpression" &&
                        moduleNode.arguments[0].type === "Literal" &&
                        moduleNode.arguments[0].value === title,
                );
                if (
                    duplicateModuleTitle &&
                    duplicateModuleTitle.type === "CallExpression"
                ) {
                    context.report({
                        node: node.arguments[0],
                        messageId: "duplicateModule",
                        data: {
                            line:
                                duplicateModuleTitle.arguments[0]?.loc?.start?.line.toString() ??
                                "",
                        },
                    });
                }

                // Check if we have seen the same title in any ancestor modules.
                const duplicateAncestorModuleTitle = modulesStack
                    .filter(
                        (moduleNode) => moduleNode !== TOP_LEVEL_MODULE_NODE,
                    )
                    .find(
                        (moduleNode) =>
                            moduleNode.type === "CallExpression" &&
                            moduleNode.arguments[0].type === "Literal" &&
                            moduleNode.arguments[0].value === title,
                    );
                if (
                    duplicateAncestorModuleTitle &&
                    duplicateAncestorModuleTitle.type === "CallExpression"
                ) {
                    context.report({
                        node: node.arguments[0],
                        messageId: "duplicateModuleAncestor",
                        data: {
                            line:
                                duplicateAncestorModuleTitle.arguments[0]?.loc?.start?.line.toString() ??
                                "",
                        },
                    });
                }

                // Entering a module so push it onto the stack.
                modulesStack.push(node);
                mapModuleNodeToInfo.set(node, {
                    modules: [],
                    tests: [],
                    hasNestedTests: false,
                });
                currentModuleInfo.modules.push(node); // Add to parent module's list of children modules.
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            CallExpression: function (node) {
                if (!isFirstArgLiteral(node)) {
                    return;
                }

                handleModuleNames(node);
                handleTestNames(node);
            },

            "CallExpression:exit": function (node) {
                if (
                    modulesStack.length > 0 &&
                    modulesStack[modulesStack.length - 1] === node
                ) {
                    // Exiting a module so pop it from the stack.
                    modulesStack.pop();

                    // Record if we saw any nested tests in this module.
                    const moduleInfo = mapModuleNodeToInfo.get(node);
                    if (moduleInfo) {
                        moduleInfo.hasNestedTests = moduleHasNestedTests(node);
                    }
                }
            },
        };
    },
};
