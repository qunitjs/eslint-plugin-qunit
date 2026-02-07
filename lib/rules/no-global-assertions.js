/**
 * @fileoverview Forbid the use of global QUnit assertions.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { getAssertionNames } = require("../utils");
const { ReferenceTracker } = require("@eslint-community/eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow global QUnit assertions",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-global-assertions.md",
        },
        messages: {
            unexpectedGlobalAssertion:
                "Unexpected global `{{ assertion }}` assertion.",
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
                    : context.getScope();

                const tracker = new ReferenceTracker(scope);
                /** @type {Record<string, { [ReferenceTracker.CALL]: boolean }>} */
                const traceMap = {};
                for (const assertionName of getAssertionNames()) {
                    traceMap[assertionName] = { [ReferenceTracker.CALL]: true };
                }

                for (const { node } of tracker.iterateGlobalReferences(
                    traceMap,
                )) {
                    if (node.type !== "CallExpression") {
                        continue;
                    }
                    if (node.callee.type !== "Identifier") {
                        continue;
                    }
                    context.report({
                        node: node,
                        messageId: "unexpectedGlobalAssertion",
                        data: {
                            assertion: node.callee.name,
                        },
                    });
                }
            },
        };
    },
};
