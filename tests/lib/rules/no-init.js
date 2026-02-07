/**
 * @fileoverview Forbids use of QUnit.init.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-init"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-init", rule, {
    valid: [
        // Only invocations are reported
        "QUnit.init",

        // Only QUnit.init() is reported
        "QUnit.reset()",
    ],

    invalid: [
        {
            code: "QUnit.init();",
            errors: [
                {
                    messageId: "noInit",
                },
            ],
        },
    ],
});
