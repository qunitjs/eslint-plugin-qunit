/**
 * @fileoverview Utility functions used by one or more rules.
 * @author Kevin Partington
 */
"use strict";

const assert = require("node:assert");

const SUPPORTED_TEST_IDENTIFIERS = new Set(["test", "asyncTest", "only"]);

const OLD_MODULE_HOOK_IDENTIFIERS = ["setup", "teardown"];
const NEW_MODULE_HOOK_IDENTIFIERS = [
    "before",
    "beforeEach",
    "afterEach",
    "after",
];
const ALL_MODULE_HOOK_IDENTIFIERS = new Set([
    ...OLD_MODULE_HOOK_IDENTIFIERS,
    ...NEW_MODULE_HOOK_IDENTIFIERS,
]);

const ASSERTION_METADATA = {
    deepEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    equal: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    false: {
        allowedArities: [1],
    },
    notDeepEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    notEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    notOk: {
        allowedArities: [1],
    },
    notPropEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    notStrictEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    ok: {
        allowedArities: [1],
    },
    propEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    strictEqual: {
        allowedArities: [2],
        compareActualFirst: true,
    },
    raises: {
        allowedArities: [1, 2],
    },
    throws: {
        allowedArities: [1, 2],
    },
    true: {
        allowedArities: [1],
    },
};

function getAssertionNames() {
    return Object.keys(ASSERTION_METADATA);
}

exports.getAssertionNames = getAssertionNames;

/**
 * @param {import('estree').Node} calleeNode
 * @param {string | null} assertVar
 * @returns {{allowedArities: number[], compareActualFirst?: boolean} | null}
 */
function getAssertionMetadata(calleeNode, assertVar) {
    if (calleeNode.type === "MemberExpression") {
        if (
            calleeNode.object &&
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === assertVar &&
            calleeNode.property &&
            calleeNode.property.type === "Identifier" &&
            Object.hasOwnProperty.call(
                ASSERTION_METADATA,
                calleeNode.property.name,
            )
        ) {
            const assertionName =
                /** @type {keyof typeof ASSERTION_METADATA} */ (
                    calleeNode.property.name
                );
            return ASSERTION_METADATA[assertionName];
        }
    } else if (
        calleeNode.type === "Identifier" &&
        Object.hasOwnProperty.call(ASSERTION_METADATA, calleeNode.name)
    ) {
        const assertionName = /** @type {keyof typeof ASSERTION_METADATA} */ (
            calleeNode.name
        );
        return ASSERTION_METADATA[assertionName];
    }

    return null;
}

/**
 * @param {import('estree').Node} callExpressionNode
 * @param {string} assertVar
 * @returns {boolean}
 */
exports.isAsyncCallExpression = function (callExpressionNode, assertVar) {
    if (!assertVar) {
        assertVar = "assert";
    }

    return (
        callExpressionNode &&
        callExpressionNode.type === "CallExpression" &&
        callExpressionNode.callee.type === "MemberExpression" &&
        callExpressionNode.callee.object.type === "Identifier" &&
        callExpressionNode.callee.object.name === assertVar &&
        callExpressionNode.callee.property.type === "Identifier" &&
        callExpressionNode.callee.property.name === "async"
    );
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isStop = function (calleeNode) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        result = calleeNode.name === "stop";
    } else if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === "QUnit" &&
            calleeNode.property.type === "Identifier" &&
            calleeNode.property.name === "stop";
    }

    return result;
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isStart = function (calleeNode) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        result = calleeNode.name === "start";
    } else if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === "QUnit" &&
            calleeNode.property.type === "Identifier" &&
            calleeNode.property.name === "start";
    }

    return result;
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isTest = function (calleeNode) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        result = SUPPORTED_TEST_IDENTIFIERS.has(calleeNode.name);
    } else if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === "QUnit" &&
            calleeNode.property.type === "Identifier" &&
            SUPPORTED_TEST_IDENTIFIERS.has(calleeNode.property.name);
    }

    return result;
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isModule = function (calleeNode) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        result = calleeNode.name === "module";
    } else if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === "QUnit" &&
            calleeNode.property.type === "Identifier" &&
            calleeNode.property.name === "module";
    }

    return result;
};

/**
 * @param {import('eslint').Rule.Node} propertyNode
 * @returns {boolean}
 */
exports.isInModule = function (propertyNode) {
    return (
        propertyNode &&
        propertyNode.parent && // ObjectExpression
        propertyNode.parent.parent && // CallExpression?
        propertyNode.parent.parent.type === "CallExpression" &&
        exports.isModule(propertyNode.parent.parent.callee)
    );
};

/**
 * @param {import('estree').Node} identifierNode
 * @returns {boolean}
 */
