/**
 * @fileoverview forbid QUnit.start() within tests or test hooks
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-qunit-start-in-tests"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {string} context
 * @returns {{messageId: string, data: Record<string, string>}}
 */
function createError(context) {
    return {
        messageId: "noQUnitStartInTests",
        data: {
            context,
        },
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-qunit-start-in-tests", rule, {
    valid: [
        // Must allow QUnit.start() outside of test contexts
        "QUnit.start();",

        // Must allow QUnit.start() in module properties that are not hooks
        'QUnit.module("a module", { notAHook: function() { QUnit.start(); } });',
    ],

    invalid: [
        {
            code: 'QUnit.asyncTest("test", function(assert) { QUnit.start(); });',
            errors: [createError("test")],
        },

        // Module hooks
        {
            code: 'QUnit.module("module", { beforeEach: function() { QUnit.start(); } });',
            errors: [createError("beforeEach hook")],
        },
        {
            code: 'QUnit.module("module", { afterEach: function() { QUnit.start(); } });',
            errors: [createError("afterEach hook")],
        },
        {
            code: 'QUnit.module("module", { setup: function() { QUnit.start(); } });',
            errors: [createError("setup hook")],
        },
        {
            code: 'QUnit.module("module", { teardown: function() { QUnit.start(); } });',
            errors: [createError("teardown hook")],
        },

        // Module hooks (new-style modules)
        /* Enable when supported
        {
            code: "QUnit.module(\"module\", function(hooks) { hooks.beforeEach(function() { QUnit.start(); }); });",
            errors: [createError("beforeEach hook")]
        },
        {
            code: "QUnit.module(\"module\", function(hooks) { hooks.afterEach(function() { QUnit.start(); }); });",
            errors: [createError("afterEach hook")]
        }
        */
    ],
});
