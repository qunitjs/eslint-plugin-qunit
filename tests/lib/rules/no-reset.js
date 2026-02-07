/**
 * @fileoverview Forbids use of QUnit.reset.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-reset"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-reset", rule, {
    valid: [
        // Only invocations are reported
        "QUnit.reset",

        // Only QUnit.reset() is reported
        "QUnit.init()",
    ],

    invalid: [
        {
            code: "QUnit.reset();",
            errors: [
                {
                    messageId: "noReset",
                },
            ],
        },
    ],
});