exports.isModuleHookPropertyKey = function (identifierNode) {
    return (
        identifierNode &&
        identifierNode.type === "Identifier" &&
        ALL_MODULE_HOOK_IDENTIFIERS.has(identifierNode.name)
    );
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isAsyncTest = function (calleeNode) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        result = calleeNode.name === "asyncTest";
    } else if (calleeNode.type === "MemberExpression") {
        result =
            calleeNode.object.type === "Identifier" &&
            calleeNode.object.name === "QUnit" &&
            calleeNode.property.type === "Identifier" &&
            calleeNode.property.name === "asyncTest";
    }

    return result;
};

/**
 * @param {import('estree').Node} calleeNode
 * @param {string} qunitMethod
 * @returns {boolean}
 */
function isQUnitMethod(calleeNode, qunitMethod) {
    let result = false;

    /* istanbul ignore else: will correctly return false */
    if (calleeNode.type === "Identifier") {
        // <qunitMethod>()
        result = calleeNode.name === qunitMethod;
    } else if (
        calleeNode.type === "MemberExpression" &&
        calleeNode.property.type === "Identifier" &&
        calleeNode.property.name === qunitMethod
    ) {
        if (calleeNode.object.type === "Identifier") {
            // QUnit.<qunitMethod>() or module.<qunitMethod>(), or test.<qunitMethod>()
            result =
                calleeNode.object.name === "QUnit" ||
                calleeNode.object.name === "module" ||
                calleeNode.object.name === "test";
        } else if (calleeNode.object.type === "MemberExpression") {
            // QUnit.*.<qunitMethod>()
            result =
                calleeNode.object.object.type === "Identifier" &&
                calleeNode.object.object.name === "QUnit";
        }
    }

    return result;
}

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isOnly = function (calleeNode) {
    return isQUnitMethod(calleeNode, "only");
};

/**
 * @param {import('estree').Node} calleeNode
 * @returns {boolean}
 */
exports.isSkip = function (calleeNode) {
    return isQUnitMethod(calleeNode, "skip");
};

/**
 * @param {import('estree').Node[]} argumentsNodes
 * @returns {string | null}
 */
exports.getAssertContextNameForTest = function (argumentsNodes) {
    const functionExpr = argumentsNodes.find(function (argNode) {
        return (
            argNode.type === "FunctionExpression" ||
            argNode.type === "ArrowFunctionExpression"
        );
    });
    if (!functionExpr) {
        return null;
    }

    return exports.getAssertContextName(functionExpr);
};

/**
 * @param {import('estree').Node} functionExpr
 * @returns {string | null}
 */
exports.getAssertContextName = function (functionExpr) {
    let result = null;

    if (
        functionExpr &&
        (functionExpr.type === "FunctionExpression" ||
            functionExpr.type === "ArrowFunctionExpression") &&
        functionExpr.params
    ) {
        // In TypeScript, `this` can be passed as the first function parameter to add a type to it,
        // and we want to ignore that parameter since we're looking for the `hooks` variable.
        const hooksParam = functionExpr.params.find(
            (p) => p.type === "Identifier" && p.name !== "this",
        );
        if (hooksParam && hooksParam.type === "Identifier") {
            result = hooksParam.name;
        }
    }

    return result;
};

/**
 * @param {import('estree').Node} calleeNode
 * @param {string | null} assertVar
 * @returns {boolean}
 */
exports.isAssertion = function (calleeNode, assertVar) {
    return !!getAssertionMetadata(calleeNode, assertVar);
};

/**
 * @param {import('estree').Node} calleeNode
 * @param {string} assertVar
 * @returns {number[]}
 */
exports.getAllowedArities = function (calleeNode, assertVar) {
    const assertionMetadata = getAssertionMetadata(calleeNode, assertVar);
    if (!assertionMetadata) {
        return [];
    }

    return assertionMetadata.allowedArities;
};

/**
 * @param {import('estree').Node} calleeNode
 * @param {string | null} assertVar
 * @returns {boolean}
 */
exports.isComparativeAssertion = function (calleeNode, assertVar) {
    const assertionMetadata = getAssertionMetadata(calleeNode, assertVar);

    return Object.hasOwnProperty.call(assertionMetadata, "compareActualFirst");
};

/**
 * @param {import('estree').Node} calleeNode
 * @param {string | null} assertVar
 * @returns {boolean}
 */
exports.shouldCompareActualFirst = function (calleeNode, assertVar) {
    const assertionMetadata = getAssertionMetadata(calleeNode, assertVar);
    if (!assertionMetadata) {
        return false;
    }

    return !!assertionMetadata.compareActualFirst;
};

