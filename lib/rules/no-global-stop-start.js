/**
 * @fileoverview Forbid use of global stop()/start().
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

const { ReferenceTracker } = require("eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow global stop/start",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-global-stop-start.md",
        },
        messages: {
            unexpectedGlobalStopStart: "Unexpected global {{callee}}() call.",
        },
        schema: [],
    },

    create: function (context) {
        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

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
                const traceMap = {
                    start: { [ReferenceTracker.CALL]: true },
                    stop: { [ReferenceTracker.CALL]: true },
                };

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
                        messageId: "unexpectedGlobalStopStart",
                        data: {
                            callee: node.callee.name,
                        },
                    });
                }
            },
        };
    },
};
