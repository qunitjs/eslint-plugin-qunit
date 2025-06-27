/**
 * @fileoverview Forbid the use of global module/test/asyncTest.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ReferenceTracker } = require("eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow global module/test/asyncTest",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-global-module-test.md",
        },
        messages: {
            unexpectedGlobalModuleTest: "Unexpected global `{{ callee }}`.",
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
                const traceMap = {
                    asyncTest: { [ReferenceTracker.CALL]: true },
                    module: { [ReferenceTracker.CALL]: true },
                    test: { [ReferenceTracker.CALL]: true },
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
                        messageId: "unexpectedGlobalModuleTest",
                        data: {
                            callee: node.callee.name,
                        },
                    });
                }
            },
        };
    },
};
