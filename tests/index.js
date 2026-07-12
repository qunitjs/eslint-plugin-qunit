/**
 * @fileoverview Unit tests for the package index.
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    { rules, configs } = require("../index"),
    fs = require("node:fs"),
    path = require("node:path"),
    plugin = require("../index.js"),
    recommendedFlatConfig = require("../lib/configs/recommended.js");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleNames = fs
    .readdirSync("./lib/rules")
    .map((rawFileName) => path.basename(rawFileName, ".js"));

const configDir = path.join(__dirname, "../lib/configs");
const flatConfigs = Object.fromEntries(
    fs
        .readdirSync(configDir)
        .filter((fileName) => fileName.endsWith(".js"))
        .map((fileName) => [
            path.basename(fileName, ".js"),
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
                    assert.property(
                        rules,
                        ruleName,
                        `Rule export for ${ruleName} not present`,
                    );
                });

                it("should appear in tests", function (done) {
                    const path = `./tests/lib/rules/${ruleName}.js`;

                    fs.access(path, function (err) {
                        assert.notOk(
                            err,
                            `tests/lib/rules/${ruleName}.js should exist`,
                        );
                        done();
                    });
                });

                it("should appear in docs", function (done) {
                    const path = `./docs/rules/${ruleName}.md`;

                    fs.access(path, function (err) {
                        assert.notOk(
                            err,
                            `docs/rules/${ruleName}.md should exist`,
                        );
                        done();
                    });
                });

                it("should have the right rule contents", function () {
                    const path = `./lib/rules/${ruleName}.js`;
                    const fileContents = fs.readFileSync(path, "utf8");

                    assert.ok(
                        fileContents.includes(
                            "/** @type {import('eslint').Rule.RuleModule} */",
                        ),
                        "includes jsdoc comment for rule type",
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
