/**
 * @fileoverview Unit tests for the package index.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert/strict"),
    { rules, configs } = require("../index"),
    fs = require("node:fs"),
    path = require("node:path"),
    plugin = require("../index.js"),
    recommendedFlatConfig = require("../lib/configs/recommended.js");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * @param {string} fileName
 * @returns {boolean}
 */
function isSourceFile(fileName) {
    return /\.[cm]?[jt]s$/.test(fileName);
}

/**
 * @param {string} fileName
 * @returns {string}
 */
function sourceBasename(fileName) {
    return path.basename(fileName, path.extname(fileName));
}

/**
 * @param {string} dir
 * @param {string} baseName
 * @returns {string | undefined}
 */
function findSourceFile(dir, baseName) {
    return [".js", ".ts", ".cjs", ".cts", ".mjs", ".mts"]
        .map((ext) => path.join(dir, `${baseName}${ext}`))
        .find((candidate) => fs.existsSync(candidate));
}

const ruleNames = fs
    .readdirSync("./lib/rules")
    .filter((fileName) => isSourceFile(fileName))
    .map((fileName) => sourceBasename(fileName));

const configDir = path.join(__dirname, "../lib/configs");
const flatConfigs = Object.fromEntries(
    fs
        .readdirSync(configDir)
        .filter((fileName) => isSourceFile(fileName))
        .map((fileName) => [
            sourceBasename(fileName),
            require(path.join(configDir, fileName)),
        ]),
);

describe("index.js", function () {
    describe("rules", function () {
        it("should export every rule file on disk and no extras", function () {
            assert.strictEqual(Object.keys(rules).length, ruleNames.length);
        });

        for (const ruleName of ruleNames) {
            describe(ruleName, function () {
                it("should appear in rule exports", function () {
                    assert.ok(
                        ruleName in rules,
                        `Rule export for ${ruleName} not present`,
                    );
                });

                it("should appear in tests", function () {
                    assert.ok(
                        findSourceFile("./tests/lib/rules", ruleName),
                        `tests/lib/rules/${ruleName}.{js,ts} should exist`,
                    );
                });

                it("should appear in docs", function (done) {
                    const docPath = `./docs/rules/${ruleName}.md`;

                    fs.access(docPath, function (err) {
                        assert.ok(
                            !err,
                            `docs/rules/${ruleName}.md should exist`,
                        );
                        done();
                    });
                });

                it("should have the right rule contents", function () {
                    const rulePath = findSourceFile("./lib/rules", ruleName);
                    assert.ok(rulePath, `lib/rules/${ruleName} should exist`);
                    const fileContents = fs.readFileSync(rulePath, "utf8");

                    assert.ok(
                        fileContents.includes(
                            "/** @type {import('eslint').Rule.RuleModule} */",
                        ) ||
                            fileContents.includes(
                                "satisfies Rule.RuleModule",
                            ) ||
                            fileContents.includes(
                                'satisfies import("eslint").Rule.RuleModule',
                            ) ||
                            fileContents.includes(
                                "satisfies import('eslint').Rule.RuleModule",
                            ),
                        "includes Rule.RuleModule type annotation (JSDoc or satisfies)",
                    );
                });
            });
        }
    });

    describe("configs", function () {
        describe("legacy", function () {
            // eslint-disable-next-line mocha/no-setup-in-describe -- rule doesn't like function calls like `Object.entries()`
            for (const [configName, config] of Object.entries(configs)) {
                describe(configName, function () {
                    it("has the right plugins", function () {
                        assert.deepStrictEqual(config.plugins, ["qunit"]);
                    });
                });
            }
        });

        describe("flat", function () {
            describe("load all flat configs", function () {
                // eslint-disable-next-line mocha/no-setup-in-describe -- rule doesn't like function calls like `Object.entries()`
                for (const [configName, config] of Object.entries(
                    flatConfigs,
                )) {
                    describe(configName, function () {
                        it("has the right plugins", function () {
                            assert.deepStrictEqual(config.plugins, {
                                qunit: plugin,
                            });
                        });
                    });
                }
            });

            describe("load via import to ensure the types work", function () {
                describe("recommended", function () {
                    it("has the right plugins", function () {
                        assert.deepStrictEqual(
                            recommendedFlatConfig.plugins.qunit,
                            plugin,
                        );
                    });

                    it("has the right rules", function () {
                        assert.deepStrictEqual(
                            recommendedFlatConfig.rules,
                            plugin.configs.recommended.rules,
                        );
                    });
                });
            });
        });
    });
});
