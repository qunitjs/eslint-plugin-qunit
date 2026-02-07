/**
 * @fileoverview Forbid the use of QUnit.push.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-qunit-push"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-qunit-push", rule, {
    valid: [
        "this.pushResult({ result: result, actual: actual, expected: expected, message: message });",
    ],

    invalid: [
        {
            code: "QUnit.push(result, actual, expected, message);",
            errors: [
                {
                    messageId: "noQUnitPush",
                },
            ],
        },
    ],
});
