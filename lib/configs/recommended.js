"use strict";

const plugin = require("../index.js");

module.exports = {
    plugins: { qunit: plugin },
    rules: plugin.configs.recommended.rules,
};