/**
 * @param {string[]} assertions
 * @param {Record<string, {unexpectedGlobalAssertionMessage?: string, unexpectedLocalAssertionMessage?: string, unexpectedGlobalAssertionMessageId?: string, unexpectedLocalAssertionMessageId?: string}>} errorMessageConfig
 */
exports.createAssertionCheck = function (assertions, errorMessageConfig) {
    /**
     * @param {import('eslint').Rule.RuleContext} context
     */
    return function (context) {
        // Declare a test stack in case of nested test cases (not currently
        // supported by QUnit).
        /** @type {Array<{assertVar: string | null}>} */
        const testStack = [];

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isGlobalAssertion(calleeNode) {
            return (
                calleeNode &&
                calleeNode.type === "Identifier" &&
                assertions.includes(calleeNode.name)
            );
        }

        /**
         * @returns {string | null}
         */
        function getCurrentAssertContextVariable() {
            assert(testStack.length, "Test stack should not be empty");

            return testStack[testStack.length - 1].assertVar;
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isMethodCalledOnLocalAssertObject(calleeNode) {
            return (
                calleeNode &&
                calleeNode.type === "MemberExpression" &&
                calleeNode.property.type === "Identifier" &&
                assertions.includes(calleeNode.property.name) &&
                calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === getCurrentAssertContextVariable()
            );
        }

        /**
         * @param {import('estree').Node} calleeNode
         * @returns {boolean}
         */
        function isExpectedAssertion(calleeNode) {
            return (
                isGlobalAssertion(calleeNode) ||
                isMethodCalledOnLocalAssertObject(calleeNode)
            );
        }

        /**
         * @param {import('estree').Node} node
         */
        // eslint-disable-next-line complexity
        function reportError(node) {
            if (node.type !== "CallExpression") {
                return;
            }
            const assertVar = getCurrentAssertContextVariable();
            const isGlobal = isGlobalAssertion(node.callee);
            // eslint-disable-next-line no-nested-ternary
            const assertion = isGlobal
                ? // eslint-disable-next-line unicorn/no-nested-ternary
                  node.callee.type === "Identifier"
                    ? node.callee.name
                    : null
                : // eslint-disable-next-line unicorn/no-nested-ternary
                  node.callee.type === "MemberExpression" &&
                    node.callee.property.type === "Identifier"
                  ? node.callee.property.name
                  : null;
            if (!assertion) {
                return;
            }

            /** @type {{node: import('estree').CallExpression, data: Record<string,string>, messageId?: string, message?: string}} */
            const reportErrorObject = {
                node,
                data: {
                    assertVar: assertVar ?? "",
                    assertion,
                },
            };
            const errorMessageConfigForAssertion =
                errorMessageConfig[assertion];
            if (
                errorMessageConfigForAssertion.unexpectedGlobalAssertionMessageId &&
                errorMessageConfigForAssertion.unexpectedLocalAssertionMessageId
            ) {
                reportErrorObject.messageId = isGlobal
                    ? errorMessageConfigForAssertion.unexpectedGlobalAssertionMessageId
                    : errorMessageConfigForAssertion.unexpectedLocalAssertionMessageId;
            } else {
                reportErrorObject.message = isGlobal
                    ? errorMessageConfigForAssertion.unexpectedGlobalAssertionMessage
                    : errorMessageConfigForAssertion.unexpectedLocalAssertionMessage;
            }

            if (reportErrorObject.messageId) {
                context.report({
                    node: reportErrorObject.node,
                    messageId: reportErrorObject.messageId,
                    data: reportErrorObject.data,
                });
            } else if (reportErrorObject.message) {
                context.report({
                    node: reportErrorObject.node,
                    message: reportErrorObject.message,
                    data: reportErrorObject.data,
                });
            } else {
                assert(false, "No messageId or message found");
            }
        }

        return {
            /**
             * @param {import('estree').Node} node
             */
            CallExpression: function (node) {
                /* istanbul ignore else: correctly does nothing */
                if (
                    node.type === "CallExpression" &&
                    (exports.isTest(node.callee) ||
                        exports.isAsyncTest(node.callee))
                ) {
                    const assertVar = exports.getAssertContextNameForTest(
                        node.arguments,
                    );
                    testStack.push({
                        assertVar,
                    });
                } else if (
                    testStack.length > 0 &&
                    node.type === "CallExpression" &&
                    isExpectedAssertion(node.callee)
                ) {
                    reportError(node);
                }
            },
            /**
             * @param {import('estree').Node} node
             */
            "CallExpression:exit": function (node) {
                /* istanbul ignore else: correctly does nothing */
                if (
                    node.type === "CallExpression" &&
                    (exports.isTest(node.callee) ||
                        exports.isAsyncTest(node.callee))
                ) {
                    testStack.pop();
                }
            },
        };
    };
};
