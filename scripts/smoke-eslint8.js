/**
 * @fileoverview Smoke-test eslint-plugin-qunit under the ESLint 8.38 peer minimum.
 *
 * The mocha RuleTester suite uses flat-config `languageOptions`, which ESLint 8
 * rejects, so CI exercises the legacy `plugins: ["qunit"]` config instead.
 */
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { ESLint } = require("eslint");

const fixture = `
QUnit.module("mod", function () {
    QUnit.only("test", function (assert) {
        assert.ok(true);
    });
});
`;

async function main() {
    const eslint = new ESLint({
        useEslintrc: false,
        cwd: path.join(__dirname, ".."),
        resolvePluginsRelativeTo: path.join(__dirname, ".."),
        overrideConfig: {
            plugins: ["qunit"],
            rules: {
                "qunit/no-only": "error",
            },
        },
    });

    const [result] = await eslint.lintText(fixture, {
        filePath: "smoke-eslint8-fixture.js",
    });

    assert.ok(result, "expected a lint result");
    assert.ok(
        result.messages.some(
            (message) =>
                message.ruleId === "qunit/no-only" && message.severity === 2,
        ),
        `expected qunit/no-only to fire, got: ${JSON.stringify(result.messages, null, 2)}`,
    );

    // eslint-disable-next-line no-console -- smoke script progress
    console.log("eslint@8.38 smoke passed (qunit/no-only)");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
