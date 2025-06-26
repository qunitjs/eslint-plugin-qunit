/**
 * @fileoverview Forbid setup/teardown module hooks
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
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
            description: "disallow setup/teardown module hooks",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-setup-teardown.md",
        },
        fixable: "code",
        messages: {
            noSetupTeardown: "Use {{preferred}} instead of {{forbidden}}.",
        },
        schema: [],
    },

    create: function (context) {
        const replacements = {
            setup: "beforeEach",
            teardown: "afterEach",
        };

        /**
         * @param {import('estree').Property} propertyNode
         */
        function checkModuleHook(propertyNode) {
            if (
                propertyNode.type === "Property" &&
                propertyNode.key.type === "Identifier" &&
                Object.prototype.hasOwnProperty.call(
                    replacements,
                    propertyNode.key.name,
            ) {
                const propertyKeyName = propertyNode.key.name;
                if (
                    propertyKeyName !== "setup" &&
                    propertyKeyName !== "teardown"
                ) {
                    return;
                }
                const replacement = replacements[propertyKeyName];
                context.report({
                    node: propertyNode,
                    messageId: "noSetupTeardown",
                    data: {
                        forbidden: propertyNode.key.name,
                        preferred: replacement,
                    },
                    fix(fixer) {
                        return fixer.replaceText(propertyNode.key, replacement);
                    },
                });
            }
        }

        /**
         * @param {import('eslint').Rule.Node} propertyNode
         * @returns {boolean}
         */
        function isInModule(propertyNode) {
            return (
                propertyNode &&
                propertyNode.parent && // ObjectExpression
                propertyNode.parent.parent && // CallExpression?
                propertyNode.parent.parent.type === "CallExpression" &&
                utils.isModule(propertyNode.parent.parent.callee)
            );
        }

        return {
            Property: function (node) {
                if (
                    utils.isModuleHookPropertyKey(node.key) &&
                    isInModule(node)
                ) {
                    checkModuleHook(node);
                }
            },
        };
    },
};
