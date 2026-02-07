/**
 * @fileoverview Forbid overwriting of QUnit logging callbacks.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-reassign-log-callbacks"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-reassign-log-callbacks", rule, {
    valid: [
        "QUnit.begin(function () { });",
        "QUnit.done(function () { });",
        "QUnit.log(function () { });",
        "QUnit.moduleDone(function () { });",
        "QUnit.moduleStart(function () { });",
        "QUnit.testDone(function () { });",
        "QUnit.testStart(function () { });",

        // Assigning to other QUnit properties is okay
        "QUnit.blah = function () { };",
    ],

    invalid: [
        {
            code: "QUnit.begin = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.done = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.log = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.moduleDone = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.moduleStart = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.testDone = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
        {
            code: "QUnit.testStart = function () { };",
            errors: [
                {
                    messageId: "noReassignLogCallbacks",
                },
            ],
        },
    ],
});
