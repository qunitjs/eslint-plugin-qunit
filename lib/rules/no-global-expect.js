/**
 * @fileoverview Forbid the use of global expect.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ReferenceTracker } = require("@eslint-community/eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow global expect",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-global-expect.md",
        },
        messages: {
            unexpectedGlobalExpect: "Unexpected global expect.",
        },
        schema: [],
    },

    create: function (context) {
        return {
            Program: function (node) {
                /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
                const sourceCode =
                    context.sourceCode ?? context.getSourceCode();
                /* istanbul ignore next: deprecated code paths only followed by old eslint versions */
                const scope = sourceCode.getScope
                    ? sourceCode.getScope(node)
                    : // @ts-expect-error -- removed in ESLint 10, but needed for ESLint 8 compat
                      context.getScope();

                const tracker = new ReferenceTracker(scope);
                const traceMap = { expect: { [ReferenceTracker.CALL]: true } };

                for (const { node } of tracker.iterateGlobalReferences(
                    traceMap,
                )) {
                    context.report({
                        node: node,
                        messageId: "unexpectedGlobalExpect",
                    });
                }
            },
        };
    },
};
