/**
 * @fileoverview disallow async module callbacks
 * @author Raymond Cohen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-async-module-callbacks"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const messageId = "noAsyncModuleCallbacks";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-async-module-callbacks", rule, {
    valid: [
        "QUnit.module('single argument');",
        "module('single argument');",
        "QUnit.module('module-a', function() { });",
        "QUnit.module('module-a', function(hooks) { hooks.beforeEach(function() {}); });",
        "module('module-a', function() { });",
        "module('module-a', function(hooks) { hooks.beforeEach(function() {}); });",
        "QUnit.module('module-a', () => { });",
        "module('module-a', () => { });",
    ],

    invalid: [
        {
            code: "QUnit.module('module-a', async function () {});",
            errors: [
                {
                    messageId,
                },
            ],
        },
        {
            code: "module('module-a', async function () {});",
            errors: [
                {
                    messageId,
                },
            ],
        },
        {
            code: "QUnit.module('module-a', async () => {});",
            errors: [
                {
                    messageId,
                },
            ],
        },
        {
            code: "module('module-a', async () => {});",
            errors: [
                {
                    messageId,
                },
            ],
        },
    ],
});
