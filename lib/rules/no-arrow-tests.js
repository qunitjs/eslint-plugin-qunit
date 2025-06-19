/**
 * @fileoverview Forbid arrow functions as QUnit test/module callbacks.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description:
                "disallow arrow functions as QUnit test/module callbacks",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-arrow-tests.md",
        },
        fixable: "code",
        messages: {
            noArrowFunction:
                "Arrow function should not be used as test callback.",
        },
        schema: [],
    },

    create: function (context) {
        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // Fixer adapted from https://github.com/lo1tuma/eslint-plugin-mocha (MIT)
        const sourceCode = context.getSourceCode();

        /**
         * @param {number} start
         * @param {number} end
         * @returns {string}
         */
        function extractSourceTextByRange(start, end) {
            return sourceCode.text.slice(start, end).trim();
        }

        /**
         * @param {import('estree').FunctionExpression|import('estree').ArrowFunctionExpression} fn
         * @returns {string}
         */
        function formatFunctionHead(fn) {
            if (
                fn.type !== "FunctionExpression" &&
                fn.type !== "ArrowFunctionExpression"
            ) {
                return "";
            }
            const arrow = sourceCode.getTokenBefore(fn.body);
            if (!arrow) {
                return "";
            }
            const beforeArrowToken = sourceCode.getTokenBefore(arrow);
            if (!beforeArrowToken) {
                return "";
            }
            let firstToken = sourceCode.getFirstToken(fn);
            if (!firstToken) {
                return "";
            }

            let functionKeyword = "function";
            let params = extractSourceTextByRange(
                firstToken.range[0],
                beforeArrowToken.range[1],
            );
            if (fn.async) {
                // When 'async' specified strip the token from the params text
                // and prepend it to the function keyword
                params = params
                    .slice(firstToken.range[1] - firstToken.range[0])
                    .trim();
                functionKeyword = "async function";

                // Advance firstToken pointer
                firstToken = sourceCode.getTokenAfter(firstToken);
            }

            if (!firstToken) {
                return "";
            }

            if (!fn.body.range) {
                return "";
            }

            const beforeArrowComment = extractSourceTextByRange(
                beforeArrowToken.range[1],
                arrow.range[0],
            );
            const afterArrowComment = extractSourceTextByRange(
                arrow.range[1],
                fn.body.range[0],
            );
            const paramsFullText =
                firstToken.type === "Punctuator"
                    ? `${params}${beforeArrowComment}${afterArrowComment}`
                    : `(${params}${beforeArrowComment})${afterArrowComment}`;

            return `${functionKeyword}${paramsFullText} `;
        }

        /**
         * @param {any} fixer
         * @param {import('estree').Node} fn
         */
        function fixArrowFunction(fixer, fn) {
            if (
                fn.type !== "FunctionExpression" &&
                fn.type !== "ArrowFunctionExpression"
            ) {
                return null;
            }
            if (!fn.range || !fn.body.range) {
                return null;
            }
            if (fn.body.type === "BlockStatement") {
                // When it((...) => { ... }),
                // simply replace '(...) => ' with 'function () '
                return fixer.replaceTextRange(
                    [fn.range[0], fn.body.range[0]],
                    formatFunctionHead(fn),
                );
            }

            const bodyText = sourceCode.text.slice(
                fn.body.range[0],
                fn.body.range[1],
            );
            return fixer.replaceTextRange(
                [fn.range[0], fn.range[1]],
                `${formatFunctionHead(fn)}{ return ${bodyText}; }`,
            );
        }

        /**
         * @param {import('estree').Node} fn
         */
        function checkCallback(fn) {
            if (fn && fn.type === "ArrowFunctionExpression") {
                context.report({
                    node: fn,
                    messageId: "noArrowFunction",
                    fix: (fixer) => fixArrowFunction(fixer, fn),
                });
            }
        }

        /**
         * @param {import('eslint').Rule.Node} propertyNode
         * @returns {boolean}
         */
        function isPropertyInModule(propertyNode) {
            return (
                propertyNode &&
                propertyNode.parent &&
                propertyNode.parent.type === "ObjectExpression" &&
                propertyNode.parent.parent &&
                propertyNode.parent.parent.type === "CallExpression" &&
                utils.isModule(propertyNode.parent.parent.callee)
            );
        }

        /**
         * @param {import('eslint').Rule.Node} propertyNode
         * @returns {boolean}
         */
        function isModuleProperty(propertyNode) {
            return (
                propertyNode.type === "Property" &&
                isPropertyInModule(propertyNode) &&
                utils.isModuleHookPropertyKey(propertyNode.key)
            );
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            CallExpression: function (node) {
                if (
                    utils.isTest(node.callee) &&
                    node.arguments &&
                    node.arguments.length > 1
                ) {
                    checkCallback(node.arguments[1]);
                }
            },

            Property: function (node) {
                if (isModuleProperty(node)) {
                    checkCallback(node.value);
                }
            },
        };
    },
};
