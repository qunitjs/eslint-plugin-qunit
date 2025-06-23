"use strict";

const js = require("@eslint/js");
const eslintPluginEslintComments = require("@eslint-community/eslint-plugin-eslint-comments/configs");
const eslintPluginEslintPluginAll = require("eslint-plugin-eslint-plugin/configs/all");
const eslintPluginMarkdown = require("eslint-plugin-markdown");
const eslintPluginMocha = require("eslint-plugin-mocha");
const eslintPluginN = require("eslint-plugin-n");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const eslintPluginUnicorn = require("eslint-plugin-unicorn");
const globals = require("globals");

module.exports = [
    js.configs.recommended,

    eslintPluginEslintComments.recommended,
    eslintPluginEslintPluginAll,
    eslintPluginN.configs["flat/recommended"],
    eslintPluginPrettierRecommended,
    eslintPluginUnicorn.configs["flat/recommended"],

    {
        ...eslintPluginMocha.configs.flat.recommended,
        files: ["tests/**/*.js"],
    },

    {
        languageOptions: {
            sourceType: "script",
            ecmaVersion: "latest",
            globals: globals.node,
        },
        rules: {
            camelcase: ["error", { properties: "always" }],
            complexity: ["error", 10],
            "consistent-return": "error",
            "consistent-this": ["error", "self"],
            curly: ["error", "multi-line"],
            "default-case": "error",
            "dot-notation": "error",
            eqeqeq: "error",
            "func-style": ["error", "declaration"],
            "guard-for-in": "error",
            "lines-around-comment": [
                "error",
                {
                    beforeBlockComment: false,
                    afterBlockComment: false,
                    beforeLineComment: true,
                    afterLineComment: false,
                    allowBlockStart: true,
                    allowBlockEnd: true,
                    allowObjectStart: true,
                    allowObjectEnd: true,
                    allowArrayStart: true,
                    allowArrayEnd: true,
                },
            ],
            "max-depth": ["error", 5],
            "new-cap": ["error", { newIsCap: true, capIsNew: true }],
            "no-array-constructor": "error",
            "no-caller": "error",
            "no-catch-shadow": "error",
            "no-cond-assign": ["error", "except-parens"],
            "no-console": "error",
            "no-const-assign": "error",
            "no-constant-condition": "error",
            "no-control-regex": "error",
            "no-debugger": "error",
            "no-delete-var": "error",
            "no-dupe-args": "error",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error",
            "no-else-return": "error",
            "no-empty": "error",
            "no-empty-character-class": "error",
            "no-empty-function": "error",
            "no-eval": "error",
            "no-ex-assign": "error",
            "no-extend-native": "error",
            "no-extra-boolean-cast": "error",
            "no-fallthrough": "error",
            "no-func-assign": "error",
            "no-implied-eval": "error",
            "no-invalid-regexp": "error",
            "no-irregular-whitespace": "error",
            "no-labels": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            "no-loop-func": "error",
            "no-mixed-requires": "error",
            "no-multi-str": "error",
            "no-unsafe-negation": "error",
            "no-nested-ternary": "error",
            "no-new-func": "error",
            "no-new-object": "error",
            "no-new-require": "error",
            "no-new-wrappers": "error",
            "no-octal": "error",
            "no-octal-escape": "error",
            "no-path-concat": "error",
            "no-process-exit": "error",
            "no-redeclare": "error",
            "no-return-assign": "error",
            "no-regex-spaces": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-sparse-arrays": "error",
            "no-template-curly-in-string": "error",
            "no-throw-literal": "error",
            "no-trailing-spaces": "error",
            "no-undef": "error",
            "no-undefined": "error",
            "no-underscore-dangle": "error",
            "no-unexpected-multiline": "error",
            "no-unmodified-loop-condition": "error",
            "no-unneeded-ternary": "error",
            "no-unreachable": "error",
            "no-unsafe-finally": "error",
            "no-unused-expressions": "error",
            "no-unused-vars": "error",
            "no-use-before-define": "error",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-useless-escape": "error",
            "no-useless-return": "error",
            "no-var": "error",
            "no-with": "error",
            "operator-assignment": ["error", "always"],
            "prefer-const": "error",
            "prefer-template": "error",
            radix: "error",
            "spaced-comment": ["error", "always", { exceptions: ["-"] }],
            strict: ["error", "global"],
            "use-isnan": "error",
            "valid-typeof": "error",
            yoda: ["error", "never"],

            // eslint-plugin-eslint-plugin
            "eslint-plugin/meta-property-ordering": [
                "error",
                [
                    "type",
                    "docs",
                    "fixable",
                    "messages",
                    "schema",
                    "deprecated",
                    "replacedBy",
                ],
            ],
            "eslint-plugin/no-meta-schema-default": "off", // TODO: enable this.
            "eslint-plugin/require-meta-default-options": "off", // TODO: enable this.
            "eslint-plugin/require-meta-docs-recommended": "off", // We're not currently using this property.
            "eslint-plugin/require-meta-docs-url": [
                "error",
                {
                    pattern:
                        "https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/{{name}}.md",
                },
            ],
            "eslint-plugin/require-meta-schema-description": "off", // TODO: enable this.

            // eslint-plugin-n
            "n/no-missing-require": [
                "error",
                {
                    allowModules: ["@typescript-eslint/parser"],
                },
            ],

            // prettier
            "prettier/prettier": [
                "error",
                {
                    tabWidth: 4,
                },
            ],

            // eslint-plugin-unicorn
            "unicorn/consistent-function-scoping": "off",
            "unicorn/empty-brace-spaces": "off",
            "unicorn/filename-case": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/no-null": "off",
            "unicorn/prefer-at": "off", // TODO: enable once we raise Node requirement to v16.6.0
            "unicorn/prefer-module": "off",
            "unicorn/prevent-abbreviations": "off",
        },
    },
    {
        files: ["**/*.md"],
        plugins: { markdown: eslintPluginMarkdown },
        processor: "markdown/markdown",
    },
    {
        // Markdown code samples.
        files: ["**/*.md/*.js", "**/*.md/*.javascript"],
        languageOptions: {
            parserOptions: {
                sourceType: "module",
            },
        },
        rules: {
            eqeqeq: "off",
            "guard-for-in": "off",
            "no-constant-condition": "off",
            "no-empty-function": "off",
            "no-undef": "off",
            "no-unused-expressions": "off",
            "no-unused-vars": "off",
            "no-var": "off",
            strict: "off",
        },
    },
];
