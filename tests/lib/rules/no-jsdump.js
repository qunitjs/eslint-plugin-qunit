/**
 * @fileoverview Forbid use of QUnit.jsDump().
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-jsdump"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-jsdump", rule, {
    valid: ["QUnit.dump(obj);"],

    invalid: [
        {
            code: "QUnit.jsDump(obj);",
            errors: [
                {
                    messageId: "noJsDump",
                },
            ],
        },
    ],
});
