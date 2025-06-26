/**
 * @fileoverview Forbid arrow functions as QUnit test/module callbacks.
 * @author Kevin Partington
 * @copyright 2016 Kevin Partington. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-arrow-tests"),
    RuleTester = require("eslint").RuleTester,
    outdent = require("outdent");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-arrow-tests", rule, {
    valid: [
        // tests
        "QUnit.test('test', function (assert) { assert.ok(true); });",
        "QUnit.test('test', function () { ok(true); });",
        "QUnit.asyncTest('test', function (assert) { assert.ok(true); });",
        "QUnit.asyncTest('test', function () { ok(true); });",
        "test('test', function (assert) { assert.ok(true); });",
        "test('test', function () { ok(true); });",
        "asyncTest('test', function (assert) { assert.ok(true); });",
        "asyncTest('test', function () { ok(true); });",

        // modules
        "QUnit.module('module', { setup: function () {} });",
        "QUnit.module('module', { teardown: function () {} });",
        "QUnit.module('module', { beforeEach: function () {} });",
        "QUnit.module('module', { afterEach: function () {} });",
        "module('module', { setup: function () {} });",
        "module('module', { teardown: function () {} });",
        "module('module', { beforeEach: function () {} });",
        "module('module', { afterEach: function () {} });",

        // not actually module hooks
        outdent`
          var a = {
              setup: () => {},
              teardown: () => {},
              beforeEach: () => {},
              afterEach: () => {}
          };
        `,
    ],

    invalid: [
        // tests
        {
            code: "QUnit.test('test', (assert) => { assert.ok(true); });",
            output: "QUnit.test('test', function(assert) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            // TypeScript: test callback is adding a type to `this`
            code: "QUnit.test('test', (this: LocalTestContext, assert) => { assert.ok(true); });",
            output: "QUnit.test('test', function(this: LocalTestContext, assert) { assert.ok(true); });",
            languageOptions: { parser: require("@typescript-eslint/parser") },
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('test', () => { ok(true); });",
            output: "QUnit.test('test', function() { ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.asyncTest('test', (assert) => { assert.ok(true); });",
            output: "QUnit.asyncTest('test', function(assert) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.asyncTest('test', () => { ok(true); });",
            output: "QUnit.asyncTest('test', function() { ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "test('test', (assert) => { assert.ok(true); });",
            output: "test('test', function(assert) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "test('test', () => { ok(true); });",
            output: "test('test', function() { ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "asyncTest('test', (assert) => { assert.ok(true); });",
            output: "asyncTest('test', function(assert) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "asyncTest('test', () => { ok(true); });",
            output: "asyncTest('test', function() { ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },

        // modules
        {
            code: "QUnit.module('module', { setup: () => {} });",
            output: "QUnit.module('module', { setup: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.module('module', { teardown: () => {} });",
            output: "QUnit.module('module', { teardown: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.module('module', { beforeEach: () => {} });",
            output: "QUnit.module('module', { beforeEach: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.module('module', { afterEach: () => {} });",
            output: "QUnit.module('module', { afterEach: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "module('module', { setup: () => {} });",
            output: "module('module', { setup: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "module('module', { teardown: () => {} });",
            output: "module('module', { teardown: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "module('module', { beforeEach: () => {} });",
            output: "module('module', { beforeEach: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "module('module', { afterEach: () => {} });",
            output: "module('module', { afterEach: function() {} });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },

        // No function body
        {
            code: "QUnit.test('test', () => ok(true));",
            output: "QUnit.test('test', function() { return ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },

        // Async function
        {
            code: "QUnit.test('test', async () => { assert.ok(false) })",
            output: "QUnit.test('test', async function() { assert.ok(false) })",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },

        // Comment placement
        {
            code: "QUnit.test('a test 1', /* comment */ assert => { assert.ok(true); });",
            output: "QUnit.test('a test 1', /* comment */ function(assert) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 2', (assert /* comment */) => { assert.ok(true); });",
            output: "QUnit.test('a test 2', function(assert /* comment */) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 3', (assert) /* comment */ => { assert.ok(true); });",
            output: "QUnit.test('a test 3', function(assert)/* comment */ { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 4', (assert) => /* comment */ { assert.ok(true); });",
            output: "QUnit.test('a test 4', function(assert)/* comment */ { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 5', (/* assert */) => { noop(); });",
            output: "QUnit.test('a test 5', function(/* assert */) { noop(); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 6', assert /* comment */ =>\n{ assert.ok(true); }\n);",
            output: "QUnit.test('a test 6', function(assert/* comment */) { assert.ok(true); }\n);",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 7', assert /* comment */ => { assert.ok(true); });",
            output: "QUnit.test('a test 7', function(assert/* comment */) { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
        {
            code: "QUnit.test('a test 8', assert => /* comment */ { assert.ok(true); });",
            output: "QUnit.test('a test 8', function(assert)/* comment */ { assert.ok(true); });",
            errors: [
                {
                    messageId: "noArrowFunction",
                    type: "ArrowFunctionExpression",
                },
            ],
        },
    ],
});
