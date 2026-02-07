/**
 * @fileoverview Forbid the use of global expect.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-global-expect"),
    RuleTester = require("eslint").RuleTester,
    testUtils = require("../../testUtils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-global-expect", rule, {
    valid: [
        testUtils.wrapInTest("assert.expect(1);"),
        {
            code: testUtils.wrapInTest("assert.expect(1);"),
            languageOptions: { globals: { expect: true } },
        },

        // Global overridden by local import/declaration.
        {
            code: `import expect from 'foo'; ${testUtils.wrapInTest(
                "expect(1);",
            )}`,
            languageOptions: { globals: { expect: true } },
        },
        {
            code: `import { expect } from 'foo'; ${testUtils.wrapInTest(
                "expect(1);",
            )}`,
            languageOptions: { globals: { expect: true } },
        },
        {
            code: `var expect = require('foo'); ${testUtils.wrapInTest(
                "expect(1);",
            )}`,
            languageOptions: { globals: { expect: true } },
        },
        {
            code: `var expect = () => {}; ${testUtils.wrapInTest(
                "expect(1);",
            )}`,
            languageOptions: { globals: { expect: true } },
        },
        {
            code: `function expect() {}; ${testUtils.wrapInTest("expect(1);")}`,
            languageOptions: { globals: { expect: true } },
        },
    ],

    invalid: [
        {
            code: testUtils.wrapInTest("expect(1)"),
            languageOptions: { globals: { expect: true } },
            errors: [
                {
                    messageId: "unexpectedGlobalExpect",
                },
            ],
        },
    ],
});
