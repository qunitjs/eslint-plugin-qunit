/**
 * @fileoverview Ensure that no unit test is commented out.
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
            description: "disallow commented tests",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-commented-tests.md",
        },
        messages: {
            unexpectedTestInComment:
                'Unexpected "{{callee}}" in comment. Use QUnit.skip outside of a comment.',
        },
        schema: [],
    },

    create: function (context) {
        const sourceCode = context.getSourceCode(),
            newlineRegExp = /\r\n|\r|\n/g,
            warningRegExp =
                /\b(QUnit\.test|QUnit\.asyncTest|QUnit\.skip|test|asyncTest)\s*\(\s*["'`]/g;

        /**
         * @param {string} text
         * @returns {number[]}
         */
        function getNewlineIndexes(text) {
            const indexes = [];
            let result;

            while ((result = newlineRegExp.exec(text)) !== null) {
                indexes.push(result.index + result[0].length);
            }

            return indexes;
        }

        /**
         * @param {import('estree').Node} node
         * @param {{term: string, loc: {line: number, column: number}}} warning
         */
        function reportWarning(node, warning) {
            context.report({
                node: node,
                loc: warning.loc,
                messageId: "unexpectedTestInComment",
                data: {
                    callee: warning.term,
                },
            });
        }

        /**
         * @param {import('estree').Node} node
         */
        function checkComment(node) {
            const warnings = [],
                text = sourceCode.getText(node),
                loc = node.loc?.start,
                newlineIndexes = getNewlineIndexes(text);

            let lineOffset = 0,
                currentNewlineIndex,
                result;

            while ((result = warningRegExp.exec(text)) !== null) {
                while (
                    newlineIndexes.length > 0 &&
                    result.index >= newlineIndexes[0]
                ) {
                    ++lineOffset;
                    currentNewlineIndex = newlineIndexes.shift();
                }

                if (loc === undefined) {
                    continue;
                }

                warnings.push({
                    term: result[1],
                    loc: {
                        line: loc.line + lineOffset,
                        column: lineOffset
                            ? result.index - (currentNewlineIndex ?? 0)
                            : loc.column + result.index,
                    },
                });
            }

            for (const warning of warnings) {
                reportWarning(node, warning);
            }
        }

        return {
            Program: function () {
                const comments = sourceCode
                    .getAllComments()
                    // @ts-expect-error -- Shebang is unrecognized.
                    .filter((comment) => comment.type !== "Shebang");
                for (const comment of comments) {
                    // @ts-expect-error -- Issue with Node vs. Comment type.
                    checkComment(comment);
                }
            },
        };
    },
};
