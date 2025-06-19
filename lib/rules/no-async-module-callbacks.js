/**
 * @fileoverview disallow async module callbacks
 * @author Raymond Cohen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {import('estree').Node} node
 * @returns {boolean}
 */
function isAsyncFunctionExpression(node) {
    return (
        ["ArrowFunctionExpression", "FunctionExpression"].includes(node.type) &&
        // @ts-expect-error -- node.async is not typed.
        node.async === true
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow async module callbacks",
            category: "Possible Errors",
            recommended: false,
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-async-module-callbacks.md",
        },
        fixable: null,
        messages: {
            noAsyncModuleCallbacks:
                "Do not call module with an async callback function.",
        },
        schema: [],
    },

    create: function (context) {
        return {
            CallExpression: function (node) {
                if (utils.isModule(node.callee)) {
                    const callback = node.arguments[1];
                    if (callback && isAsyncFunctionExpression(callback)) {
                        context.report({
                            node: node,
                            messageId: "noAsyncModuleCallbacks",
                            data: {},
                        });
                    }
                }
            },
        };
    },
};
