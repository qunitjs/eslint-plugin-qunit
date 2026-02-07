/**
 * @fileoverview Forbid setup/teardown module hooks
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-setup-teardown"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-setup-teardown", rule, {
    valid: [
        // Modules without hooks are always fine
        "QUnit.module('Module');",

        // beforeEach
        "QUnit.module('Module', { beforeEach: function () {} });",

        // afterEach
        "QUnit.module('Module', { afterEach: function () {} });",

        // both
        "QUnit.module('Module', { beforeEach: function () {}, afterEach: function () {} });",

        // other property names are not reported
        "QUnit.module('Module', { foo: function () {} });",
    ],

    invalid: [
        {
            code: "QUnit.module('module', { setup: function () { } });",
            output: "QUnit.module('module', { beforeEach: function () { } });",
            errors: [
                {
                    messageId: "noSetupTeardown",
                    data: {
                        forbidden: "setup",
                        preferred: "beforeEach",
                    },
                },
            ],
        },
        {
            code: "QUnit.module('module', { teardown: function () { } });",
            output: "QUnit.module('module', { afterEach: function () { } });",
            errors: [
                {
                    messageId: "noSetupTeardown",
                    data: {
                        forbidden: "teardown",
                        preferred: "afterEach",
                    },
                },
            ],
        },
        {
            code: "QUnit.module('module', { setup: function () {}, teardown: function () { } });",
            output: "QUnit.module('module', { beforeEach: function () {}, afterEach: function () { } });",
            errors: [
                {
                    messageId: "noSetupTeardown",
                    data: {
                        forbidden: "setup",
                        preferred: "beforeEach",
                    },
                },
                {
                    messageId: "noSetupTeardown",
                    data: {
                        forbidden: "teardown",
                        preferred: "afterEach",
                    },
                },
            ],
        },
    ],
});
