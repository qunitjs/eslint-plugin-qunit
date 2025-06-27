/**
 * @fileoverview Utility functions used by one or more rules.
 * @author Ed Sanders
 */
"use strict";

/**
 * @param {string} assertionCode
 * @returns {string}
 */
exports.wrapInTest = function (assertionCode) {
    return `QUnit.test('test', function (assert) { ${assertionCode} });`;
};

/**
 * @param {string} assertionCode
 * @returns {string}
 */
exports.wrapInArrowTest = function (assertionCode) {
    return `QUnit.test('test', (assert) => { ${assertionCode} });`;
};
