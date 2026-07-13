/**
 * @fileoverview Entry point for eslint-plugin-qunit. Exports rules and configs.
 * @author Kevin Partington
 */

/* eslint sort-keys: "error" */

"use strict";

const path = require("node:path");

const pathParts = __dirname.split(path.sep);
const pkg =
    pathParts[pathParts.length - 1] === "dist"
        ? // @ts-expect-error -- TODO: ESM/TypeScript conversion should fix this.
          require("../package.json") // eslint-disable-line n/no-missing-require -- this is the path when this file is compiled to dist/
        : // @ts-expect-error -- TODO: ESM/TypeScript conversion should fix this.
          require("./package.json");

module.exports = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },

    rules: {
        "assert-args": require("./lib/rules/assert-args"),
        "literal-compare-order": require("./lib/rules/literal-compare-order"),
        "no-arrow-tests": require("./lib/rules/no-arrow-tests"),
        "no-assert-equal": require("./lib/rules/no-assert-equal"),
        "no-assert-equal-boolean": require("./lib/rules/no-assert-equal-boolean"),
        "no-assert-logical-expression": require("./lib/rules/no-assert-logical-expression"),
        "no-assert-ok": require("./lib/rules/no-assert-ok"),
        "no-async-in-loops": require("./lib/rules/no-async-in-loops"),
        "no-async-module-callbacks": require("./lib/rules/no-async-module-callbacks"),
        "no-async-test": require("./lib/rules/no-async-test"),
        "no-commented-tests": require("./lib/rules/no-commented-tests"),
        "no-compare-relation-boolean": require("./lib/rules/no-compare-relation-boolean"),
        "no-conditional-assertions": require("./lib/rules/no-conditional-assertions"),
        "no-early-return": require("./lib/rules/no-early-return"),
        "no-global-assertions": require("./lib/rules/no-global-assertions"),
        "no-global-expect": require("./lib/rules/no-global-expect"),
        "no-global-module-test": require("./lib/rules/no-global-module-test"),
        "no-global-stop-start": require("./lib/rules/no-global-stop-start"),
        "no-hooks-from-ancestor-modules": require("./lib/rules/no-hooks-from-ancestor-modules"),
        "no-identical-names": require("./lib/rules/no-identical-names"),
        "no-init": require("./lib/rules/no-init"),
        "no-jsdump": require("./lib/rules/no-jsdump"),
        "no-loose-assertions": require("./lib/rules/no-loose-assertions"),
        "no-negated-ok": require("./lib/rules/no-negated-ok"),
        "no-nested-tests": require("./lib/rules/no-nested-tests"),
        "no-ok-equality": require("./lib/rules/no-ok-equality"),
        "no-only": require("./lib/rules/no-only"),
        "no-qunit-push": require("./lib/rules/no-qunit-push"),
        "no-qunit-start-in-tests": require("./lib/rules/no-qunit-start-in-tests"),
        "no-qunit-stop": require("./lib/rules/no-qunit-stop"),
        "no-reassign-log-callbacks": require("./lib/rules/no-reassign-log-callbacks"),
        "no-reset": require("./lib/rules/no-reset"),
        "no-setup-teardown": require("./lib/rules/no-setup-teardown"),
        "no-skip": require("./lib/rules/no-skip"),
        "no-test-expect-argument": require("./lib/rules/no-test-expect-argument"),
        "no-throws-string": require("./lib/rules/no-throws-string"),
        "require-expect": require("./lib/rules/require-expect"),
        "require-object-in-propequal": require("./lib/rules/require-object-in-propequal"),
        "resolve-async": require("./lib/rules/resolve-async"),
    },

    // eslint-disable-next-line sort-keys
    configs: {
        recommended: {
            plugins: ["qunit"],
            rules: /** @type {import('eslint').Linter.RulesRecord} */ ({
                "qunit/assert-args": "error",
                "qunit/literal-compare-order": "error",
                "qunit/no-assert-equal": "error",
                "qunit/no-assert-equal-boolean": "error",
                "qunit/no-assert-logical-expression": "error",
                "qunit/no-async-in-loops": "error",
                "qunit/no-async-module-callbacks": "error",
                "qunit/no-async-test": "error",
                "qunit/no-commented-tests": "error",
                "qunit/no-compare-relation-boolean": "error",
                "qunit/no-conditional-assertions": "error",
                "qunit/no-early-return": "error",
                "qunit/no-global-assertions": "error",
                "qunit/no-global-expect": "error",
                "qunit/no-global-module-test": "error",
                "qunit/no-global-stop-start": "error",
                "qunit/no-hooks-from-ancestor-modules": "error",
                "qunit/no-identical-names": "error",
                "qunit/no-init": "error",
                "qunit/no-jsdump": "error",
                "qunit/no-negated-ok": "error",
                "qunit/no-nested-tests": "error",
                "qunit/no-ok-equality": "error",
                "qunit/no-only": "error",
                "qunit/no-qunit-push": "error",
                "qunit/no-qunit-start-in-tests": "error",
                "qunit/no-qunit-stop": "error",
                "qunit/no-reassign-log-callbacks": "error",
                "qunit/no-reset": "error",
                "qunit/no-setup-teardown": "error",
                "qunit/no-test-expect-argument": "error",
                "qunit/no-throws-string": "error",
                "qunit/require-expect": "error",
                "qunit/require-object-in-propequal": "error",
                "qunit/resolve-async": "error",
            }),
        },
    },
};
