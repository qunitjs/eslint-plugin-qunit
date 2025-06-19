/**
 * @fileoverview Forbid use of QUnit.jsDump().
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow use of QUnit.jsDump",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-jsdump.md",
        },
        messages: {
            noJsDump: "Use QUnit.dump() instead of QUnit.jsDump().",
        },
        schema: [],
    },

    create: function (context) {
        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            "CallExpression[callee.object.name='QUnit'][callee.property.name='jsDump']":
                /**
                 * @param {import('eslint').Rule.Node} node
                 */
                function (node) {
                    context.report({
                        node: node,
                        messageId: "noJsDump",
                    });
                },
        };
    },
};
