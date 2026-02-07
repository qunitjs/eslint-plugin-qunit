/**
 * @fileoverview disallow the use of hooks from ancestor modules
 * @author Raymond Cohen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const NESTABLE_HOOK_NAMES = new Set(["afterEach", "beforeEach"]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow the use of hooks from ancestor modules",
            category: "Possible Errors",
            recommended: false,
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-hooks-from-ancestor-modules.md",
        },
        fixable: null,
        messages: {
            noHooksFromAncestorModules:
                "Do not call {{usedHooksIdentifierName}}.{{invokedMethodName}} from an ancestor module.",
        },
        schema: [],
    },

    create: function (context) {
        /** @type {Array<{callExpression: import('eslint').Rule.Node, description: string, hookIdentifierName?: string | null}>} */
        const moduleStack = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * @param {import('eslint').Rule.Node} callExpressionNode
         * @returns {boolean}
         */
        function isInModuleCallbackBody(callExpressionNode) {
            return !!(
                callExpressionNode &&
                callExpressionNode.parent &&
                callExpressionNode.parent.type === "ExpressionStatement" &&
                callExpressionNode.parent.parent &&
                callExpressionNode.parent.parent.type === "BlockStatement" &&
                callExpressionNode.parent.parent.parent &&
                ["FunctionExpression", "ArrowFunctionExpression"].includes(
                    callExpressionNode.parent.parent.parent.type,
                ) &&
                callExpressionNode.parent.parent.parent.parent &&
                callExpressionNode.parent.parent.parent.parent.type ===
                    "CallExpression" &&
                utils.isModule(
                    callExpressionNode.parent.parent.parent.parent.callee,
                )
            );
        }

        /**
         * @param {import('eslint').Rule.Node} node
         * @returns {boolean}
         */
        function isHookInvocation(node) {
            return (
                node.type === "CallExpression" &&
                node.callee.type === "MemberExpression" &&
                node.callee.object.type === "Identifier" &&
                node.callee.property.type === "Identifier" &&
                NESTABLE_HOOK_NAMES.has(node.callee.property.name) &&
                isInModuleCallbackBody(node)
            );
        }

        /**
         * @param {import('estree').Node[]} args
         * @returns {import('estree').Node | undefined}
         */
        function getCallbackArg(args) {
            // Callback can be either args[1] or args[2]
            // https://api.qunitjs.com/QUnit/module/
            return args
                .slice(1, 3)
                .find((arg) =>
                    ["FunctionExpression", "ArrowFunctionExpression"].includes(
                        arg.type,
                    ),
                );
        }

        /**
         * @param {import('estree').Node[]} params
         * @returns {import('estree').Node | undefined}
         */
        function getHooksIdentifierFromParams(params) {
            // In TypeScript, `this` can be passed as the first function parameter to add a type to it,
            // and we want to ignore that parameter since we're looking for the `hooks` variable.
            return params.find(
                (p) => p.type === "Identifier" && p.name !== "this",
            );
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            // eslint-disable-next-line complexity
            CallExpression: function (node) {
                if (utils.isModule(node.callee)) {
                    if (node.arguments.length === 0) {
                        return;
                    }

                    const arg = node.arguments[0];
                    const description =
                        arg.type === "Literal" && typeof arg.value === "string"
                            ? arg.value
                            : /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
                              (
                                  context.sourceCode ?? context.getSourceCode()
                              ).getText(arg);

                    /** @type {{callExpression: import('eslint').Rule.Node, description: string, hookIdentifierName?: string | null}} */
                    const moduleStackInfo = {
                        callExpression: node,
                        description: description,
                    };
                    const callback = getCallbackArg(node.arguments);
                    if (
                        !callback ||
                        (callback.type !== "FunctionExpression" &&
                            callback.type !== "ArrowFunctionExpression")
                    ) {
                        return;
                    }
                    const hooksParam = getHooksIdentifierFromParams(
                        callback.params,
                    );
                    moduleStackInfo.hookIdentifierName =
                        hooksParam && hooksParam.type === "Identifier"
                            ? hooksParam.name
                            : null;
                    moduleStack.push(moduleStackInfo);
                } else if (isHookInvocation(node)) {
                    const containingModuleInfo =
                        moduleStack[moduleStack.length - 1];
                    const expectedHooksIdentifierName =
                        containingModuleInfo.hookIdentifierName;

                    if (
                        node.callee.type !== "MemberExpression" ||
                        node.callee.object.type !== "Identifier" ||
                        node.callee.property.type !== "Identifier"
                    ) {
                        return;
                    }

                    const usedHooksIdentifierName = node.callee.object.name;
                    const invokedMethodName = node.callee.property.name;

                    if (
                        expectedHooksIdentifierName !== usedHooksIdentifierName
                    ) {
                        context.report({
                            node: node.callee,
                            messageId: "noHooksFromAncestorModules",
                            data: {
                                invokedMethodName,
                                usedHooksIdentifierName,
                            },
                        });
                    }
                }
            },

            "CallExpression:exit": function (node) {
                if (utils.isModule(node.callee)) {
                    moduleStack.pop();
                }
            },
        };
    },
};
