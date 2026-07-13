/**
 * @fileoverview Forbid the use of assert.equal/assert.ok/assert.notOk and suggest other assertions.
 * @author ventuno
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const GLOBAL_ERROR_MESSAGE_ID = "unexpectedGlobalLooseAssertion";
const LOCAL_ERROR_MESSAGE_ID = "unexpectedLocalLooseAssertion";
const DEFAULT_ASSERTIONS = ["equal", "ok", "notEqual", "notOk"];

const ERROR_MESSAGE_CONFIG = {
    equal: {
        unexpectedGlobalAssertionMessageId: GLOBAL_ERROR_MESSAGE_ID,
        unexpectedLocalAssertionMessageId: LOCAL_ERROR_MESSAGE_ID,
    },
    ok: {
        unexpectedGlobalAssertionMessageId: GLOBAL_ERROR_MESSAGE_ID,
        unexpectedLocalAssertionMessageId: LOCAL_ERROR_MESSAGE_ID,
    },
    notEqual: {
        unexpectedGlobalAssertionMessageId: GLOBAL_ERROR_MESSAGE_ID,
        unexpectedLocalAssertionMessageId: LOCAL_ERROR_MESSAGE_ID,
    },
    notOk: {
        unexpectedGlobalAssertionMessageId: GLOBAL_ERROR_MESSAGE_ID,
        unexpectedLocalAssertionMessageId: LOCAL_ERROR_MESSAGE_ID,
    },
};

/**
 * @typedef {{unexpectedGlobalAssertionMessage?: string, unexpectedLocalAssertionMessage?: string, unexpectedGlobalAssertionMessageId?: string, unexpectedLocalAssertionMessageId?: string}} ErrorMessageConfig
 * @param {string[]} disallowed
 * @returns {ErrorMessageConfig}
 */
function buildErrorMessage(disallowed) {
    const globalMessage = `Unexpected {{assertion}}. Use ${disallowed.join(
        ", ",
    )}.`;
    const localMessage = `Unexpected {{assertVar}}.{{assertion}}. Use ${disallowed
        .map((ass) => `{{assertVar}}.${ass}`)
        .join(", ")}.`;
    return {
        unexpectedGlobalAssertionMessage: globalMessage,
        unexpectedLocalAssertionMessage: localMessage,
    };
}

/**
 * @typedef {[Array<string | {disallowed: string, recommended: string[]}>, ...never[]]} Options
 * @param {Options} options
 * @returns {[string[], Record<string, ErrorMessageConfig>]}
 */
function parseOptions(options) {
    if (options[0]) {
        /** @type {string[]} */
        const assertions = [];
        /** @type {Record<string, ErrorMessageConfig>} */
        const errorMessageConfig = {};
        for (const assertion of options[0]) {
            if (typeof assertion === "string") {
                // Skip if rule was defined before.
                if (assertions.includes(assertion)) {
                    continue;
                }
                assertions.push(assertion);
                errorMessageConfig[assertion] =
                    ERROR_MESSAGE_CONFIG[
                        /** @type {keyof typeof ERROR_MESSAGE_CONFIG} */ (
                            assertion
                        )
                    ];
            } else {
                // Skip if rule was defined before.
                if (assertions.includes(assertion.disallowed)) {
                    continue;
                }
                assertions.push(assertion.disallowed);
                errorMessageConfig[assertion.disallowed] = buildErrorMessage(
                    assertion.recommended,
                );
            }
        }
        return [assertions, errorMessageConfig];
    }
    return [DEFAULT_ASSERTIONS, ERROR_MESSAGE_CONFIG];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow the use of assert.equal/assert.ok/assert.notEqual/assert.notOk",
            category: "Best Practices",
            url: "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/no-loose-assertions.md",
        },
        messages: {
            [GLOBAL_ERROR_MESSAGE_ID]:
                "Unexpected {{assertion}}. Use strictEqual, notStrictEqual, deepEqual, or propEqual.",
            [LOCAL_ERROR_MESSAGE_ID]:
                "Unexpected {{assertVar}}.{{assertion}}. Use {{assertVar}}.strictEqual, {{assertVar}}.notStrictEqual, {{assertVar}}.deepEqual, or {{assertVar}}.propEqual.",
        },
        schema: [
            {
                type: "array",
                minItems: 1,
                items: {
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                disallowed: {
                                    type: "string",
                                    enum: DEFAULT_ASSERTIONS,
                                },
                                recommended: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        minItems: 1,
                                    },
                                },
                            },
                            required: ["disallowed", "recommended"],
                            additionalProperties: false,
                        },
                        {
                            type: "string",
                            enum: DEFAULT_ASSERTIONS,
                        },
                    ],
                },
                uniqueItems: true,
            },
        ],
    },

    create: function (context) {
        const [assertions, errorMessageConfig] = parseOptions(
            /** @type {Options} */ (context.options),
        );
        return utils
            .createAssertionCheck(assertions, errorMessageConfig)
            .call(this, context);
    },
};
