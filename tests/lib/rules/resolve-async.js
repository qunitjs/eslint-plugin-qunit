/**
 * @fileoverview Ensure async hooks are resolved in QUnit tests.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/resolve-async"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @param {number} numberOfCalls
 * @returns {{messageId: string, data: {[]: string}}}
 */
function createNeedStartCallsMessage(numberOfCalls = 1) {
    const semaphore = numberOfCalls;
    const callOrCalls = semaphore === 1 ? "call" : "calls";

    return {
        messageId: "needMoreStartCalls",
        data: {
            semaphore,
            callOrCalls,
        },
    };
}

/**
 * @param {string=} callbackVar
 * @returns {{messageId: string, data: {[]: string}}}
 */
function createAsyncCallbackNotCalledMessage(callbackVar) {
    return {
        messageId: "asyncCallbackNotCalled",
        data: {
            asyncVar: callbackVar || "done",
        },
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("resolve-async", rule, {
    valid: [
        // stop()/start()
        "test('name', function () { stop(); start(); });",
        "asyncTest('name', function () { start(); });",
        "QUnit.test('name', function () { stop(); start(); });",
        "QUnit.asyncTest('name', function () { start(); });",
        "test('name', function () { QUnit.stop(); QUnit.start(); });",
        "asyncTest('name', function () { QUnit.start(); });",
        "QUnit.test('name', function () { QUnit.stop(); QUnit.start(); });",
        "QUnit.asyncTest('name', function () { QUnit.start(); });",

        "module('name', { setup: function () { stop(); start(); } });",
        "QUnit.module('name', { setup: function () { stop(); start(); } });",
        "module('name', { setup: function () { QUnit.stop(); QUnit.start(); } });",
        "QUnit.module('name', { setup: function () { QUnit.stop(); QUnit.start(); } });",
        "module('name', { teardown: function () { stop(); start(); } });",
        "QUnit.module('name', { teardown: function () { stop(); start(); } });",
        "module('name', { teardown: function () { QUnit.stop(); QUnit.start(); } });",
        "QUnit.module('name', { teardown: function () { QUnit.stop(); QUnit.start(); } });",
        "module('name', { beforeEach: function () { stop(); start(); } });",
        "QUnit.module('name', { beforeEach: function () { stop(); start(); } });",
        "module('name', { beforeEach: function () { QUnit.stop(); QUnit.start(); } });",
        "QUnit.module('name', { beforeEach: function () { QUnit.stop(); QUnit.start(); } });",
        "module('name', { afterEach: function () { stop(); start(); } });",
        "QUnit.module('name', { afterEach: function () { stop(); start(); } });",
        "module('name', { afterEach: function () { QUnit.stop(); QUnit.start(); } });",
        "QUnit.module('name', { afterEach: function () { QUnit.stop(); QUnit.start(); } });",

        // stop()/start() with semaphore args
        "test('name', function () { stop(2); start(); start(); });",
        "test('name', function () { stop(); stop(); start(2); });",
        "asyncTest('name', function () { stop(1); start(); start(); });",
        "asyncTest('name', function () { stop(); stop(); start(3); });",
        "QUnit.test('name', function () { stop(2); start(); start(); });",
        "QUnit.test('name', function () { stop(); stop(); start(2); });",
        "QUnit.asyncTest('name', function () { stop(1); start(); start(); });",
        "QUnit.asyncTest('name', function () { stop(); stop(); start(3); });",

        "module('name', { setup: function () { stop(2); start(); start(); } });",
        "QUnit.module('name', { setup: function () { stop(2); start(); start(); } });",
        "module('name', { setup: function () { QUnit.stop(2); QUnit.start(); QUnit.start(); } });",
        "QUnit.module('name', { setup: function () { QUnit.stop(2); QUnit.start(); QUnit.start(); } });",
        "module('name', { teardown: function () { stop(); start(); start(); } });",
        "QUnit.module('name', { teardown: function () { stop(); start(); start(); } });",
        "module('name', { teardown: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",
        "QUnit.module('name', { teardown: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",
        "module('name', { beforeEach: function () { stop(); start(); start(); } });",
        "QUnit.module('name', { beforeEach: function () { stop(); start(); start(); } });",
        "module('name', { beforeEach: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",
        "QUnit.module('name', { beforeEach: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",
        "module('name', { afterEach: function () { stop(); start(); start(); } });",
        "QUnit.module('name', { afterEach: function () { stop(); start(); start(); } });",
        "module('name', { afterEach: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",
        "QUnit.module('name', { afterEach: function () { QUnit.stop(); QUnit.start(); QUnit.start(); } });",

        // assert.async()
        "test('name', function (assert) { var done = assert.async(); done(); });",
        "QUnit.test('name', function (assert) { var done = assert.async(); done(); });",
        "test('name', function (assert) { var done; done = assert.async(); done(); });",
        "QUnit.test('name', function (assert) { var done; done = assert.async(); done(); });",

        "module('name', { setup: function () { var done = assert.async(); done(); } });",
        "QUnit.module('name', { setup: function () { var done = assert.async(); done(); } });",
        "module('name', { teardown: function () { var done = assert.async(); done(); } });",
        "QUnit.module('name', { teardown: function () { var done = assert.async(); done(); } });",
        "module('name', { beforeEach: function () { var done = assert.async(); done(); } });",
        "QUnit.module('name', { beforeEach: function () { var done = assert.async(); done(); } });",
        "module('name', { afterEach: function () { var done = assert.async(); done(); } });",
        "QUnit.module('name', { afterEach: function () { var done = assert.async(); done(); } });",

        // assert.async callback can be invoked via .call/.apply
        "QUnit.test('name', function (assert) { var done = assert.async(); done.call(); });",
        "QUnit.test('name', function (assert) { var done = assert.async(); done.apply(); });",

        // start/stop calls outside of test context should not affect count
        "start(); test('name', function () { stop(); start(); });",
        "stop(); test('name', function () { stop(); start(); });",
        "start(); asyncTest('name', function () { start(); });",
        "stop(); asyncTest('name', function () { start(); });",
        "start(); QUnit.test('name', function () { stop(); start(); });",
        "stop(); QUnit.test('name', function () { stop(); start(); });",
        "start(); QUnit.asyncTest('name', function () { start(); });",
        "stop(); QUnit.asyncTest('name', function () { start(); });",
        "QUnit.start(); test('name', function () { QUnit.stop(); QUnit.start(); });",
        "QUnit.stop(); test('name', function () { QUnit.stop(); QUnit.start(); });",
        "QUnit.start(); asyncTest('name', function () { QUnit.start(); });",
        "QUnit.stop(); asyncTest('name', function () { QUnit.start(); });",
        "QUnit.start(); QUnit.test('name', function () { QUnit.stop(); QUnit.start(); });",
        "QUnit.stop(); QUnit.test('name', function () { QUnit.stop(); QUnit.start(); });",
        "QUnit.start(); QUnit.asyncTest('name', function () { QUnit.start(); });",
        "QUnit.stop(); QUnit.asyncTest('name', function () { QUnit.start(); });",

        // assert.async() calls outside of test context should not matter
        "var done = assert.async(); QUnit.test('name', function (assert) {});",
        "var done = assert.async(); QUnit.test('name', function (assert) { done(); });",
        "var done1 = assert.async(); QUnit.test('name', function (assert) { var done2 = assert.async(); done2(); });",

        // async calls can be done using a different variable
        "QUnit.test('name', function (foo) { var done = foo.async(); done(); });",
        "QUnit.test('name', function (foo) { var done; done = assert.async(); });",

        // module properties that aren't hooks should not be flagged
        "QUnit.module({ someProp: function () { QUnit.stop(); } });",
        "QUnit.module({ someProp: function (assert) { assert.async(); } });",
    ],

    invalid: [
        // stop()/start()
        {
            code: "asyncTest('name', function () {});",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "test('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.asyncTest('name', function () {});",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.test('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "test('name', function () { QUnit.stop(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.test('name', function () { QUnit.stop(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.module('name', { setup: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.module('name', { teardown: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.module('name', { before: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage("Property")],
        },
        {
            code: "QUnit.module('name', { beforeEach: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.module('name', { afterEach: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "QUnit.module('name', { after: function () { QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage("Property")],
        },

        // Multiple start() calls needed
        {
            code: "asyncTest('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "test('name', function () { stop(); stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "test('name', function () { QUnit.stop(); stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.asyncTest('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.test('name', function () { stop(); stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.test('name', function () { stop(); QUnit.stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "asyncTest('name', function () { QUnit.stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "test('name', function () { QUnit.stop(); QUnit.stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.asyncTest('name', function () { QUnit.stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.test('name', function () { QUnit.stop(); QUnit.stop(); });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.module('name', { setup: function () { QUnit.stop(); QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.module('name', { teardown: function () { QUnit.stop(); QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.module('name', { beforeEach: function () { QUnit.stop(); QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage(2)],
        },
        {
            code: "QUnit.module('name', { afterEach: function () { QUnit.stop(); QUnit.stop(); } });",
            errors: [createNeedStartCallsMessage(2)],
        },

        // assert.async()
        {
            code: "test('name', function (assert) { var done = assert.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.test('name', function (assert) { var done = assert.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "test('name', function (assert) { var done; done = assert.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.test('name', function (assert) { var done; done = assert.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done; done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done; done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done; done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done; done = assert.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },

        // Multiple assert.async() calls
        {
            code: "test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "test('name', function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "test('name', function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.test('name', function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.test('name', function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done1 = assert.async(), done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ setup: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done1 = assert.async(), done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ teardown: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done1 = assert.async(), done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ beforeEach: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done1 = assert.async(), done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done1 = assert.async(), done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); done1(); } });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.module({ afterEach: function (assert) { var done1, done2; done1 = assert.async(); done2 = assert.async(); } });",
            errors: [
                createAsyncCallbackNotCalledMessage("done1"),
                createAsyncCallbackNotCalledMessage("done2"),
            ],
        },

        // assert.async callback can be invoked via .call/.apply
        {
            code: "QUnit.test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); done1.call(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },
        {
            code: "QUnit.test('name', function (assert) { var done1 = assert.async(), done2 = assert.async(); done1.apply(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },

        // start/stop calls outside of test context should not affect count
        {
            code: "start(); asyncTest('name', function () {});",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "start(); test('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "stop(); asyncTest('name', function () {});",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "stop(); test('name', function () { stop(); });",
            errors: [createNeedStartCallsMessage()],
        },

        // assert.async() calls outside of test context should not matter
        {
            code: "var done = assert.async(); asyncTest('name', function () { done(); });",
            errors: [createNeedStartCallsMessage()],
        },
        {
            code: "var done1 = assert.async(); QUnit.test('name', function (assert) { var done2 = assert.async(); done1(); });",
            errors: [createAsyncCallbackNotCalledMessage("done2")],
        },

        // async calls can be done using a different variable
        {
            code: "QUnit.test('name', function (foo) { var done = foo.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.test('name', (foo) => { var done = foo.async(); });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
        {
            code: "QUnit.module({ setup: function (foo) { var done = foo.async(); } });",
            errors: [createAsyncCallbackNotCalledMessage()],
        },
    ],
});
