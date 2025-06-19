/**
 * @fileoverview Forbid overwriting of QUnit logging callbacks.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
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
            description: "disallow overwriting of QUnit logging callbacks",
            category: "Possible Errors",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-reassign-log-callbacks.md",
        },
        messages: {
            noReassignLogCallbacks: "Do not reassign QUnit log callbacks.",
        },
        schema: [],
    },

    create: function (context) {
        const LOG_CALLBACKS = [
            "begin",
            "done",
            "log",
            "moduleDone",
            "moduleStart",
            "testDone",
            "testStart",
        ];

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        /** @type {Record<string, (node: import('estree').Node) => void>} */
        const visitors = {};

        for (const callbackName of LOG_CALLBACKS) {
            visitors[
                `AssignmentExpression[left.object.name='QUnit'][left.property.name='${callbackName}']`
            ] =
                /**
                 * @param {import('estree').Node} node
                 */
                function (node) {
                    context.report({
                        node: node,
                        messageId: "noReassignLogCallbacks",
                    });
                };
        }

        return visitors;
    },
};
